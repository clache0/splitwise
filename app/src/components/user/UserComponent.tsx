import React, { useState, useEffect } from 'react';
import { User } from '../group/GroupComponent';
import UserList from './UserList';
import '../../styles/components/user/UserComponent.css'
import AddUserForm from './AddUserForm';
import { postUser } from '../../api/api';
import { fetchAllUsers } from '../../api/api'

interface UserComponentProps {
}

const UserComponent: React.FC<UserComponentProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);

  // fetch users
  const fetchData = async () => {
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching groups data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (user: User) => {
    console.log("Adding user: ", user);
    try {
      await postUser(user); // post user to server
      setUsers((prevUserList) => prevUserList ? [...prevUserList, user] : [user]);
    } catch (error) {
      console.error("Error posting user: ", error);
    }
  };

  return (
    <div className="user-component">
      <button className="add-user-button" 
        onClick={() => setShowAddUserForm(true)} 
      >
        Add User
      </button>
      {showAddUserForm && (
        <AddUserForm onAddUser={handleAddUser} onShowForm={setShowAddUserForm} />
      )}
      <UserList users={users} />
    </div>
  );
};

export default UserComponent;
