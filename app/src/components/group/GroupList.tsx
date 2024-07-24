import { Link } from "react-router-dom";
import { Group } from "./GroupComponent";
import Button from "../general/Button";
import "../../styles/components/group/GroupList.css"

interface GroupListProps {
  groups: Group[] | null;
  onDeleteGroup: (group: Group) => void;
}
const GroupList: React.FC<GroupListProps> = ({ groups, onDeleteGroup }) => {
  
  if (!groups) {
    return <div>Loading Group List...</div>
  }

  const groupList = groups ? groups.map((group, index) => (
    <li 
      key={group._id || index} 
      className="group-link-container"
    >
      <Link className="group-link" to={`/group/${group._id}`}>{group.name}</Link>
      <div className="group-link-actions">
        <Button
          label='Delete'
          onClick={() => { onDeleteGroup(group) }}
          backgroundColor='var(--red)'
        />
      </div>
      </li>
  )) : null;

  return (
    <>
      <h2>Group List</h2>
      <ul className="group-list column-center">
        {groupList}
      </ul>
    </>
  );
};

export default GroupList;