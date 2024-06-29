import React, { useState } from 'react';
import { User } from '../group/GroupComponent';
import "../../styles/components/user/AddUserForm.css";

interface AddUserFormProps {
  onAddUser: (user: User) => void;
  onShowForm: (showAddUserForm: boolean) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser, onShowForm }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newUser: User = {
      // _id: Math.random().toString(36).substring(7), // Generate a random ID for the new user
      firstName,
      lastName,
    };
    onAddUser(newUser);

    // Clear form inputs
    setFirstName('');
    setLastName('');
  };

  return (
    <div className='add-user-form-backdrop'>
      <div className='add-user-form-content'>
        <h2>Add User Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <button type="submit">Add User</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
