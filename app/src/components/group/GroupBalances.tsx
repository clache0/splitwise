import React, { useEffect, useState } from 'react';
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

    // check if settle up expense
    if (expense.participants.length === 2) {
      const participant1 = expense.participants[0];
      const participant2 = expense.participants[1];
      
      if ((participant1.share === 100 && participant2.share === 0)) {
        const payeeId = participant2.memberId;
        const payeeShare = totalAmount;

        balances[payerId].isOwed[payeeId] = (balances[payerId].isOwed[payeeId] || 0) + payeeShare;
        balances[payeeId].owes[payerId] = (balances[payeeId].owes[payerId] || 0) + payeeShare;
        balances[payerId].netBalance += payeeShare;
        balances[payeeId].netBalance -= payeeShare;

        return;
      }
    }

    // normal expense calculations
    expense.participants.forEach(participant => {
      const participantId = participant.memberId;
      const participantShare = (participant.share / 100) * totalAmount; // calc percentage of total

      if (payerId !== participantId) {
        balances[payerId].isOwed[participantId] = (balances[payerId].isOwed[participantId] || 0) + participantShare;
        balances[participantId].owes[payerId] = (balances[participantId].owes[payerId] || 0) + participantShare;
        balances[payerId].netBalance += participantShare;
        balances[participantId].netBalance -= participantShare;
      }
    });
  });

  // net balances between pairs of participants
  users.forEach(user => {
    Object.keys(balances[user._id!].owes).forEach(owedTo => {
      const owesAmount = balances[user._id!].owes[owedTo] || 0;
      const isOwedAmount = balances[user._id!].isOwed[owedTo] || 0;

      if (isOwedAmount > 0) {
        const netAmount = owesAmount - isOwedAmount;

        if (netAmount > 0) {
          balances[user._id!].owes[owedTo] = netAmount;
          delete balances[user._id!].isOwed[owedTo];
        } else if (netAmount < 0) {
          balances[user._id!].isOwed[owedTo] = -netAmount;
          delete balances[user._id!].owes[owedTo];
        } else {
          delete balances[user._id!].owes[owedTo];
          delete balances[user._id!].isOwed[owedTo];
        }
      }
    });
  });

  return balances;
};

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupExpenses, users }) => {
  const initialBalances: Balance = {};
  users.forEach(user => {
    initialBalances[user._id!] = {
      owes: {},
      isOwed: {},
      netBalance: 0,
    };
  });

  const [balances, setBalances] = useState<Balance>(initialBalances);

  useEffect(() => {
    const newBalances = calculateBalances(groupExpenses, users);
    setBalances(newBalances);
  }, [groupExpenses, users]);

  return (
    <div className='group-balances-container'>
      <h2>Group Balances</h2>

      {users.map(user => {
        const userBalance = balances[user._id!];
        if (!userBalance) {
          return null;
        }

        return (
          <div className='balance-item' key={user._id}>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>Net Balance: {userBalance.netBalance.toFixed(2)}</p>
            { userBalance.owes && Object.keys(userBalance.owes).length > 0 && (
              <div>
                  <ul>
                    {Object.entries(userBalance.owes).map(([owedTo, amount]) => (
                      <li key={owedTo}>
                        <p>Owes {users.find(u => u._id === owedTo)?.firstName} {users.find(u => u._id === owedTo)?.lastName} ${amount.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
              </div>
            )}
            {userBalance.isOwed && Object.keys(userBalance.isOwed).length > 0 && (
              <div>
                <ul>
                  {Object.entries(userBalance.isOwed).map(([owedBy, amount]) => (
                    <li key={owedBy}>
                      <p>Is owed ${amount.toFixed(2)} by</p>
                      <p>{users.find(u => u._id === owedBy)?.firstName} {users.find(u => u._id === owedBy)?.lastName}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
    })}
    </div>
  );
};

export default GroupBalances;
