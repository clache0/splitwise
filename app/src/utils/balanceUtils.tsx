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
    if (expense.settled) {
      return; // expense is already settled, no calculation needed
    }
    
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
        balances[payerId].netBalance = parseFloat(balances[payerId].netBalance.toFixed(2)); // round netBalance 2 decimals
        balances[payeeId].netBalance -= payeeShare;
        balances[payeeId].netBalance = parseFloat(balances[payeeId].netBalance.toFixed(2)); // round netBalance 2 decimals
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
        balances[payerId].netBalance = parseFloat(balances[payerId].netBalance.toFixed(2)); // round netBalance 2 decimals
        balances[participantId].netBalance -= participantShare;
        balances[participantId].netBalance = parseFloat(balances[participantId].netBalance.toFixed(2)); // round netBalance 2 decimals
      }
    });
  });

  // net balances between pairs of participants
  users.forEach(user => {
    Object.keys(balances[user._id!].owes).forEach(owedTo => {
      const owesAmount = balances[user._id!].owes[owedTo] || 0;
      const isOwedAmount = balances[user._id!].isOwed[owedTo] || 0;

      // check not balanced between pairs
      if (isOwedAmount > 0) {
        const netAmount = owesAmount - isOwedAmount; // net owes vs isOwed
        const roundedNetAmount = parseFloat(netAmount.toFixed(2)); // round to 2 decimals

        if (roundedNetAmount > 0) {
          balances[user._id!].owes[owedTo] = roundedNetAmount;
          delete balances[user._id!].isOwed[owedTo];
        } else if (roundedNetAmount < 0) {
          balances[user._id!].isOwed[owedTo] = -roundedNetAmount;
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