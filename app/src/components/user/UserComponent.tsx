import React from 'react';
import { User } from '../group/GroupComponent';
import UserList from './UserList';
import '../../styles/components/user/UserComponent.css'

interface UserComponentProps {
  users: User[];
}

const UserComponent: React.FC<UserComponentProps> = ( {users} ) => {

  const handleAddUser = (user: User) => {
    console.log("Adding user: ", user);
  };

  return (
    <div className="user-component">
      <button className="add-user-button" >Add User</button>
      <UserList users={users} />
    </div>
  );
};

export default UserComponent;
