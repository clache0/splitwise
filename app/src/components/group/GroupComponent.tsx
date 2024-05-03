import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import config from '../../../config.json'
import ExpenseList from "../expense/ExpenseList";
import { fetchGroup, fetchExpensesByGroupId } from "../../api/api";

export interface Member {
  _id: string;
};

export interface Group {
  name: string;
  members: Member[];
};

export interface Expense {
  _id: string;
  groupId: string;
  title: string;
  amount: number;
  date: Date;
  payerId: string;
  participants: {
    memberId: string;
    share: number;
  }
}

const GroupComponent = () => {

  const [group, setGroup] = useState<Group | null>(null);
  const [groupExpenses, setGroupExpenses] = useState<Expense[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroup(config.groupId);
      const groupExpensesData = await fetchExpensesByGroupId(config.groupId);
      setGroup(groupData);
      setGroupExpenses(groupExpensesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching group data: ', error);
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
      <ExpenseList groupExpenses={groupExpenses}/>
    </>
  )
};

export default GroupComponent;