import config from '../../config.json'
import { Expense, Group, User } from '../components/group/GroupComponent';

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

export const fetchAllGroups = async () => {
  const url = config.serverUrl + '/groups/';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch group data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching groups: ", error);
    throw error;
  };
}

export const postGroup = async (group: Group) => {
  const url = config.serverUrl + '/groups/';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      throw new Error('Failed to post group');
    } 
  } catch (error) {
    console.error('Error posting group:', error);
    throw error;
  }
};

export const deleteGroupById = async (groupId: string) => {
  const url = config.serverUrl + `/groups/${groupId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete group data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error deleting group: ", error);
    throw error;
  };
};

export const fetchAllUsers = async () => {
  const url = config.serverUrl + '/users/';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch users data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching users: ", error);
    throw error;
  };
}

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

export const postUser = async (user: User) => {
  const url = config.serverUrl + '/users/';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Failed to post user');
    }

    const data = await response.json();
    return data._id;
  } catch (error) {
    console.error('Error posting user:', error);
    throw error;
  }
};

export const fetchExpensesByGroupId = async (groupId: string) => {
  const url = config.serverUrl + `/expenses/group/${groupId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.log("response.status is 404");
        return [];
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching expenses: ", error);
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
    console.log("Error deleting expense: ", error);
    throw error;
  };
};