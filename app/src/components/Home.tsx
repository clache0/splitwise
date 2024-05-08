import { useEffect, useState } from "react";
import { Group } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchGroups } from "../api/api";

const Home = () => {
  const [groupsData, setGroupsData] = useState<Group[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = async () => {
    try {
      const groupsData = await fetchGroups();
      console.log('groupsData: ', groupsData);
      setGroupsData(groupsData);
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
    </>
  )
}
export default Home;