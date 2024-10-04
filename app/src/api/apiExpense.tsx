import config from '../../config.json'
import { Expense } from '../components/group/GroupComponent';

export const fetchExpensesByGroupId = async (groupId: string) => {
  const url = config.serverUrl + `/expenses/group/${groupId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch group data');
    }

    if (response.status === 204) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching expenses: ", error);
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
};

export const patchExpense = async (expense: Expense) => {
  const url = config.serverUrl + `/expenses/${expense._id}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to patch expense');
    }

    if (response.status === 404) {
      console.error("patchExpense: expense not found");
    }
  } catch (error) {
    console.error('Error patching expense:', error);
    throw error;
  }
};

export const deleteExpenseById = async (expenseId: string) => {
  const url = config.serverUrl + `/expenses/${expenseId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting expense: ", error);
    throw error;
  };
};