import React, { useState, useEffect } from "react";
import { 
  BookOpen, Sparkles, AlertCircle, Laptop, Smartphone, HelpCircle, 
  Info, ArrowRight, CornerDownRight, Check, Database, AppWindow, Pocket
} from "lucide-react";

import { 
  Lending, Transaction, Trip, PantryItem, Reminder, 
  LendingType, ItemCategory, TransactionCategory, CURRENCIES
} from "./types";

import { 
  INITIAL_LENDINGS, INITIAL_TRANSACTIONS, INITIAL_PANTRY, 
  INITIAL_TRIPS, INITIAL_REMINDERS 
} from "./presets";

import DeviceFrame from "./components/DeviceFrame";
import AssistantControl from "./components/AssistantControl";
import DashboardScreen from "./components/DashboardScreen";
import FinanceScreen from "./components/FinanceScreen";
import TodosScreen from "./components/TodosScreen";
import RemindersScreen from "./components/RemindersScreen";
import KathabookScreen from "./components/KathabookScreen";

export default function App() {
  // Offline-First LocalStorage state loaders
  const [lendings, setLendings] = useState<Lending[]>(() => {
    const saved = localStorage.getItem("household_lendings");
    return saved ? JSON.parse(saved) : INITIAL_LENDINGS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("household_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem("household_pantry");
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem("household_trips");
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("household_reminders");
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  // UI state controllers
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [osStyle, setOsStyle] = useState<"ios" | "android">("android");
  const [cartStateActive, setCartStateActive] = useState(false);
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    return localStorage.getItem("household_currency_code") || "USD";
  });

  const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  useEffect(() => {
    localStorage.setItem("household_currency_code", currencyCode);
  }, [currencyCode]);

  // Synchronize state with persistent storage on change
  useEffect(() => {
    localStorage.setItem("household_lendings", JSON.stringify(lendings));
  }, [lendings]);

  useEffect(() => {
    localStorage.setItem("household_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("household_pantry", JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem("household_trips", JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem("household_reminders", JSON.stringify(reminders));
  }, [reminders]);

  // LEDGER HANDLERS: Kathabook (Lending)
  const handleAddLending = (newLending: Omit<Lending, "id" | "date" | "createdBy">) => {
    const fresh: Lending = {
      ...newLending,
      id: "lend_" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      createdBy: "user_1"
    };
    setLendings(prev => [fresh, ...prev]);
  };

  const handleAddRepayment = (lendingId: string, parsedRepay: { amount: number; notes: string }) => {
    setLendings(prev => prev.map(lend => {
      if (lend.id !== lendingId) return lend;

      const newRepayment = {
        id: "rep_" + Math.random().toString(36).substr(2, 9),
        amount: parsedRepay.amount,
        notes: parsedRepay.notes,
        date: new Date().toISOString()
      };

      const updatedRepayments = [...lend.repayments, newRepayment];
      const totalRepaidBudget = updatedRepayments.reduce((sum, item) => sum + item.amount, 0);
      
      // Auto-Settle ticker shifting state
      const isSettledComplete = totalRepaidBudget >= lend.amount;

      return {
        ...lend,
        repayments: updatedRepayments,
        status: isSettledComplete ? ("paid" as const) : ("pending" as const)
      };
    }));
  };

  const handleDeleteLending = (id: string) => {
    setLendings(prev => prev.filter(item => item.id !== id));
  };


  // EXPENSE HANDLERS: Finance & Trip Bookings
  const handleAddTransaction = (newTx: Omit<Transaction, "id" | "createdBy">) => {
    const fresh: Transaction = {
      ...newTx,
      id: "trans_" + Math.random().toString(36).substr(2, 9),
      createdBy: "user_1"
    };
    setTransactions(prev => [fresh, ...prev]);
  };

  const handleAddTrip = (newTrip: Omit<Trip, "id">) => {
    const fresh: Trip = {
      ...newTrip,
      id: "trip_" + Math.random().toString(36).substr(2, 9)
    };
    setTrips(prev => [fresh, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(item => item.id !== id));
    // Orphan linked transactions trip attachments
    setTransactions(prev => prev.map(t => t.tripId === id ? { ...t, tripId: undefined } : t));
  };

  const handleUpdateTripStatus = (id: string, status: "active" | "completed") => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };


  // PANTRY & LIST HANDLERS: Todos
  const handleAddItem = (newItem: Omit<PantryItem, "id" | "updatedAt" | "lastUpdatedBy">) => {
    const fresh: PantryItem = {
      ...newItem,
      id: "item_" + Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: "user_1"
    };
    setPantryItems(prev => [fresh, ...prev]);
  };

  const handleToggleItemNeeded = (id: string) => {
    setPantryItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        isNeeded: !item.isNeeded,
        isBought: false, // reset completed status when toggling
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const handleToggleItemBought = (id: string) => {
    setPantryItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        isBought: !item.isBought,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const handleDeleteItem = (id: string) => {
    setPantryItems(prev => prev.filter(item => item.id !== id));
  };


  // NOTIFIER HANDLERS: Reminders
  const handleAddReminder = (newRem: Omit<Reminder, "id" | "isCompleted" | "createdBy">) => {
    const fresh: Reminder = {
      ...newRem,
      id: "rem_" + Math.random().toString(36).substr(2, 9),
      isCompleted: false,
      createdBy: "user_1"
    };
    setReminders(prev => [fresh, ...prev]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        isCompleted: !item.isCompleted
      };
    }));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(item => item.id !== id));
  };


  // GEMINI PARSED INPUT COUPLER
  const handleParsedApply = (parsed: {
    detectedType: string;
    explanation: string;
    data: any;
  }) => {
    const { detectedType, data } = parsed;
    if (!data) return;

    if (detectedType === "lending") {
      handleAddLending({
        personName: data.personName || "Samar",
        amount: Number(data.amount) || 100.0,
        type: (data.type === "product_bill" ? "product_bill" : "cash") as LendingType,
        notes: data.notes || "Conversational smart lending",
        status: "pending",
        dueDate: data.dueDate || new Date().toISOString().split("T")[0],
        repayments: []
      });
    } else if (detectedType === "transaction") {
      handleAddTransaction({
        amount: Number(data.amount) || 50.0,
        category: (data.category || "Other") as TransactionCategory,
        notes: data.notes || "Parsed travel/bills expense",
        date: data.date || new Date().toISOString().split("T")[0]
      });
    } else if (detectedType === "item") {
      handleAddItem({
        name: data.name || "Apples",
        category: (data.itemCategory || "Produce") as ItemCategory,
        quantity: Number(data.quantity) || 1,
        unit: data.unit || "pcs",
        isNeeded: data.isNeeded !== undefined ? data.isNeeded : true,
        isBought: false
      });
    } else if (detectedType === "reminder") {
      handleAddReminder({
        text: data.text || "Synchronized calendar task",
        dateTime: data.dateTime || new Date().toISOString()
      });
    }
  };

  // Helper shortcut mapping for quick-actions on home page
  const handleOpenQuickAddShortcut = (type: "expense" | "debt" | "reminder") => {
    if (type === "expense") {
      setActiveTab("finance");
      setTimeout(() => {
        const btn = document.querySelector('[title="Add Expense"]');
        if (btn) (btn as HTMLButtonElement).click();
      }, 50);
    } else if (type === "debt") {
      setActiveTab("kathabook");
    } else if (type === "reminder") {
      setActiveTab("reminders");
    }
  };

  // Synchronized Header Titles corresponding to bottom navigation tabs
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Household Dashboard";
      case "finance": return "Trip & Finance Log";
      case "todos": return "Pantry Chest checklist";
      case "reminders": return "System Alert Alarms";
      case "kathabook": return "Kathabook Ledger Book";
      default: return "Household Manager";
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#F3F4F6] flex flex-col items-center sm:py-6 md:py-10 sm:px-4 md:px-8 select-none">
      {/* Outer Web App Grid Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-8 items-start">
        
        {/* Left Informational & AI Assistant Column */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <h1 className="font-sans font-bold tracking-tight text-gray-950 text-2xl flex items-center gap-2">
              <Pocket className="w-7.5 h-7.5 text-green-700 shrink-0" />
              Household Companion
            </h1>
            <p className="text-sm font-sans text-gray-500 mt-2 leading-relaxed">
              Fully offline-first bookkeeping tracker managing resource schedules, trip limits, alarm alerts, and cash loans in a single cross-platform code architecture.
            </p>

            <div className="flex gap-1.5 mt-5 bg-gray-50 p-1.5 rounded-xl border border-gray-150">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mt-1.5 shrink-0 ml-1.5" />
              <p className="text-[10px] text-gray-500 font-sans">
                <b>Local Device Engines</b>: Synchronizing Room (Android Database) schemas alongside native SwiftData (iOS Structs) storage.
              </p>
            </div>
          </div>

          {/* Persistent AI text processing parsing station */}
          <AssistantControl onParsedApply={handleParsedApply} osStyle={osStyle} />

          {/* Quick Simulated PWA manual setup step */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
            <h3 className="font-sans font-semibold text-gray-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AppWindow className="w-4.5 h-4.5 text-green-700" /> Simulated Mobile Installer
            </h3>

            <div className="flex flex-col gap-3 mt-4 text-xs text-gray-600 font-sans leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 bg-green-50 text-green-700 rounded-full flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">1</span>
                <div>
                  <b className="text-gray-900 block">Open share sheet menu</b>
                  Navigate using the preview panel link in Safari (iOS) or Chrome (Android).
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 bg-green-50 text-green-700 rounded-full flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">2</span>
                <div>
                  <b className="text-gray-900 block">Add to Home Screen</b>
                  Tap the utility link to instantly configure an offline standalone PWA on your phone.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Phone Mockup Panel */}
        <div className="w-full h-full lg:col-span-7 flex justify-center lg:sticky lg:top-10">
          <DeviceFrame
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            osStyle={osStyle}
            setOsStyle={setOsStyle}
            headerTitle={getHeaderTitle()}
            cartStateActive={cartStateActive}
            onCartStateToggle={setCartStateActive}
            lendingsCount={lendings.filter(l => l.status === "pending").length}
            remindersCount={reminders.filter(r => !r.isCompleted).length}
            currencyCode={currencyCode}
            onCurrencyChange={setCurrencyCode}
            onParsedApply={handleParsedApply}
          >
            {/* Conditional view rendering matching active simulated tab */}
            {activeTab === "dashboard" && (
              <DashboardScreen
                lendings={lendings}
                transactions={transactions}
                pantryItems={pantryItems}
                reminders={reminders}
                onNavigate={setActiveTab}
                onOpenQuickAdd={handleOpenQuickAddShortcut}
                osStyle={osStyle}
                currencySymbol={selectedCurrency.symbol}
              />
            )}

            {activeTab === "finance" && (
              <FinanceScreen
                transactions={transactions}
                trips={trips}
                onAddTransaction={handleAddTransaction}
                onAddTrip={handleAddTrip}
                onDeleteTransaction={handleDeleteTransaction}
                onDeleteTrip={handleDeleteTrip}
                onUpdateTripStatus={handleUpdateTripStatus}
                osStyle={osStyle}
                currencySymbol={selectedCurrency.symbol}
              />
            )}

            {activeTab === "todos" && (
              <TodosScreen
                pantryItems={pantryItems}
                onAddItem={handleAddItem}
                onToggleItemNeeded={handleToggleItemNeeded}
                onToggleItemBought={handleToggleItemBought}
                onDeleteItem={handleDeleteItem}
                activeCartState={cartStateActive}
                setActiveCartState={setCartStateActive}
                osStyle={osStyle}
              />
            )}

            {activeTab === "reminders" && (
              <RemindersScreen
                reminders={reminders}
                onAddReminder={handleAddReminder}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
                osStyle={osStyle}
              />
            )}

            {activeTab === "kathabook" && (
              <KathabookScreen
                lendings={lendings}
                onAddLending={handleAddLending}
                onAddRepayment={handleAddRepayment}
                onDeleteLending={handleDeleteLending}
                osStyle={osStyle}
                currencySymbol={selectedCurrency.symbol}
              />
            )}
          </DeviceFrame>
        </div>

      </div>
    </div>
  );
}
