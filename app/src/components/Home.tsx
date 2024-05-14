import { useEffect, useState } from "react";
import { Group, User } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchAllUsers, fetchGroups, fetchUserById, postGroup } from "../api/api";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";

const Home = () => {
  const [groupsData, setGroupsData] = useState<Group[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const handleAddGroup = async (group: Group) => {
    console.log("Adding group: ", group);
  
    try {
      await postGroup(group); // post expense to server
      setGroupsData((prevGroupsData) => prevGroupsData ? [...prevGroupsData, group] : [group]);
    } catch (error) {
      console.error("Error posting group: ", error);
    }
  }

  // fetch groupsData and use memberIds to fetch users
  const fetchData = async () => {
    try {
      const groupsData = await fetchGroups();
      setGroupsData(groupsData);

      const users = await fetchAllUsers();
      setUsers(users);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching groups data: ', error);
      setError(error);
      setIsLoading(false);
    } 
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <GroupList groups={groupsData} />
      <Button
        label='Add Group'
        onClick={() => console.log('Add group clicked')}
      />
      <AddGroupForm  onAddGroup={handleAddGroup} users={users || []}/>
    </>
  )
}
export default Home;