import config from '../../config.json'
import { User } from '../components/group/GroupComponent';

export const fetchAllUsers = async () => {
  const url = config.serverUrl + '/users/';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch users data');
    }

    if (response.status === 204) {
      return []; // no users found
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users: ", error);
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

    if (response.status === 404) {
      return []; // user not found
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user: ", error);
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

export const deleteUserById = async (userId: string) => {
  const url = config.serverUrl + `/users/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  };
};