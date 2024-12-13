import { createContext, useContext } from "react";
import { Group, User, Expense } from "../types/types";

interface GroupContextProps {
  group: Group | null;
  groupUsers: User[];
  groupExpenses: Expense[];
  settledExpenses: Expense[];
  unsettledExpenses: Expense[];
  isLoading: boolean;
  isError: boolean;
  setGroup: React.Dispatch<React.SetStateAction<Group | null>>;
  setGroupUsers: React.Dispatch<React.SetStateAction<User[] | []>>;
  setGroupExpenses: React.Dispatch<React.SetStateAction<Expense[] | []>>;
  setSettledExpenses: React.Dispatch<React.SetStateAction<Expense[] | []>>;
  setUnsettledExpenses: React.Dispatch<React.SetStateAction<Expense[] | []>>;
}

export const GroupContext = createContext<GroupContextProps | undefined>(undefined);

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within a GroupProvider');
  }
  return context;
};