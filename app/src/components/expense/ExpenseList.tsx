import ExpenseComponent from "./ExpenseComponent";
import { Expense } from "../group/GroupComponent";

interface ExpenseListProps {
  groupExpenses: Expense[] | null;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ groupExpenses }) => {
  
  if (!groupExpenses) return <p>Group expenses null</p>

  const expenseComponents = groupExpenses.length !== 0 ?
    groupExpenses?.map((expense, index) => {
      const key = expense._id || index.toString();
      return <ExpenseComponent key={key} expense={expense} />
    }) : <p>No expenses in list</p>;

  return (
    <>
      <h2>Expense List</h2>
      {expenseComponents}
    </>
  );
};

export default ExpenseList;