import React, { useState } from 'react';
import '../../styles/components/expense/SettleUpForm.css';
import { getCurrentDate, getNameFromId } from '../../utils/utils';
import { Expense, Participant } from '../../types/types';
import { useGroupContext } from '../../context/GroupContext';

interface SettleUpFormProps {
  onSubmit: (expense: Expense) => void;
  onShowForm: (show: boolean) => void;
  groupId: string;
}

const SettleUpForm: React.FC<SettleUpFormProps> = ({ onSubmit, onShowForm, groupId }) => {
  const { groupUsers } = useGroupContext();
  const [payerId, setPayerId] = useState<string>('');
  const [payeeId, setPayeeId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(getCurrentDate());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!payerId || !payeeId || payerId === payeeId || amount <= 0) {
      return alert('Please fill in all fields correctly.');
    }

    // payer contributes full amount
    const participants: Participant[] = [
      { memberId: payerId, share: 100 },
      { memberId: payeeId, share: 0 }
    ];

    const newExpense: Expense = {
      groupId: groupId,
      title: `${getNameFromId(payerId, groupUsers)} paid ${getNameFromId(payeeId, groupUsers)}`,
      amount: amount,
      date: date,
      payerId: payerId,
      participants: participants,
      settled: false,
      type: 'settle-up',
    };

    onSubmit(newExpense);
    onShowForm(false); // close form
  };

  return (
    <div className="settle-up-form-backdrop">
      <div className="settle-up-form-content">
        <h2>Settle Up</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div>
            <label htmlFor="payer">Payer</label>
            <select
              id="payer"
              value={payerId}
              onChange={(event) => setPayerId(event.target.value)}
            >
              <option value="">Select payer</option>
              {groupUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="payee">Who gets paid</label>
            <select
              id="payee"
              value={payeeId}
              onChange={(event) => setPayeeId(event.target.value)}
            >
              <option value="">Select person who gets paid</option>
              {groupUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(event) => setAmount(parseFloat(event.target.value))}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <button type="submit">Settle Up</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default SettleUpForm;
