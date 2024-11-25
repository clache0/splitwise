import { User } from "../types/types";

export const getNameFromId = (id: string, users: User[]): string => {
  const user = users?.find(user => user._id === id);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown'
};

export const getIdFromName = (name: string, users: User[]): string => {
  const [firstName, lastName] = name.split(" ");

  const user = users?.find(user => 
    user.firstName === firstName && user.lastName === lastName
  );
  
  return user && user._id ? user._id : 'Unknown';
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', timeZone: 'UTC'});
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
