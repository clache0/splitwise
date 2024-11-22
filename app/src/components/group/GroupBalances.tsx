import React, { useEffect, useState } from 'react';
import "../../styles/components/group/GroupBalances.css"
import { calculateBalances } from '../../utils/balanceUtils';
import { Expense, User } from '../../types/types';

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
            <p
              className={`net-balance ${userBalance.netBalance >= 0 ? 'positive' : 'negative'}`}
            >
              Net Balance: {userBalance.netBalance.toFixed(2)}
            </p>

            { userBalance.owes && Object.keys(userBalance.owes).length > 0 && (
              <div>
                  <ul>
                    {Object.entries(userBalance.owes).map(([owedTo, amount]) => (
                      <li key={owedTo}>
                        <p>
                          Owes {users.find(u => u._id === owedTo)?.firstName} {users.find(u => u._id === owedTo)?.lastName} 
                          <span className='amount'> ${amount.toFixed(2)}</span>
                        </p>
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
                      <p>
                        Is owed 
                        <span className='amount'> ${amount.toFixed(2)} </span>
                        by
                        </p>
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
