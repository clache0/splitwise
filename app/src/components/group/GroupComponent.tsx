import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import config from '../../../config.json'
import ExpenseList from "../expense/ExpenseList";
import { fetchGroup, fetchExpensesByGroupId } from "../../api/api";
import AddExpenseForm from "../expense/AddExpenseForm";

export interface Member {
  _id: string;
};

export interface Group {
  _id?: string;
  name: string;
  members: Member[];
};

export interface Participant {
  memberId: string;
  share: number;
}

export interface Expense {
  _id?: string;
  groupId: string;
  title: string;
  amount: number;
  date: string;
  payerId: string;
  participants: Participant[];
}

const handleAddExpense = (expense: Expense) => {
  console.log("Adding expense: ", expense);
  return(null);
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
      <GroupNavbar group={group} isLoading={isLoading} error={error} />
      <AddExpenseForm onAddExpense={handleAddExpense} group={group} />
      <ExpenseList groupExpenses={groupExpenses} />
    </>
  )
};

export default GroupComponent;