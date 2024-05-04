import ExpenseComponent from "./ExpenseComponent";
import { Expense } from "../group/GroupComponent";

interface ExpenseListProps {
  groupExpenses: Expense[] | null;
}
const ExpenseList: React.FC<ExpenseListProps> = ({ groupExpenses }) => {
  
  const expenseComponents = groupExpenses ?
    groupExpenses?.map((expense, index) => {
      const key = expense._id || index.toString();
      return <ExpenseComponent key={key} expense={expense} />
    }) : null;

  return (
    <>
      <h2>Expense List</h2>
      {expenseComponents}
    </>
  );
};

export default ExpenseList;