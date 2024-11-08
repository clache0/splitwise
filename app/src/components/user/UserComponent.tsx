import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import '../../styles/components/user/UserComponent.css'
import AddUserForm from './AddUserForm';
import { deleteUserById, fetchAllUsers, postUser } from '../../api/apiUser';
import { fetchUserGroups } from '../../api/apiGroup'
import Modal from '../general/Modal';
import { Group, User } from '../../types/types';

interface UserComponentProps {
}

const UserComponent: React.FC<UserComponentProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
    try {
      await postUser(user); // post user to server
      setUsers(await fetchAllUsers());
    } catch (error) {
      console.error("Error posting user: ", error);
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        const groups = await fetchUserGroups(userToDelete._id!);
        if (groups.length > 0) {
          setDeleteMessage(`User is in group(s) ${groups.map((group: Group) => group.name).join(", ")}, cannot delete`);
        } else {
          await deleteUserById(userToDelete._id!);
          setUsers(await fetchAllUsers());
          setShowDeleteModal(false);
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div className="user-component">
      <button className="add-user-button" 
        onClick={() => setShowAddUserForm(true)} 
      >
        Add User
      </button>

      <UserList users={users} onDeleteUser={(user: User) => {
        setUserToDelete(user);
        setDeleteMessage("Are you sure you want to delete this user?");
        setShowDeleteModal(true);
      }}/>

      {showAddUserForm && (
        <AddUserForm onAddUser={handleAddUser} onShowForm={setShowAddUserForm} />
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title='Delete User'
      >
        <p>{deleteMessage}</p>
      </Modal>
    </div>
  );
};

export default UserComponent;
