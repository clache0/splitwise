import React from 'react';
import { Expense, User } from '../group/GroupComponent';
import "../../styles/components/group/GroupBalances.css"

interface GroupBalancesProps {
  groupExpenses: Expense[];
  users: User[];
}

interface Balance {
  [memberId: string]: {
    owes: { [owedTo: string]: number };
    isOwed: { [owedBy: string]: number };
    netBalance: number;
  };
}

const calculateBalances = (groupExpenses: Expense[], users: User[]): Balance => {
  const balances: Balance = {};

  users.forEach(user => {
    balances[user._id!] = {
      owes: {},
      isOwed: {},
      netBalance: 0,
    };
  });

  groupExpenses.forEach(expense => {
    const totalAmount = expense.amount;
    const payerId = expense.payerId;

    expense.participants.forEach(participant => {
      const participantId = participant.memberId;
      const participantShare = (participant.share / 100) * totalAmount; // calc percentage of total

      if (payerId !== participantId) {
        // Payer gives money to the participant
        balances[payerId].isOwed[participantId] = (balances[payerId].isOwed[participantId] || 0) + participantShare;
        balances[participantId].owes[payerId] = (balances[participantId].owes[payerId] || 0) + participantShare;
        balances[payerId].netBalance += participantShare;
        balances[participantId].netBalance -= participantShare;
      }
    });
  });

  return balances;
};

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupExpenses, users }) => {
  const balances = calculateBalances(groupExpenses, users);

  return (
    <div className='group-balances-container'>
      <h2>Group Balances</h2>
      {users.map(user => (
        <div className='balance-item' key={user._id}>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>Net Balance: {balances[user._id!].netBalance.toFixed(2)}</p>
          {balances[user._id!].owes && Object.keys(balances[user._id!].owes).length > 0 && (
            <div>
                {/* <h4>Owes:</h4> */}
                <ul>
                  {Object.entries(balances[user._id!].owes).map(([owedTo, amount]) => (
                    <li key={owedTo}>
                      Owes {users.find(u => u._id === owedTo)?.firstName} {users.find(u => u._id === owedTo)?.lastName} ${amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
            </div>
          )}
          {balances[user._id!].isOwed && Object.keys(balances[user._id!].isOwed).length > 0 && (
            <div>
              {/* <h4>Is Owed By:</h4> */}
              <ul>
                {Object.entries(balances[user._id!].isOwed).map(([owedBy, amount]) => (
                  <li key={owedBy}>
                    Is owed ${amount.toFixed(2)} by {users.find(u => u._id === owedBy)?.firstName} {users.find(u => u._id === owedBy)?.lastName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupBalances;
