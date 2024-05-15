import React, { useState } from 'react';
import { Group, User, Member } from './GroupComponent';

interface AddGroupFormProps {
  onAddGroup: (group: Group) => void;
  users: User[];
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup, users }) => {
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
    <>
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
      </form>
    </>
  );
};

export default AddGroupForm;
