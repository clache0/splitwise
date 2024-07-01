import ExpenseComponent from "./ExpenseComponent";
import { Expense, Group, User } from "../group/GroupComponent";
import "../../styles/components/expense/ExpenseList.css"

interface ExpenseListProps {
  group: Group | null;
  groupExpenses: Expense[] | null;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  users: User[] | null;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ group, groupExpenses, onUpdateExpense, onDeleteExpense, users }) => {
  
  if (!groupExpenses) return <p>Group expenses null</p>

  const sortedExpenses = [...groupExpenses].sort((a, b) => (
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ));

  const expenseComponents = sortedExpenses.length !== 0 ?
  sortedExpenses?.map((expense, index) => {
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