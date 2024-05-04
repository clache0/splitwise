import config from '../../config.json'

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