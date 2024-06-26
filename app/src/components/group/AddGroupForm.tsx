import React, { useState } from 'react';
import { Group, User, Member } from './GroupComponent';
import '../../styles/components/group/AddGroupForm.css'

interface AddGroupFormProps {
  onAddGroup: (group: Group) => void;
  onShowForm: (showAddGroupForm: boolean) => void;
  users: User[];
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup, onShowForm, users }) => {
  const [name, setName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<User[] | null>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // map users to members
    const selectedMembers: Member[] = (selectedUsers || [])
      .map((user) => ({ _id: user._id as string}));

    const newGroup: Group = {
      name: name,
      members: selectedMembers,
    };

    onAddGroup(newGroup);
    
    // Clear form inputs
    setName('');
    setSelectedUsers([]);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, user: User) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedUsers((prevSelectedUsers) => (
        [...(prevSelectedUsers || []), user]
      )); // add checked user
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        (prevSelectedUsers || []).filter((selectedUser) => (
          selectedUser._id !== user._id
        )) // remove unchecked user
      );
    }
  };

  return (
    <div className='add-group-form-backdrop'>
      <div className='add-group-form-content'>
        <h2>Add Group Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="users">Select Users</label>
            <div>
              {users.map((user) => (
                <label key={user._id}>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedUsers?.some((selectedUser) => (
                      selectedUser._id === user._id
                    ))} // check if any user id matches selected user
                    onChange={(event) => handleCheckboxChange(event, user)}
                  />
                  {user.firstName} {user.lastName}
                </label>
              ))}
            </div>
          </div>

          <button type="submit">Add Group</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupForm;
