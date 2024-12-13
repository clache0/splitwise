import React, { useEffect, useState } from 'react';
import "../../styles/components/expense/AddExpenseForm.css"
import { getCurrentDate } from '../../utils/utils';
import { User, Expense, expenseSchema } from '../../types/types';
import { useGroupContext } from '../../context/GroupContext';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  onShowForm: (showAddExpenseForm: boolean) => void;
  expense?: Expense; // optional expense for update
  defaultUserId?: string;
};

const AddExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onSubmit,
  onShowForm,
  expense,
  defaultUserId
}) => {
  const { group, groupUsers } = useGroupContext();
  const [groupId, setGroupId] = useState<string>(expense?.groupId || '');
  const [title, setTitle] = useState<string>(expense?.title || '');
  const [amount, setAmount] = useState<string>(expense?.amount.toFixed(2) || '');
  const [date, setDate] = useState<string>(expense?.date || getCurrentDate());
  const [payerId, setPayerId] = useState<string>(expense?.payerId || defaultUserId || '');
  const [participants, setParticipants] = useState<User[]>(
    expense?.participants.map(
      p => groupUsers?.find(
        u => u._id === p.memberId // match ids to users
      )).filter(
        (u): u is User => !!u // filter out undefined users
      ) || []
  );
  const [share, setShare] = useState<number>(0);
  const settled = expense?.settled || false;
  const type = expense?.type || 'normal';

  // initialize groupId with group._id
  useEffect(() => {
    if (group) {
      setGroupId(group._id || '');
    }
  }, [group]);

  // initialize participants with all group members
  useEffect(() => {
    if (groupUsers) {
      setParticipants(groupUsers);
    }
  }, [groupUsers]);

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
        _id: expense?._id, // include id if update
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
        settled: settled,
        type: type,
      });
      
      // check groupId exist before adding expense
      if (parsedData.groupId) {
        // Call the callback function to add the new expense
        onSubmit(parsedData);
        onShowForm(false); // close form

        if (!expense) {
          // Clear form inputs
          setTitle('');
          setAmount('');
        }
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
        <h2>{expense ? 'Update Expense Form' : 'Add Expense Form'}</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
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
              type="datetime-local"
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
              {groupUsers && 
                groupUsers.map((user) => (
                  <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label htmlFor="participant">Selected participants</label>
            <div className='participant-list'>
              {groupUsers && 
                groupUsers.map((user, index) => (
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
          <button type="submit">{expense ? 'Update Expense' : 'Add Expense'}</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
