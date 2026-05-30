import { PantryItem, Lending, Transaction, Trip, Reminder, ItemCategory } from "./types";

export const ITEM_PRESETS: { name: string; category: ItemCategory; unit: string }[] = [
  // Produce
  { name: "Apples", category: "Produce", unit: "kg" },
  { name: "Bananas", category: "Produce", unit: "bunch" },
  { name: "Fresh Spinach", category: "Produce", unit: "bag" },
  { name: "Roma Tomatoes", category: "Produce", unit: "kg" },
  { name: "Red Onions", category: "Produce", unit: "kg" },
  { name: "Idaho Potatoes", category: "Produce", unit: "bag" },
  
  // Dairy
  { name: "Whole Milk", category: "Dairy", unit: "liter" },
  { name: "Cheddar Cheese", category: "Dairy", unit: "g" },
  { name: "Unsalted Butter", category: "Dairy", unit: "pack" },
  { name: "Greek Yogurt", category: "Dairy", unit: "tub" },
  { name: "Organic Eggs", category: "Dairy", unit: "dozen" },

  // Bakery
  { name: "Sourdough Bread", category: "Bakery", unit: "loaf" },
  { name: "Whole Wheat buns", category: "Bakery", unit: "pack" },
  { name: "Butter Croissants", category: "Bakery", unit: "pcs" },
  { name: "Flour Tortillas", category: "Bakery", unit: "pack" },

  // Household
  { name: "Trash Bags", category: "Household", unit: "box" },
  { name: "Eco Dish Soap", category: "Household", unit: "bottle" },
  { name: "Kitchen Sponge", category: "Household", unit: "pack" },
  { name: "Laundry Detergent", category: "Household", unit: "bottle" },
  { name: "Paper Towels", category: "Household", unit: "pack" },

  // Meat
  { name: "Chicken Breast", category: "Meat", unit: "kg" },
  { name: "Ground Beef", category: "Meat", unit: "kg" },
  { name: "Atlantic Salmon", category: "Meat", unit: "pcs" },

  // Snacks
  { name: "Potato Chips", category: "Snacks", unit: "bag" },
  { name: "Salted Pretzels", category: "Snacks", unit: "bag" },
  { name: "Dark Chocolate", category: "Snacks", unit: "bar" },
  { name: "Mixed Nuts", category: "Snacks", unit: "pack" },
];

export const INITIAL_PANTRY: PantryItem[] = [
  {
    id: "item_1",
    name: "Organic Eggs",
    category: "Dairy",
    quantity: 1,
    unit: "dozen",
    isNeeded: false,
    isBought: false,
    updatedAt: "2026-05-23T10:00:00Z",
    lastUpdatedBy: "user_1"
  },
  {
    id: "item_2",
    name: "Whole Milk",
    category: "Dairy",
    quantity: 2,
    unit: "liter",
    isNeeded: true,
    isBought: false,
    updatedAt: "2026-05-24T02:00:00Z",
    lastUpdatedBy: "user_1"
  },
  {
    id: "item_3",
    name: "Sourdough Bread",
    category: "Bakery",
    quantity: 1,
    unit: "loaf",
    isNeeded: true,
    isBought: false,
    updatedAt: "2026-05-24T01:30:00Z",
    lastUpdatedBy: "user_1"
  },
  {
    id: "item_4",
    name: "Roma Tomatoes",
    category: "Produce",
    quantity: 3,
    unit: "kg",
    isNeeded: false,
    isBought: false,
    updatedAt: "2026-05-22T09:00:00Z",
    lastUpdatedBy: "user_1"
  },
  {
    id: "item_5",
    name: "Paper Towels",
    category: "Household",
    quantity: 1,
    unit: "pack",
    isNeeded: true,
    isBought: false,
    updatedAt: "2026-05-24T03:00:00Z",
    lastUpdatedBy: "user_1"
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip_1",
    name: "Summer Hawaii Trip",
    targetBudget: 2500,
    currency: "$",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    status: "active"
  },
  {
    id: "trip_2",
    name: "Weekend Cabin",
    targetBudget: 500,
    currency: "$",
    startDate: "2026-05-12",
    endDate: "2026-05-14",
    status: "completed"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "trans_1",
    amount: 1200,
    category: "Rent",
    notes: "May Month House Rent Payment",
    date: "2026-05-01",
    createdBy: "user_1"
  },
  {
    id: "trans_2",
    amount: 185.5,
    category: "Grocery",
    notes: "Weekly Costco Grocery restock",
    date: "2026-05-22",
    createdBy: "user_1"
  },
  {
    id: "trans_3",
    amount: 450,
    category: "Travel",
    notes: "Flight tickets to Honolulu",
    date: "2026-05-20",
    createdBy: "user_1",
    tripId: "trip_1"
  },
  {
    id: "trans_4",
    amount: 75.2,
    category: "Bills",
    notes: "Electricity utility autopay",
    date: "2026-05-24",
    createdBy: "user_1"
  },
  {
    id: "trans_5",
    amount: 60.0,
    category: "Entertainment",
    notes: "Weekend Cabin cabin campfire food",
    date: "2026-05-13",
    createdBy: "user_1",
    tripId: "trip_2"
  }
];

export const INITIAL_LENDINGS: Lending[] = [
  {
    id: "lend_1",
    personName: "Raju",
    amount: 500.0,
    type: "cash",
    notes: "Lent for vehicle fuel/food",
    date: "2026-05-20T12:00:00Z",
    dueDate: "2026-06-05",
    status: "pending",
    createdBy: "user_1",
    repayments: [
      { id: "rep_1", amount: 150.0, date: "2026-05-22T14:30:00Z", notes: "First cash installment back" }
    ]
  },
  {
    id: "lend_2",
    personName: "Samar",
    amount: 320.0,
    type: "product_bill",
    notes: "Invoice debt for joint washing repair bill",
    date: "2026-05-15T09:15:00Z",
    dueDate: "2026-05-28",
    status: "pending",
    createdBy: "user_1",
    repayments: []
  },
  {
    id: "lend_3",
    personName: "Ananya",
    amount: 150.0,
    type: "cash",
    notes: "Rent shared contribution gap cash loan",
    date: "2026-05-10T11:00:00Z",
    dueDate: "2026-05-22",
    status: "paid",
    createdBy: "user_1",
    repayments: [
      { id: "rep_2", amount: 150.0, date: "2026-05-21T18:00:00Z", notes: "Settle full cash" }
    ]
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "rem_1",
    text: "Pay water utility invoice",
    dateTime: "2026-05-25T15:00:00Z",
    isCompleted: false,
    createdBy: "user_1"
  },
  {
    id: "rem_2",
    text: "Settle Raju's Kathabook loan due date",
    dateTime: "2026-06-05T12:00:00Z",
    isCompleted: false,
    createdBy: "user_1"
  },
  {
    id: "rem_3",
    text: "Pantry replenishment restock checkout",
    dateTime: "2026-05-24T18:30:00Z",
    isCompleted: true,
    createdBy: "user_1"
  }
];
