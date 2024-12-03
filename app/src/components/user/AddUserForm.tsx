import React, { useState } from 'react';
import "../../styles/components/user/AddUserForm.css";
import { User } from '../../types/types';

interface AddUserFormProps {
  onSubmit: (user: User) => void;
  onShowForm: (showAddUserForm: boolean) => void;
  user?: User; // optional user for update
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onShowForm, user }) => {
  const [firstName, setFirstName] = useState<string>( user?.firstName || '' );
  const [lastName, setLastName] = useState<string>( user?.lastName || '' );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newUser: User = {
      _id: user?._id, // include id if update
      firstName,
      lastName,
    };
    onSubmit(newUser);
    onShowForm(false); // close form

    if (!user) {
      // Clear form inputs
      setFirstName('');
      setLastName('');
    }
  };

  return (
    <div className='add-user-form-backdrop'>
      <div className='add-user-form-content'>
        <h2>Add User Form</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
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
          <button type="submit">{user ? 'Update User' : 'Add User'}</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
