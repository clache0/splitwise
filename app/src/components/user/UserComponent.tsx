import React, { useState } from 'react';
import UserList from './UserList';
import '../../styles/components/user/UserComponent.css'
import AddUserForm from './AddUserForm';
import { deleteUserById, patchUser, postUser } from '../../api/apiUser';
import Modal from '../general/Modal';
import { Group, Member, User } from '../../types/types';
import { useAppData } from '../../context/AppDataContext';

interface UserComponentProps {
}

const UserComponent: React.FC<UserComponentProps> = () => {
  const { groups, setUsers } = useAppData();
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // check if groups members contain userId
  const checkUserInGroups = (userId: string) => {
    return groups.some((group: Group) =>
      group.members.some((member: Member) => member._id === userId)
    );
  };

  // get group names that user is a part of
  const getUserGroupNames = (userId: string): string[] => {
    return groups
      .filter((group: Group) =>
        group.members.some((member: Member) => member._id === userId)
      )
      .map((group: Group) => group.name);
  };

  const handleAddUser = async (user: User) => {
    try {
      const userId = await postUser(user); // post user to server
      const newUser = { ...user, _id: userId}
      setUsers((prevUsers) => [...prevUsers, newUser]); // update local users with new user
    } catch (error) {
      console.error("Error posting user: ", error);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await patchUser(updatedUser);
      setUsers((prevUsers) => 
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      alert("No user to delete");
      return;
    }

    if (!userToDelete._id) {
      alert("User ID does not exist");
      return;
    }

    try {
      if (checkUserInGroups(userToDelete._id)) {
        setDeleteMessage(`User is in group(s) ${getUserGroupNames(userToDelete._id)}, cannot delete`);
      } else {
        await deleteUserById(userToDelete._id); // delete user from database
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete._id)
        );
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="user-component">
      <button className="add-user-button" 
        onClick={() => setShowAddUserForm(true)} 
      >
        Add User
      </button>

      <UserList 
        onUpdateUser={handleUpdateUser}
        onDeleteUser={(user: User) => {
          setUserToDelete(user);
          setDeleteMessage("Are you sure you want to delete this user?");
          setShowDeleteModal(true);
        }
      }/>

      {showAddUserForm && (
        <AddUserForm onSubmit={handleAddUser} onShowForm={setShowAddUserForm} />
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
