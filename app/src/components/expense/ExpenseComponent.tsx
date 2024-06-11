import { Expense } from "../group/GroupComponent";

interface ExpenseComponentProps {
  expense: Expense | null;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ expense }) => {
  return (
    <>
      {expense ?
        <div>
          <h3>title: {expense.title}</h3>
          <p>amount: {expense.amount}</p>
          <p>date: {expense.date.toString()}</p>
        </div>
        : <p>expense not loaded</p>
      }
    </>
  );
};

export default ExpenseComponent;