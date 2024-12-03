import React from 'react';
import '../../styles/components/user/UserList.css';
import { User } from '../../types/types';
import { useAppData } from '../../context/AppDataContext';
import UserCard from './UserCard';

interface UserListProps {
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onUpdateUser, onDeleteUser }) => {
  const { users } = useAppData();

  if (!users) {
    return <div>Loading User List...</div>
  }

  const userList = users ? users.map((user, index) => (
    <li 
      key={user._id || index}
      className='user-container'
    >
      <UserCard
        user={user}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />
    </li>
  )) : null;

  return (
    <div className="user-list">
      <h2>User List</h2>
      {users.length > 0 ? (
        <ul>
          {userList}
        </ul>
      ) : (
        <p>No users available</p>
      )}

    </div>
  );
};

export default UserList;
