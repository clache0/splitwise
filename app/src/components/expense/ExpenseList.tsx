import ExpenseComponent from "./ExpenseComponent";
import "../../styles/components/expense/ExpenseList.css"
import { useEffect, useState } from "react";
import { Group, User, Expense } from "../../types/types";

interface ExpenseListProps {
  group: Group | null;
  groupExpenses: Expense[] | null;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  users: User[] | null;
  onFilteredExpensesChange: (filteredExpenses: Expense[] | null) => void;
}

const ITEMS_PER_PAGE = 20;

const ExpenseList: React.FC<ExpenseListProps> = ({
  group,
  groupExpenses,
  onUpdateExpense,
  onDeleteExpense,
  users,
  onFilteredExpensesChange 
}) => {

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | null>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // check if no groupExpenses
  if (!groupExpenses) return <p>Group expenses null</p>;

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

  // function: filter expenses by month, year
  const filterExpenses = (expenses: Expense[]) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth() + 1;
      const expenseYear = expenseDate.getFullYear();

      const monthMatches = selectedMonth ? parseInt(selectedMonth) === expenseMonth : true;
      const yearMatches = selectedYear ? parseInt(selectedYear) === expenseYear : true;

      return monthMatches && yearMatches;
    })
  };

  // filter expenses when month, year, or expenses changes
  useEffect(() => {
    const filtered = filterExpenses(groupExpenses);
    setFilteredExpenses(filtered);
    onFilteredExpensesChange(filtered); // pass filtered expenses to parent component
    setCurrentPage(1); // reset to page 1
  }, [selectedMonth, selectedYear, groupExpenses]);

  // sort expenses from most recent to oldest
  const sortedExpenses = filteredExpenses?.sort((a, b) => (
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ));

  const totalPages = Math.ceil((sortedExpenses?.length || 0) / ITEMS_PER_PAGE);

  const paginatedExpenses = sortedExpenses?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage+1, totalPages)); // handle max pages
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage-1, 1)); // handle min pages
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const expenseComponents = paginatedExpenses?.length !== 0 ?
  paginatedExpenses?.map((expense, index) => {
      return (
        <li key={expense._id || index}>
          <ExpenseComponent 
            group={group}
            expense={expense}
            users={users}
            onUpdateExpense={onUpdateExpense}
            onDeleteExpense={onDeleteExpense}
          />
        </li>
      );
    }) : <p>No expenses in list</p>;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return (
    <div className="expense-list-container">

      <h2>Expense List</h2>

      <div className="filter-container">
        <select value={selectedMonth || ""} onChange={handleMonthChange}>
          <option value="">All Months</option>
          {monthNames.map((month, index) => (
            <option key={index} value={index+1}>{month}</option>
          ))}
        </select>

        <select value={selectedYear || ""} onChange={handleYearChange}>
          <option value="">All Years</option>
          {Array.from(new Set(groupExpenses.map(expense => new Date(expense.date).getFullYear()))).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button className="clear-filter-button" onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <ul className='expense-list'>
        {expenseComponents}
      </ul>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}

        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

    </div>
  );
};

export default ExpenseList;