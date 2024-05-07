import { useEffect, useState } from "react";
import GroupComponent from "./group/GroupComponent"
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
      {/* <GroupComponent groupId='662306fcc4de419f942fc418'/> */}
    </>
  )
}
export default Home;