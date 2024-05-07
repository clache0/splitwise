import config from '../../config.json'
import { Expense } from '../components/group/GroupComponent';

export const fetchExpensesByGroupId = async (groupId: string) => {
  const url = config.serverUrl + `/expenses/group/${groupId}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching expenses: ", error);
    throw error;
  };
};

export const fetchGroupById = async (groupId: string) => {
  const url = config.serverUrl + `/groups/${groupId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch group data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching group: ", error);
    throw error;
  };
};

export const fetchUserById = async (userId: string) => {
  const url = config.serverUrl + `/users/${userId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw error;
  };
};

export const postExpense = async (expense: Expense) => {
  const url = config.serverUrl + '/expenses/';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to post expense');
    } 
  } catch (error) {
    console.error('Error posting expense:', error);
    throw error;
  }
}