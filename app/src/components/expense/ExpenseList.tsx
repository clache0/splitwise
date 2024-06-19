import ExpenseComponent from "./ExpenseComponent";
import { Expense, User } from "../group/GroupComponent";
import Button from "../general/Button";
import "../../styles/components/expense/ExpenseList.css"

interface ExpenseListProps {
  groupExpenses: Expense[] | null;
  onDeleteExpense: (expense: Expense) => void;
  users: User[] | null;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ groupExpenses, onDeleteExpense, users }) => {
  
  if (!groupExpenses) return <p>Group expenses null</p>

  const sortedExpenses = [...groupExpenses].sort((a, b) => (
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ));

  const expenseComponents = sortedExpenses.length !== 0 ?
  sortedExpenses?.map((expense, index) => {
      return (
        <li key={expense._id || index}>
          <ExpenseComponent expense={expense} users={users} />
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
      <ul className='expense-list'>
        {expenseComponents}
      </ul>
    </>
  );
};

export default ExpenseList;