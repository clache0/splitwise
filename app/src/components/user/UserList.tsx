import React from 'react';
import { User } from '../group/GroupComponent';
import '../../styles/components/user/UserList.css';
import Button from '../general/Button';

interface UserListProps {
  users: User[];
  onDeleteUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onDeleteUser }) => {
  return (
    <div className="user-list">
      <h2>User List</h2>
      {users.length > 0 ? (
          <ul>
            {users.map((user, index) => (
              <div key={user._id || index} className='user-container'>
                <li >
                  {user.firstName} {user.lastName}
                </li>

                <div className="user-actions">
                  <Button
                    label='Edit'
                    onClick={() => console.log("clicked edit user")}
                    backgroundColor='var(--primary-color)'
                  />
                  <Button
                    label='Delete'
                    onClick={() => onDeleteUser(user)}
                    backgroundColor='var(--red)'
                  />
                </div>
              </div>
            ))}
          </ul>
      ) : (
        <p>No users available</p>
      )}
    </div>
  );
};

export default UserList;
