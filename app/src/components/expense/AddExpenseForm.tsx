import React, { useEffect, useState } from 'react';
import { Group, Expense, User } from '../group/GroupComponent';
import { z } from 'zod';
import "../../styles/components/expense/AddExpenseForm.css"

const expenseSchema = z.object({
  _id: z.string().optional(),
  groupId: z.string(),
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  payerId: z.string(),
  participants: z.array(
    z.object({
      memberId: z.string(),
      share: z.number(),
    })
  ),
});

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  onShowForm: (showAddExpenseForm: boolean) => void;
  group: Group | null;
  users: User[] | null;
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const AddExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onShowForm, group, users }) => {
  const [groupId, setGroupId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [payerId, setPayerId] = useState<string>('');
  const [participants, setParticipants] = useState<User[] | null>([]);
  const [share, setShare] = useState<number>(0);

  // initialize groupId with group._id
  useEffect(() => {
    if (group) {
      setGroupId(group._id || '');
    }
  }, [group]);

  // initialize payerId with first user
  useEffect(() => {
    if (users && users.length > 0) {
      setPayerId(users[0]._id || '');
    }
  }, [users]);

  // initialize participants with all group members
  useEffect(() => {
    if (users) {
      setParticipants(users);
    }
  }, [users]);

  // calculate total share when participants change
  useEffect(() => {
    const numParticipants = participants ? participants.length : 0;
    const sharePerParticipant = numParticipants > 0 ? 100 / numParticipants : 0;
    setShare(sharePerParticipant);
  }, [participants]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const parsedData = expenseSchema.parse({
        groupId: groupId,
        title: title,
        amount: +amount,
        date: date,
        payerId: payerId,
        participants: participants ? participants.map((participant) => (
          { 
            memberId: participant._id,
            share: share,
          }
        )) : [],
      });
      
      if (parsedData.groupId) {
        // Call the callback function to add the new expense
        onAddExpense(parsedData);

        // Clear form inputs
        setTitle('');
        setAmount('');
      }
      else {
        console.error("Group Id is missing from expense");
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleParticipantChange = (user: User, isChecked: boolean) => {
    setParticipants((prevParticipants) => (
      isChecked
      ? [...(prevParticipants ?? []), user]
      : (prevParticipants ?? []).filter((p) => p._id !== user._id)
    ));
  };
  

  return (
    <div className='add-expense-form-backdrop'>
      <div className='add-expense-form-content'>
        <h2>Add Expense Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
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
          <div>
            <label htmlFor="payer">Payer</label>
            <select 
              id="payer" 
              value={payerId} 
              onChange={(event) => setPayerId(event.target.value)}
            >
              <option value="">Select payer</option>
              {users && 
                users.map((user) => (
                  <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label htmlFor="participant">Selected participants</label>
            <div className='participant-list'>
              {users && 
                users.map((user, index) => (
                  <div key={user._id || index} className='participant-item'>
                    <label htmlFor={user._id}>{user.firstName} {user.lastName}</label>
                    <input
                      type='checkbox' 
                      id={user._id || ''}
                      value={user._id || ''}
                      checked={participants?.includes(user)}
                      onChange={(event) => handleParticipantChange(user, event.target.checked)}
                    />
                  </div>
                ))
              }
            </div>
          </div>
          <button type="submit">Add Expense</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
