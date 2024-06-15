import ExpenseComponent from "./ExpenseComponent";
import { Expense } from "../group/GroupComponent";
import Button from "../general/Button";

interface ExpenseListProps {
  groupExpenses: Expense[] | null;
  onDeleteExpense: (expense: Expense) => void;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ groupExpenses, onDeleteExpense }) => {
  
  if (!groupExpenses) return <p>Group expenses null</p>

  const sortedExpenses = [...groupExpenses].sort((a, b) => (
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ));

  const expenseComponents = sortedExpenses.length !== 0 ?
  sortedExpenses?.map((expense, index) => {
      return (
        <li key={expense._id || index}>
          <ExpenseComponent expense={expense} />
          <Button
            label='Delete'
            onClick={() => { onDeleteExpense(expense) }}
          />
        </li>
      );
    }) : <p>No expenses in list</p>;

  return (
    <>
      <h2>Expense List</h2>
      {expenseComponents}
    </>
  );
};

export default ExpenseList;