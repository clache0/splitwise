import { Expense } from "../group/GroupComponent";

interface ExpenseComponentProps {
  key: string;
  expense: Expense | null;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ expense }) => {
  return (
    <>
      {/* <h5>ExpenseComponent</h5> */}
      {expense ?
        <div>
          {/* <p>_id: {expense._id}</p> */}
          {/* <p>groupId: {expense.groupId}</p> */}
          <h3>title: {expense.title}</h3>
          <p>amount: {expense.amount}</p>
          <p>date: {expense.date.toString()}</p>
          {/* <p>payerId: {expense.payerId}</p> */}
        </div>
        : <p>expense not loaded</p>
      }
    </>
  );
};

export default ExpenseComponent;