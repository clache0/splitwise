import { z } from 'zod';

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

export const expenseSchema = z.object({
  _id: z.string().optional(),
  groupId: z.string(),
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  payerId: z.string(),
  participants: z.array(
    z.object({
      memberId: z.string(),
      share: z.number(),
    })
  ),
  settled: z.boolean(),
  type: z.enum(['normal', 'settle-up']),
});

export type Expense = z.infer<typeof expenseSchema>;

// type ExpenseType = 'normal' | 'settle-up';
// export interface Expense {
//   _id?: string;
//   groupId: string;
//   title: string;
//   amount: number;
//   date: string;
//   payerId: string;
//   participants: Participant[];
//   settled: boolean;
//   type: ExpenseType;
// }

export interface Balance {
  [memberId: string]: {
    owes: { [owedTo: string]: number };
    isOwed: { [owedBy: string]: number };
    netBalance: number;
  };
}