import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import ExpenseList from "../expense/ExpenseList";
import { postExpense, deleteExpenseById, patchExpense, patchExpensesBatch } from "../../api/apiExpense";
import AddExpenseForm from "../expense/AddExpenseForm";
import Modal from "../general/Modal";
import GroupBalances from "./GroupBalances";
import "../../styles/components/group/GroupComponent.css"
import SettleUpForm from "../expense/SettleUpForm";
import * as XLSX from 'xlsx';
import { getNameFromId } from "../../utils/utils";
import { Expense } from "../../types/types";
import { useGroupContext } from "../../context/GroupContext";

const GroupComponent = () => {
  const { group, groupUsers, unsettledExpenses, setSettledExpenses, setUnsettledExpenses } = useGroupContext();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | []>([]);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState<boolean>(false);
  const [showSettleUpForm, setShowSettleUpForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [defaultUserId, setDefaultUserId] = useState<string>("");
  const [isCheckSettleUp, setIsCheckSettleUp] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isSettling, setIsSettling] = useState<boolean>(false);

  // set defaultUserId from localStorage or take first user in group
  useEffect(() => {
    if (group && group.members) {
      const storedDefaultUserId = localStorage.getItem("defaultUserId");
      if (storedDefaultUserId && group.members.some(member => member._id === storedDefaultUserId)) {
        setDefaultUserId(storedDefaultUserId);
      }
      else {
        const firstUserId = group.members[0]._id;
        setDefaultUserId(firstUserId);
        localStorage.setItem("defaultUserId", firstUserId);
      }
    }
  }, [group]);

  // update localStorage when defaultUserId changes
  useEffect(() => {
    if (defaultUserId) {
      localStorage.setItem("defaultUserId", defaultUserId);
    }
  }, [defaultUserId]);

  const handleAddExpense = async (expense: Expense) => {
    try {
      const expenseId = await postExpense(expense); // post expense to server
      const newExpense = { ...expense, _id: expenseId };
      setUnsettledExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    } catch (error) {
      console.error("Error posting expense: ", error);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await patchExpense(updatedExpense); // post expense to server
      if (updatedExpense.settled) {
        setSettledExpenses((prevExpenses) => 
          prevExpenses.map((expense) =>
            expense._id === updatedExpense._id ? updatedExpense : expense
          )
        );
      }
      else {
        console.log("expense is unsettled");
        setUnsettledExpenses((prevExpenses) => 
          prevExpenses.map((expense) =>
            expense._id === updatedExpense._id ? updatedExpense : expense
          )
        );
      }
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) {
      alert("No group to delete");
      return;
    }

    if (!expenseToDelete._id) {
      alert("Expense ID does not exist");
      return;
    }

    try {
      await deleteExpenseById(expenseToDelete._id);
      if (expenseToDelete.settled) {
        setSettledExpenses((prevGroupExpenses) =>
          prevGroupExpenses.filter((prevExpense) => expenseToDelete._id !== prevExpense._id)
        );
      }
      else {
        setUnsettledExpenses((prevGroupExpenses) =>
          prevGroupExpenses.filter((prevExpense) => expenseToDelete._id !== prevExpense._id)
        );
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  // post settleUp expense and update unsettledExpenses
  const handleSettleUp = async(expense: Expense) => {
    try {
      const expenseId = await postExpense(expense); // post settle up expense to server
      const newExpense = { ...expense, _id: expenseId };
      await setUnsettledExpenses((prevExpenses) => [...prevExpenses, newExpense]); // update unsettled expenses locally
      setIsCheckSettleUp(true); // trigger flag to check settled flag in expenses
    } catch (error) {
      console.error("Error settling up expense: ", error);
    }
  };

  // handleSettleUp updates unsettledExpenses asynchronously
  useEffect(() => {
    if (isCheckSettleUp && unsettledExpenses.length > 0) {
      settleExpenses(unsettledExpenses);
      setIsCheckSettleUp(false); // reset flag
    }
  }, [isCheckSettleUp]);

  // settle expenses and patch to server concurrently
  const settleExpenses = async (unsettledExpenses: Expense[]) => {
    setIsSettling(true);
    setProgress(0);

    const updatedExpenses = unsettledExpenses.map((expense) => ({
      ...expense,
      settled: true,
    }));

    try {
      const { operations } = await patchExpensesBatch(updatedExpenses);

      // separate settled and unsettled expenses
      const newSettledExpenses: Expense[] = [];
      const updatedUnsettledExpenses: Expense[] = [];
  
      operations.forEach((expense: Expense) => {
        if (expense.settled) {
          newSettledExpenses.push(expense);
        } else {
          updatedUnsettledExpenses.push(expense);
        }
      });
  
      // update state
      setSettledExpenses((prev) => [...prev, ...newSettledExpenses]);
      setUnsettledExpenses(updatedUnsettledExpenses);
  
    } catch (error) {
      console.error("Error during batch processing of unsettled expenses:", error);
    } finally {
      setIsSettling(false);
    }
  };

  const handleFilteredExpensesChange = (newData: Expense[] | []) => {
    setFilteredExpenses(newData);
  }

  const openDeleteModal = (expense: Expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  // export excel
  const exportExpensesToExcel = () => {
    if (!filteredExpenses || !groupUsers) return;

    const processedExpenses = filteredExpenses.map((expense) => {
      const { _id, groupId, payerId, participants, ...rest } = expense;
      return {
        ...rest,
        payerName: getNameFromId(payerId, groupUsers),
        participants: participants.map(
          (participant) => getNameFromId(participant.memberId, groupUsers))
          .join(", "),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(processedExpenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, `Group_${group?.name}_Expenses.xlsx`);
  }

  return (
    <div className="group-component">
      <GroupNavbar 
        setShowAddExpenseForm={setShowAddExpenseForm} 
        showAddExpenseForm={showAddExpenseForm} 
        setShowSettleUpForm={setShowSettleUpForm} 
        exportExpensesToExcel={exportExpensesToExcel}
        defaultUserId={defaultUserId}
        setDefaultUserId={setDefaultUserId}
      />

      {isSettling && (
        <div className="progress-container">
          <p>Settling Expenses... ({progress}/{unsettledExpenses.length})</p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(progress / unsettledExpenses.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="group-content">
        {unsettledExpenses && groupUsers &&
          <GroupBalances/>
        }

        <ExpenseList
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={openDeleteModal}
          onFilteredExpensesChange={handleFilteredExpensesChange}
        />
      </div>

      { showAddExpenseForm && 
        <AddExpenseForm 
          onSubmit={handleAddExpense} 
          onShowForm={setShowAddExpenseForm}
          defaultUserId={defaultUserId}
        /> 
      }

      { showSettleUpForm && group?._id &&
        <SettleUpForm 
          onSubmit={handleSettleUp} 
          onShowForm={setShowSettleUpForm}
          groupId={group._id}
        /> 
      }

      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteExpense}
        title="Confirm Delete"
      >
        Are you sure you want to delete this expense?
      </Modal>


    </div>
  )
};

export default GroupComponent;