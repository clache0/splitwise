import { Expense, Group, User } from "../group/GroupComponent";
import "../../styles/components/expense/ExpenseComponent.css"
import Button from "../general/Button";
import { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import { getNameFromId, formatDate } from "../../api/utils";

interface ExpenseComponentProps {
  group: Group | null;
  expense: Expense;
  users: User[] | null;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ group, expense, users, onUpdateExpense, onDeleteExpense }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);



  return (
    <>
      {expense ?
        <div className="expense-container">
          <div className="expense-left">
            <h3 className="expense-title">{expense.title}</h3>
            <p className="expense-date">{formatDate(new Date(expense.date))}</p>
          </div>
          <div className="expense-right">
            <p className="expense-amount">{getNameFromId(expense.payerId, users!)} paid: {expense.amount}</p>
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