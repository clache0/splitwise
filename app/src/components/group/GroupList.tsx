import { Group, User } from "./GroupComponent";
import "../../styles/components/group/GroupList.css"
import GroupCard from "./GroupCard";

interface GroupListProps {
  groups: Group[] | null;
  users: User[] | null;
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}
const GroupList: React.FC<GroupListProps> = ({ groups, users, onUpdateGroup, onDeleteGroup }) => {
  
  if (!groups) {
    return <div>Loading Group List...</div>
  }

  const groupList = groups ? groups.map((group, index) => (
    <li 
      key={group._id || index} 
      className="group-link-container"
    >
      <GroupCard
        group={group}
        users={users}
        onUpdateGroup={onUpdateGroup}
        onDeleteGroup={onDeleteGroup}
      />
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