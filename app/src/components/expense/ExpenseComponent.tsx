import { Expense, User } from "../group/GroupComponent";
import "../../styles/components/expense/ExpenseComponent.css"

interface ExpenseComponentProps {
  expense: Expense | null;
  users: User[] | null;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ expense, users }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});
  };

  const getPayerName = (payerId: string) => {
    const payer = users?.find(user => user._id === payerId);
    return payer ? `${payer.firstName} ${payer.lastName}` : 'Unknown'
  }

  return (
    <>
      {expense ?
        <div className="expense-container">
          <div className="expense-left">
            <p className="expense-date">{formatDate(new Date(expense.date))}</p>
            <h3 className="expense-title">{expense.title}</h3>
          </div>
          <div className="expense-right">
            <p className="expense-amount">{getPayerName(expense.payerId)} paid: {expense.amount}</p>
          </div>
        </div>
        : <p>expense not loaded</p>
      }
    </>
  );
};

export default ExpenseComponent;