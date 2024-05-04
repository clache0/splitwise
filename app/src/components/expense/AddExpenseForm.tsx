import React, { useEffect, useState } from 'react';
import { Group, Expense, Participant } from '../group/GroupComponent';
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
};

const AddExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, group }) => {
  const [groupId, setGroupId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [date, setDate] = useState<string>('');
  const [payerId, setPayerId] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);

  // console.log('group.members: ', group ? group.members : null);

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
        participants: participants.map(memberId => ({ memberId, share: +'0' })),
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
          <select id="participant" 
            multiple value={participants} 
            onChange={(event) => setParticipants(Array.from(event.target.selectedOptions, option => option.value))}
          >
            {group && group.members.map((member) => (
              <option key={member._id} value={member._id}>{member._id}</option>
            ))}
          </select>
        </div>
        <button type="submit">Add Expense</button>
      </form>
    </>
  );
};

export default AddExpenseForm;
