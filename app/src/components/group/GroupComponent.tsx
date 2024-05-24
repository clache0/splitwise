import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import ExpenseList from "../expense/ExpenseList";
import { fetchGroupById, fetchExpensesByGroupId, fetchUserById, postExpense } from "../../api/api";
import AddExpenseForm from "../expense/AddExpenseForm";
import { useParams } from "react-router-dom";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
};

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

const GroupComponent = () => {
  const { groupId } = useParams() as { groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [groupExpenses, setGroupExpenses] = useState<Expense[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroupById(groupId);
      const groupExpensesData = await fetchExpensesByGroupId(groupId);
      const users = await Promise.all(groupData.members.map((member: Member) => fetchUserById(member._id)));
      setGroup(groupData);
      setGroupExpenses(groupExpensesData);
      setUsers(users);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching group data: ', error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleAddExpense = async (expense: Expense) => {
    console.log("Adding expense: ", expense);
    try {
      await postExpense(expense); // post expense to server
      setGroupExpenses((prevExpenses) => prevExpenses ? [...prevExpenses, expense] : [expense]);
    } catch (error) {
      console.error("Error posting expense: ", error);
    }
  };

  return (
    <>
      <GroupNavbar 
        group={group} 
        isLoading={isLoading} 
        error={error} 
        setShowAddExpenseForm={setShowAddExpenseForm} 
        showAddExpenseForm={showAddExpenseForm} 
      />
      { showAddExpenseForm && <AddExpenseForm onAddExpense={handleAddExpense} group={group} users={users}/> }
      <ExpenseList groupExpenses={groupExpenses} />
    </>
  )
};

export default GroupComponent;