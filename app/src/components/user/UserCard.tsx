import { useState } from "react";
import { User } from "../../types/types";
import AddUserForm from "./AddUserForm";
import Button from "../general/Button";
import '../../styles/components/user/UserList.css';

interface UserCardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onUpdateUser, onDeleteUser }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  return (
    <div className="user-card">
      <h5>{user.firstName} {user.lastName}</h5>

      <div className="user-actions">
        <Button
          label='Edit'
          onClick={() => setIsEditing(true)}
          backgroundColor='var(--primary-color)'
        />
        <Button
          label='Delete'
          onClick={() => onDeleteUser(user)}
          backgroundColor='var(--red)'
        />
      </div>

      {isEditing && (
      <AddUserForm
        onSubmit={(updatedUser: User) => {
          onUpdateUser(updatedUser);
          setIsEditing(false);
        }}
        onShowForm={setIsEditing}
        user={user}
      />
      )}
    </div>
  )
}

export default UserCard;