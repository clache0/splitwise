import React, { useEffect, useState } from 'react';
import { Expense, User } from '../group/GroupComponent';
import "../../styles/components/group/GroupBalances.css"
import { calculateBalances } from '../../api/balanceUtils';

interface GroupBalancesProps {
  groupExpenses: Expense[];
  users: User[];
}

export interface Balance {
  [memberId: string]: {
    owes: { [owedTo: string]: number };
    isOwed: { [owedBy: string]: number };
    netBalance: number;
  };
}

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
