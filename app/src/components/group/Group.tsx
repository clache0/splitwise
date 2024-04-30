import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import config from '../../../config.json'
import ExpenseList from "../expense/ExpenseList";
import { fetchGroup } from "../../api/api";

export type Member = {
  _id: string;
};

export type Group = {
  name: string;
  members: Member[];
};

const Group = () => {

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroup(config.groupId);
      setGroup(groupData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching group: ', error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <GroupNavbar group={group} isLoading={isLoading} error={error}/>
      <ExpenseList/>
    </>
  )
};

export default Group;