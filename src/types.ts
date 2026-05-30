export type LendingType = "cash" | "product_bill";
export type LendingStatus = "pending" | "paid";

export interface Repayment {
  id: string;
  amount: number;
  date: string; // ISO date timestamp
  notes: string;
}

export interface Lending {
  id: string;
  personName: string;
  amount: number;
  type: LendingType;
  notes: string;
  date: string; // ISO timestamp
  dueDate: string; // YYYY-MM-DD
  status: LendingStatus;
  createdBy: string;
  repayments: Repayment[];
}

export type TransactionCategory =
  | "Rent"
  | "Grocery"
  | "Bills"
  | "Entertainment"
  | "Shopping"
  | "Travel"
  | "Medical"
  | "Debt"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  category: TransactionCategory;
  notes: string;
  date: string; // ISO timestamp or YYYY-MM-DD
  createdBy: string;
  tripId?: string; // Optional trip attachment
}

export interface Trip {
  id: string;
  name: string;
  targetBudget: number;
  currency: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: "active" | "completed";
}

export type ItemCategory = "Produce" | "Dairy" | "Bakery" | "Household" | "Meat" | "Snacks" | "Other";

export interface PantryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  isNeeded: boolean; // Marked as needed / Shopping list
  isBought: boolean; // Marked as bought
  updatedAt: string; // ISO Date stream
  lastUpdatedBy: string;
}

export interface Reminder {
  id: string;
  text: string;
  dateTime: string; // ISO Date stream
  isCompleted: boolean;
  createdBy: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "AED", symbol: "د.إ", label: "AED (د.إ)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "SGD", symbol: "S$", label: "SGD (S$)" },
];
