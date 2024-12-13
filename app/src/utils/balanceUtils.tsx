import { Balance } from "../components/group/GroupBalances";
import { User, Expense } from "../types/types";

// input: Expense[], User[]
// output: Balance {}
export const calculateBalances = (unsettledExpenses: Expense[], users: User[]): Balance => {
  const balances: Balance = {};

  // initialize Balance object for each user
  users.forEach(user => {
    balances[user._id!] = {
      owes: {},
      isOwed: {},
      netBalance: 0,
    };
  });

  // iterate group expenses
  unsettledExpenses.forEach(expense => {
    if (expense.settled) return; // expense is already settled, no calculation needed
    
    const totalAmount = expense.amount;
    const payerId = expense.payerId;

    // special expense: settle up
    if (expense.type === 'settle-up') {
      const payerId = expense.payerId;
      const payeeId = expense.participants.find(participant => participant.share === 0)!.memberId;
      const payeeShare = expense.amount;

      balances[payerId].isOwed[payeeId] = (balances[payerId].isOwed[payeeId] || 0) + payeeShare;
      balances[payeeId].owes[payerId] = (balances[payeeId].owes[payerId] || 0) + payeeShare;
      balances[payerId].netBalance += payeeShare;
      balances[payeeId].netBalance -= payeeShare;
      return;
    }

    // normal expense calculations
    expense.participants.forEach(({ memberId, share }) => {
      if (memberId === payerId) return;
      const participantShare = (share / 100) * totalAmount; // calc percentage of total

      balances[payerId].isOwed[memberId] = (balances[payerId].isOwed[memberId] || 0) + participantShare;
      balances[memberId].owes[payerId] = (balances[memberId].owes[payerId] || 0) + participantShare;

      balances[payerId].netBalance += participantShare;
      balances[memberId].netBalance -= participantShare;
    });
  });

  // net balances between pairs of participants
  netPairwiseBalances(balances);

  // round netBalance
  Object.keys(balances).forEach(userId => {
    balances[userId].netBalance = parseFloat(balances[userId].netBalance.toFixed(2));
  });

  return balances;
};

// helper function to net balance between pairs
const netPairwiseBalances = (balances: Balance) => {
  Object.keys(balances).forEach((userId) => {
    const userBalance = balances[userId];
    Object.keys(userBalance.owes).forEach((owedTo) => {
      const owesAmount = userBalance.owes[owedTo] || 0;
      const isOwedAmount = userBalance.isOwed[owedTo] || 0;
      const netAmount = owesAmount - isOwedAmount;

      if (netAmount > 0) {
        // user still owes money to owedTo
        userBalance.owes[owedTo] = parseFloat(netAmount.toFixed(2));
        delete userBalance.isOwed[owedTo];
      } else if (netAmount < 0) {
        // user still owed money by owedTo
        userBalance.isOwed[owedTo] = parseFloat((-netAmount).toFixed(2));
        delete userBalance.owes[owedTo];
      } else {
        // net zero balance
        delete userBalance.owes[owedTo];
        delete userBalance.isOwed[owedTo];
      }
    });
  });
};

// return true if all expenses are settled
// return false if any expense is not settled
export const checkUnsettledExpenses = (unsettledExpenses: Expense[]): boolean => {
  return unsettledExpenses.every(expense => expense.settled);
};