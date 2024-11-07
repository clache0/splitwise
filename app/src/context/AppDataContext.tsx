import React, { createContext, useContext } from 'react';
import { Group, User } from '../types/types';

interface AppDataContextType {
  groups: Group[] | null;
  users: User[] | null;
  isLoading: boolean;
  isError: boolean;
  setGroups: React.Dispatch<React.SetStateAction<Group[] | null>>;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
};

