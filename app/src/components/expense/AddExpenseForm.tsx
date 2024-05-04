import React, { useEffect, useState } from 'react';
import { Group, Expense, User } from '../group/GroupComponent';
import { z } from 'zod';

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
  group: Group | null;
  users: User[] | null;
};

const AddExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, group, users }) => {
  const [groupId, setGroupId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [date, setDate] = useState<string>('');
  const [payerId, setPayerId] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);

  // initialize participants with group.members
  useEffect(() => {
    if (group && group.members.length >= 2) {
      setParticipants([group.members[0]._id, group.members[1]._id]);
    }
  }, [group]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const parsedData = expenseSchema.parse({
        groupId: groupId,
        title: title,
        amount: +amount,
        date: date,
        payerId: payerId,
        participants: participants.map((memberId) => ({ memberId, share: +'0' })),
      });

      // Call the callback function to add the new expense
      onAddExpense(parsedData);

      // Clear form inputs
      setGroupId('');
      setTitle('');
      setAmount('0');
      setDate('');
      setPayerId('');
      setParticipants([]);
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };
  

  return (
    <>
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
          <label htmlFor="participant">Selected participants</label>
          {users && 
            users.map((user, index) => (
              <div key={user._id || index}>
                <label htmlFor={user._id}>
                  <input
                    type='checkbox' 
                    id={user._id || ''}
                    value={user._id || ''}
                    checked={participants.includes(user._id || '')}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      setParticipants((prevParticipants) => 
                        isChecked
                        ? [...prevParticipants, user._id || '']
                        : prevParticipants.filter((id) => id !== user._id)  
                      );
                    }}
                  />
                  {user.firstName} {user.lastName}
                </label>
              </div>
            ))
          }
        </div>
        <button type="submit">Add Expense</button>
      </form>
    </>
  );
};

export default AddExpenseForm;
