import * as XLSX from 'xlsx';
import { getIdFromName } from './utils';
import config from '../../config.json'
import { Group, User, Expense, Participant } from '../types/types';

export const importExpensesFromExcel = async (file: File, group: Group, users: User[]) => {
  const reader = new FileReader();

  return new Promise<Expense[]>((resolve, reject) => {
    reader.onload = async (e) => {
      // convert to Uint8Array so that XLSX can work with data
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const importedExpenses = await processImportedExpenses(jsonData, group, users);
        resolve(importedExpenses);
      } catch (error) {
        console.error("Error processing imported expenses: ", error);
        alert("Error processing expenses: " + error);
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file); // calls onload
  });

};

// process imported data from JSON to Expense[]
export const processImportedExpenses = async (jsonData: any[], group: Group, users: User[]) => {
  // const currentYear = new Date().getFullYear();

  // convert importedExpenses to Expense[] type and send expenses to backend
  const importedExpenses: Expense[] = jsonData.map((item) => {
    // validate group id
    if (!group._id) {
      throw new Error("Group ID is missing. Cannot process expenses without valid group ID.");
    }

    // validate payerId
    const payerId = getIdFromName(item.payerName, users);
    if (!payerId) {
      throw new Error(`Payer ID is missing for the payer name: ${item.payerName}. Cannot process expense.`);
    }

    // convert participants to Participant[]
    const participantsArray: Participant[] = item.participants.split(', ').map((name: string) => ({
      memberId: getIdFromName(name, users),
      share: 0, // placeholder
    }));
    const participantsCount = participantsArray.length;

    // // TODO Convert item.date to a string in YYYY-MM-DD format if needed
    // let dateString = item.date;
    // if (typeof item.date === "string" && /^\d{2}\.\d{2}$/.test(item.date)) {
    //   // If format is MM.DD, convert to YYYY-MM-DD format using the current year
    //   const [month, day] = item.date.split('.').map(Number);
    //   dateString = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // }

    return {
      groupId: group._id,
      title: item.title,
      amount: item.amount,
      date: item.date,
      payerId: payerId,
      participants: participantsArray.map((participant: Participant) => ({
        ...participant,
        share: 100 / participantsCount,
      })),
      settled: item.settled,
    };
  });

  // send `importedExpenses` to your backend or update your state
  const isSaved = await saveImportedExpenses(importedExpenses);
  if (isSaved) {
    return importedExpenses;
  }
  return [];
};

// post Expense[] data to backend or update state
// return true if successful
export const saveImportedExpenses = async (importedExpenses: Expense[]) => {
  const url = config.serverUrl + '/expenses/import';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importedExpenses),
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Failed to import expenses");
      return false;
    }
  } catch (error) {
    console.error("Error importing expenses:", error);
  }
};