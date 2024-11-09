import { Link } from "react-router-dom";
import Button from "../general/Button";
import "../../styles/components/group/GroupCard.css"
import { useState } from "react";
import AddGroupForm from "./AddGroupForm";
import { Group } from "../../types/types";

interface GroupCardProps {
  group: Group;
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}
const GroupCard: React.FC<GroupCardProps> = ({ group, onUpdateGroup, onDeleteGroup }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  return (
    <div className="group-card">
      <Link className="group-link" to={`/group/${group._id}`}>{group.name}</Link>

      <div className="group-link-actions">
        <Button
          label='Edit'
          onClick={() => setIsEditing(true)}
          backgroundColor='var(--primary-color)'
        />
        <Button
          label='Delete'
          onClick={() => { onDeleteGroup(group) }}
          backgroundColor='var(--red)'
        />
      </div>

      {isEditing && (
        <AddGroupForm  
          onSubmit={(updatedGroup: Group) => {
            onUpdateGroup(updatedGroup);
            setIsEditing(false);
          }}
          onShowForm={setIsEditing}
          group={group}
        /> 
      )}
    </div>

  );
};

export default GroupCard;