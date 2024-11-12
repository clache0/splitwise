import config from '../../config.json'
import { Group } from '../types/types';

export const fetchGroupById = async (groupId: string) => {
  const url = config.serverUrl + `/groups/${groupId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch group data');
    }

    if (response.status === 404) {
      return []; // group not found
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching group: ", error);
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

    if (response.status === 204) {
      return []; // no groups found
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching groups: ", error);
    throw error;
  };
}

// return inserted group id if successfuly
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

    const data = await response.json();
    return data.insertedId;
  } catch (error) {
    console.error('Error posting group:', error);
    throw error;
  }
};

export const patchGroup = async (group: Group) => {
  const url = config.serverUrl + `/groups/${group._id}`;

  // convert group members from Member to string
  const groupMemberStrs = {
    ...group,
    members: group.members.map((member: {_id: string}) => member._id)
  };
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupMemberStrs),
    });

    if (!response.ok) {
      throw new Error('Failed to patch group');
    } 
  } catch (error) {
    console.error('Error patching group:', error);
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
    console.error("Error deleting group: ", error);
    throw error;
  };
};

export const fetchUserGroups = async (userId: string) => {
  const url = config.serverUrl + `/groups/users/${userId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user groups data');
    }

    if (response.status === 204) {
      return []; // no groups found
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  };
};