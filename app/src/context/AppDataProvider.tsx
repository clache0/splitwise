import React, { useState, useEffect, ReactNode } from 'react';
import { AppDataContext } from './AppDataContext';
import { fetchAllGroups } from '../api/apiGroup';
import { fetchAllUsers } from '../api/apiUser';
import { Group, User } from '../types/types';

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch groups and users from your API
        const fetchedGroups = await fetchAllGroups();
        const fetchedUsers = await fetchAllUsers();
        setGroups(fetchedGroups);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching groups and users:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppDataContext.Provider value={{ groups, users, setGroups, setUsers }}>
      {children}
    </AppDataContext.Provider>
  );
};