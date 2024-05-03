import ExpenseComponent from "./ExpenseComponent";
import { Expense } from "../group/GroupComponent";

interface ExpenseListProps {
  groupExpenses: Expense[] | null;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ groupExpenses }) => {
  
  const expenseComponents = groupExpenses ?
    groupExpenses.map((expense) => {
      return <ExpenseComponent key={expense._id} expense={expense} />
    }) : null;

  return (
    <>
      <div>Expense List</div>
      {expenseComponents}
    </>
  );
};

export default ExpenseList;