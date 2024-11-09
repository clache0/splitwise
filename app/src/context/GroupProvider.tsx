import { useEffect, useState } from 'react';
import { Group, User, Expense, Member } from '../types/types';
import { fetchGroupById } from '../api/apiGroup';
import { fetchUserById } from '../api/apiUser';
import { fetchExpensesByGroupId } from '../api/apiExpense';
import { GroupContext } from './GroupContext';

export const GroupProvider: React.FC<{ groupId: string, children: React.ReactNode }> = ({ groupId, children }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroupById(groupId);
      const groupUsersData = await Promise.all(
        groupData.members.map((member: Member) => fetchUserById(member._id))
      );
      const groupExpensesData = await fetchExpensesByGroupId(groupId);
      setGroup(groupData);
      setGroupUsers(groupUsersData);
      setGroupExpenses(groupExpensesData);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setIsLoading(false);
      setIsError(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  return (
    <GroupContext.Provider value={{
      group,
      groupUsers,
      groupExpenses,
      isLoading,
      isError,
      setGroup,
      setGroupUsers,
      setGroupExpenses
    }}>
      {children}
    </GroupContext.Provider>
  );
};