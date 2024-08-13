import { Balance } from "../components/group/GroupBalances";
import { Expense, Group, User } from "../components/group/GroupComponent";

// input: Expense[], User[]
// output: Balance {}
export const calculateBalances = (groupExpenses: Expense[], users: User[]): Balance => {
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