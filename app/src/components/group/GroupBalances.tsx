import React, { useEffect, useState } from 'react';
import "../../styles/components/group/GroupBalances.css"
import { calculateBalances } from '../../utils/balanceUtils';
import { useGroupContext } from '../../context/GroupContext';

interface GroupBalancesProps {
}

export interface Balance {
  [memberId: string]: {
    owes: { [owedTo: string]: number };
    isOwed: { [owedBy: string]: number };
    netBalance: number;
  };
}

const GroupBalances: React.FC<GroupBalancesProps> = () => {
  const { unsettledExpenses, groupUsers } = useGroupContext();

  // initialize Balances with empty Balance objects
  const initialBalances: Balance = {};
  groupUsers.forEach(user => {
    initialBalances[user._id!] = {
      owes: {},
      isOwed: {},
      netBalance: 0,
    };
  });

  const [showDetails, setShowDetails] = useState<Boolean>(false);
  const [balances, setBalances] = useState<Balance>(initialBalances);

  const handleClickViewDetails = () => {
    setShowDetails((prev) => !prev);
  }

  // calculate balances
  useEffect(() => {
    const newBalances = calculateBalances(unsettledExpenses, groupUsers);
    setBalances(newBalances);
  }, [unsettledExpenses, groupUsers]);

  // generate payment summary
  const paymentSummary: string[] = [];
  Object.entries(balances).forEach(([userId, balance]) => {
    Object.entries(balance.owes).forEach(([owedToId, amount]) => {
      const payer = groupUsers.find(user => user._id === userId);
      const owedTo = groupUsers.find(user => user._id === owedToId);
      if (payer && owedTo) {
        paymentSummary.push(`${payer.firstName} ${payer.lastName} owes ${owedTo.firstName} ${owedTo.lastName} $${amount}`);
      }
    })
  });

  return (
    <div className='group-balances-container'>
      <h2>Group Balances</h2>

      {/* Payment Summary */}
      {paymentSummary.length > 0 ? (
        <div className='payment-summary-container'>
          <h4>Payment Summary</h4>
          <ul className='payment-summary-item'>
            {paymentSummary.map((summary, index) => (
              <li key={index}>
                <p className='summary-item'>
                  {summary}
                </p>
              </li>
            ))}
          </ul>
        </div>)
        :
        <h5>All expenses settled</h5>
      }

      {/* View Details */}
      <div className='details-container'>
        <button
          onClick={handleClickViewDetails}
          className='toggle-link-button'
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      {/* Individual Balances */}
      { showDetails &&
        <>
          <h4>Individual Balances</h4>
          {groupUsers.map(user => {
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
                              Owes {groupUsers.find(user => user._id === owedTo)?.firstName} {groupUsers.find(user => user._id === owedTo)?.lastName} 
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
                          <p>{groupUsers.find(user => user._id === owedBy)?.firstName} {groupUsers.find(user => user._id === owedBy)?.lastName}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </>
      }
    </div>
  );
};

export default GroupBalances;
