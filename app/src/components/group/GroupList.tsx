import { useAppData } from "../../context/AppDataContext";
import "../../styles/components/group/GroupList.css"
import { Group } from "../../types/types";
import GroupCard from "./GroupCard";

interface GroupListProps {
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}
const GroupList: React.FC<GroupListProps> = ({ onUpdateGroup, onDeleteGroup }) => {
  const { groups } = useAppData();

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