import ExpenseComponent from "./ExpenseComponent";
import "../../styles/components/expense/ExpenseList.css"
import { useEffect, useState } from "react";
import { Expense } from "../../types/types";
import { useGroupContext } from "../../context/GroupContext";

interface ExpenseListProps {
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onFilteredExpensesChange: (filteredExpenses: Expense[] | []) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  onUpdateExpense,
  onDeleteExpense,
  onFilteredExpensesChange 
}) => {

  const { settledExpenses, unsettledExpenses, setFetchedSettledExpenses } = useGroupContext();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | null>([]);
  const [showSettled, setShowSettled] = useState<boolean>(false);
  const [settledPage, setSettledPage]= useState<number>(1);
  const SETTLED_PAGE_SIZE = 20;

  // check if no settledExpenses
  if (!settledExpenses) return <p>No unsettled expenses</p>;

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
  }

  const handleShowSettledClick = () => {
    setFetchedSettledExpenses(true);
    setShowSettled((prev) => !prev);
    setSettledPage(1);
  }

  const handleShowMoreSettled = () => {
    console.log("show more settled clicked");
    setSettledPage((prevPage) => prevPage + 1);
  }

  // boolean: more settled expenses not displayed
  const hasMoreSettledExpenses = settledPage * SETTLED_PAGE_SIZE < settledExpenses.length;
  
  // source expenses to be filtered
  const sourceExpenses = showSettled
    ? [...settledExpenses.slice(0, settledPage * SETTLED_PAGE_SIZE), ...unsettledExpenses]
    : unsettledExpenses;

  // function: filter expenses by month, year, settled
  const filterExpenses = (expenses: Expense[]) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth() + 1;
      const expenseYear = expenseDate.getFullYear();

      const monthMatches = selectedMonth ? parseInt(selectedMonth) === expenseMonth : true;
      const yearMatches = selectedYear ? parseInt(selectedYear) === expenseYear : true;
      const settledMatches = showSettled || !expense.settled;

      return monthMatches && yearMatches && settledMatches;
    })
  };

  // filter expenses when month, year, or expenses changes
  useEffect(() => {
    const filtered = filterExpenses(sourceExpenses);
    setFilteredExpenses(filtered);
    onFilteredExpensesChange(filtered); // pass filtered expenses to parent component
  }, [selectedMonth, selectedYear, showSettled, settledPage, settledExpenses, unsettledExpenses]);

  // sort expenses from most recent to oldest
  const sortedExpenses = filteredExpenses?.sort((a, b) => (
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ));

  // ExpenseComponents to be rendered
  const expenseComponents = sortedExpenses?.map((expense, index) => {
      return (
        <li key={expense._id || index}>
          <ExpenseComponent 
            expense={expense}
            onUpdateExpense={onUpdateExpense}
            onDeleteExpense={onDeleteExpense}
          />
        </li>
      );
    });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return (
    <div className="expense-list-container">

      <h2>Expense List</h2>

      {/* Filters */}
      <div className="filter-container">
        <select value={selectedMonth || ""} onChange={handleMonthChange}>
          <option value="">All Months</option>
          {monthNames.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <select value={selectedYear || ""} onChange={handleYearChange}>
          <option value="">All Years</option>
          {Array.from(
            new Set(
              sourceExpenses.map((expense) => new Date(expense.date).getFullYear())
            )
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button className="clear-filter-button" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
  
      {/* Group Expenses */}
      {sourceExpenses.length === 0 ? (
        <p>No expenses in list</p>
      ) : (
        <>
          {/* Expense Components */}
          <ul className='expense-list'>
            {expenseComponents}
          </ul>
        </>
      )}

      {/* Show Settled */}
      <div className="settled-container">
        <p>All expenses before this date have been settled</p>
        {showSettled && hasMoreSettledExpenses && (
          <button
            onClick={handleShowMoreSettled}
            className="toggle-link-button"
          >
            Show More Settled Expenses
          </button>
        )}
        <button
          onClick={handleShowSettledClick}
          className="toggle-link-button"
        >
          {showSettled ? "Hide Settled Expenses" : "Show Settled Expenses"}
        </button>
      </div>
    </div>
  );  
};

export default ExpenseList;