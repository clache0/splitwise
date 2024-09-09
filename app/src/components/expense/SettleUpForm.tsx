import React, { useState } from 'react';
import { User, Expense, Participant } from '../group/GroupComponent';
import '../../styles/components/expense/SettleUpForm.css';
import { getNameFromId } from '../../api/utils';

interface SettleUpFormProps {
  onSubmit: (expense: Expense) => void;
  onShowForm: (show: boolean) => void;
  users: User[];
  groupId: string;
}

const SettleUpForm: React.FC<SettleUpFormProps> = ({ onSubmit, onShowForm, users, groupId }) => {
  const [payerId, setPayerId] = useState<string>('');
  const [payeeId, setPayeeId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));

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
      title: `${getNameFromId(payerId, users)} paid ${getNameFromId(payeeId, users)}`,
      amount: amount,
      date: date,
      payerId: payerId,
      participants: participants,
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
              <option value="">Select Payer</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="payee">Payee</label>
            <select
              id="payee"
              value={payeeId}
              onChange={(event) => setPayeeId(event.target.value)}
            >
              <option value="">Select Payee</option>
              {users.map((user) => (
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
              type="date"
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
