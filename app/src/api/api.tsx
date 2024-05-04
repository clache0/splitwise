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

export const fetchGroup = async (groupId: string) => {
  const url = config.serverUrl + `/groups/${groupId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch group data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching expenses: ", error);
    throw error;
  };
};