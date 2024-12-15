import { useEffect, useState } from 'react';
import { Group, User, Expense, Member } from '../types/types';
import { fetchGroupById } from '../api/apiGroup';
import { fetchUserById } from '../api/apiUser';
import { fetchSettledExpensesByGroupId, fetchUnsettledExpensesByGroupId } from '../api/apiExpense';
import { GroupContext } from './GroupContext';

export const GroupProvider: React.FC<{ groupId: string, children: React.ReactNode }> = ({ groupId, children }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [settledExpenses, setSettledExpenses] = useState<Expense[]>([]);
  const [unsettledExpenses, setUnsettledExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean>(true);
  const [fetchedSettledExpenses, setFetchedSettledExpenses] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroupById(groupId);
      const groupUsersData = await Promise.all(
        groupData.members.map((member: Member) => fetchUserById(member._id))
      );
      const unsettledExpensesData = await fetchUnsettledExpensesByGroupId(groupId);
      setGroup(groupData);
      setGroupUsers(groupUsersData);
      setUnsettledExpenses(unsettledExpensesData);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setIsLoading(false);
      setIsError(false);
    }
  };

  const fetchSettledExpenses = async () => {
    try {
      const settledExpensesData = await fetchSettledExpensesByGroupId(groupId);
      setSettledExpenses(settledExpensesData);
    } catch (error) {
      console.error('Error fetching settled expense data:', error);
    }
  }

  // fetch settled expenses when flag set true from ExpenseList showSettled
  useEffect(() => {
    if (fetchedSettledExpenses) {
      fetchSettledExpenses();
    }
  }, [fetchedSettledExpenses]);

  // fetch group data upon group loading
  useEffect(() => {
    fetchData();
  }, [groupId]);

  return (
    <GroupContext.Provider value={{
      group,
      groupUsers,
      settledExpenses,
      unsettledExpenses,
      isLoading,
      isError,
      setGroup,
      setGroupUsers,
      setSettledExpenses,
      setUnsettledExpenses,
      setFetchedSettledExpenses,
    }}>
      {children}
    </GroupContext.Provider>
  );
};