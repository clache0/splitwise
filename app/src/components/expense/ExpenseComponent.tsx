import { Expense, Group, User } from "../group/GroupComponent";
import "../../styles/components/expense/ExpenseComponent.css"
import Button from "../general/Button";
import { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import { getNameFromId, formatDate } from "../../utils/utils";

interface ExpenseComponentProps {
  group: Group | null;
  expense: Expense;
  users: User[] | null;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

const ExpenseComponent: React.FC<ExpenseComponentProps> = ({ 
  group,
  expense,
  users,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const participants = expense.participants;
  const participantNames = participants.map((participant, index) => {
    return <p key={index} className="expense-participants" >{getNameFromId(participant.memberId, users!)}</p>;
  });

  const payerName = getNameFromId(expense.payerId, users!);

  return (
    <>
      {expense ?
        <div className="expense-container">
          <div className="expense-left">
            <div className="expense-1">
              <h3 className="expense-title">{expense.title}</h3>
              {expense.settled && <span>, settled</span>}
            </div>
            <p className="expense-date">{formatDate(new Date(expense.date))}</p>
          </div>
          <div className="expense-right">
            <p className="expense-amount">{payerName} paid ${expense.amount.toFixed(2)} </p>
            <div className="expense-participants">Participant{participantNames.length >= 2 && 's'} {participantNames}</div>
            <div className="expense-actions">
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