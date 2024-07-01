import { Expense, Group, User } from "../group/GroupComponent";
import "../../styles/components/expense/ExpenseComponent.css"
import Button from "../general/Button";
import { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";

interface ExpenseComponentProps {
  group: Group | null;
  expense: Expense;
  users: User[] | null;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ group, expense, users, onUpdateExpense, onDeleteExpense }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
            <h3 className="expense-title">{expense.title}</h3>
            <p className="expense-date">{formatDate(new Date(expense.date))}</p>
          </div>
          <div className="expense-right">
            <p className="expense-amount">{getPayerName(expense.payerId)} paid: {expense.amount}</p>
            <Button
              label='Edit'
              onClick={() => setIsEditing(true)}
              backgroundColor='var(--primary-color)'
            />
            <Button
              label='Delete'
              onClick={() => { onDeleteExpense(expense) }}
              backgroundColor='var(--red)'
            />
          </div>
        </div>
        : <p>expense not loaded</p>
      }

      {isEditing && (
        <AddExpenseForm 
          onSubmit={(updatedExpense: Expense) => {
            onUpdateExpense(updatedExpense);
            setIsEditing(false);
          }}
          onShowForm={setIsEditing}
          group={group}
          users={users}
          expense={expense}
        />
      )}
    </>
  );
};

export default ExpenseComponent;