import { Balance } from "../components/group/GroupBalances";
import { Group, User, Expense } from "../types/types";

// input: Expense[], User[]
// output: Balance {}
export const calculateBalances = (groupExpenses: Expense[], users: User[]): Balance => {
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
  groupExpenses.forEach(expense => {
    if (expense.settled) return; // expense is already settled, no calculation needed
    
    const totalAmount = expense.amount;
    const payerId = expense.payerId;

    // special expense: settle up
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

export const checkUnsettledExpenses = (group: Group, users: User[], groupExpenses: Expense[]): boolean => {
  const balances = calculateBalances(groupExpenses, users);

  for (const member of group.members) {
    const userId = member._id;
    const userBalance = balances[userId];

    // check unsettled balance owes, isOwed, netBalance is != 0
    if (userBalance.netBalance != 0 ||
      Object.keys(userBalance.owes).length > 0 ||
      Object.keys(userBalance.isOwed).length > 0
    ) {
      return false;
    }
  }
  return true;
}