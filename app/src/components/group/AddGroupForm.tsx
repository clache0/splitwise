import React, { useEffect, useState } from 'react';
import '../../styles/components/group/AddGroupForm.css'
import { Group, User, Member } from '../../types/types';
import { useAppData } from '../../context/AppDataContext';

interface AddGroupFormProps {
  onSubmit: (group: Group) => void;
  onShowForm: (showAddGroupForm: boolean) => void;
  group?: Group; // optional group for update
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onSubmit, onShowForm, group }) => {
  const [name, setName] = useState<string>(group?.name || '');
  const [selectedUsers, setSelectedUsers] = useState<User[] | []>([]);
  const { users } = useAppData();

  // update selectedUsers if group exist
  useEffect(() => {
    if (group && group.members) {
      const members = group.members.map((member) => 
        users.find((user) => user._id === member._id)
      ).filter((user): user is User => !!user);
      setSelectedUsers(members);
    }
  }, [group, users]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // map users to members
    const selectedMembers: Member[] = (selectedUsers || [])
      .map((user) => ({ _id: user._id as string}));

    const newGroup: Group = {
      _id: group?._id, // include id if update
      name: name,
      members: selectedMembers,
    };

    onSubmit(newGroup);
    onShowForm(false);
    
    if (!group) {
      // Clear form inputs if not update
      setName('');
      setSelectedUsers([]);
    }
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
        <h2>{group ? 'Update Group Form' : 'Add Group Form'}</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
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

          <button type="submit">{group ? 'Update Group' : 'Add Group'}</button>
          <button type="button" onClick={() => onShowForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupForm;
