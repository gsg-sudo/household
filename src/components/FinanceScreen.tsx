import React, { useState } from "react";
import { 
  DollarSign, Calendar, Tag, FileText, ChevronRight, ArrowLeft, 
  Percent, Trash2, Plus, LogOut, CheckCircle2, AlertTriangle, Briefcase 
} from "lucide-react";
import { Transaction, Trip, TransactionCategory } from "../types";

interface FinanceScreenProps {
  transactions: Transaction[];
  trips: Trip[];
  onAddTransaction: (t: Omit<Transaction, "id" | "createdBy">) => void;
  onAddTrip: (trip: Omit<Trip, "id">) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onUpdateTripStatus: (id: string, status: "active" | "completed") => void;
  osStyle: "ios" | "android";
  currencySymbol?: string;
}

export const CATEGORIES: TransactionCategory[] = [
  "Rent", "Grocery", "Bills", "Entertainment", "Shopping", "Travel", "Medical", "Debt", "Education", "Other"
];

export default function FinanceScreen({
  transactions,
  trips,
  onAddTransaction,
  onAddTrip,
  onDeleteTransaction,
  onDeleteTrip,
  onUpdateTripStatus,
  osStyle,
  currencySymbol = "$",
}: FinanceScreenProps) {
  const [activeTab, setActiveTab] = useState<"history" | "trips">("history");
  
  // Selected single trip to examine
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Modal triggers
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  // New Transaction Form State
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState<TransactionCategory>("Other");
  const [txNotes, setTxNotes] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txLinkedTrip, setTxLinkedTrip] = useState("");

  // New Trip Form State
  const [tripName, setTripName] = useState("");
  const [tripBudget, setTripBudget] = useState("");
  const [tripCurrency, setTripCurrency] = useState(currencySymbol);

  React.useEffect(() => {
    setTripCurrency(currencySymbol);
  }, [currencySymbol]);
  const [tripStart, setTripStart] = useState("");
  const [tripEnd, setTripEnd] = useState("");

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || isNaN(parseFloat(txAmount)) || parseFloat(txAmount) <= 0) return;

    onAddTransaction({
      amount: parseFloat(txAmount),
      category: txCategory,
      notes: txNotes,
      date: txDate,
      tripId: txLinkedTrip || undefined
    });

    // Reset Form
    setTxAmount("");
    setTxCategory("Other");
    setTxNotes("");
    setTxDate(new Date().toISOString().split("T")[0]);
    setTxLinkedTrip("");
    setShowAddTxModal(false);
  };

  const handleTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName || !tripBudget || isNaN(parseFloat(tripBudget))) return;

    onAddTrip({
      name: tripName,
      targetBudget: parseFloat(tripBudget),
      currency: tripCurrency,
      startDate: tripStart || new Date().toISOString().split("T")[0],
      endDate: tripEnd || new Date().toISOString().split("T")[0],
      status: "active"
    });

    // Reset Form
    setTripName("");
    setTripBudget("");
    setTripCurrency("$");
    setTripStart("");
    setTripEnd("");
    setShowAddTripModal(false);
  };

  // Calculations
  const totalSpend = transactions.reduce((acc, current) => acc + current.amount, 0);

  // Active Trip detail details
  const currentTrip = trips.find(t => t.id === selectedTripId);
  const currentTripTransactions = transactions.filter(t => t.tripId === selectedTripId);
  const currentTripSpend = currentTripTransactions.reduce((acc, item) => acc + item.amount, 0);
  const currentTripBudgetPercent = currentTrip 
    ? Math.min((currentTripSpend / currentTrip.targetBudget) * 100, 100) 
    : 0;

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] text-gray-900 overflow-y-auto max-h-full">
      {/* Visual toggle header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shrink-0">
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab("history"); setSelectedTripId(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "history" && !selectedTripId
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Ledger History
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "trips" || selectedTripId
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Trip Budgets
          </button>
        </div>
      </div>

      {/* RENDER VIEW: Selected Trip Detail sub-page */}
      {selectedTripId && currentTrip ? (
        <div className="flex flex-col gap-4 p-4">
          <button
            onClick={() => setSelectedTripId(null)}
            className="flex items-center gap-1 text-xs text-green-700 font-sans font-semibold hover:underline bg-transparent border-0 cursor-pointer text-left py-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Trip List
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  currentTrip.status === "active" ? "bg-green-150 text-green-800 bg-green-50" : "bg-gray-100 text-gray-600"
                }`}>
                  {currentTrip.status.toUpperCase()}
                </span>
                <h3 className="text-lg font-sans font-bold text-gray-950 mt-1">{currentTrip.name}</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {currentTrip.startDate} to {currentTrip.endDate}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xl font-mono font-bold text-gray-950">
                  {currentTrip.currency}{currentTripSpend.toFixed(2)}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  of {currentTrip.currency}{currentTrip.targetBudget.toFixed(2)} Limit
                </span>
              </div>
            </div>

            {/* Custom progress indicators */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs text-gray-500 font-mono mb-1.5">
                <span>Budget Consumed</span>
                <span className={`font-bold ${currentTripSpend > currentTrip.targetBudget ? "text-orange-600" : "text-green-700"}`}>
                  {((currentTripSpend / currentTrip.targetBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${currentTripBudgetPercent}%`,
                    backgroundColor: currentTripSpend > currentTrip.targetBudget ? "#EA580C" : "#2E7D32"
                  }} 
                />
              </div>
            </div>

            {/* Toggle Status Actions */}
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100 col-span-2">
              <button
                type="button"
                onClick={() => onUpdateTripStatus(currentTrip.id, currentTrip.status === "active" ? "completed" : "active")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer transition select-none"
              >
                Mark as {currentTrip.status === "active" ? "Completed" : "Active"}
              </button>
              <button
                type="button"
                onClick={() => { onDeleteTrip(currentTrip.id); setSelectedTripId(null); }}
                className="text-xs font-semibold text-red-650 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 cursor-pointer transition select-none"
              >
                Delete Tour
              </button>
            </div>
          </div>

          {/* Linked transactions log */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider font-semibold px-1">
              Linked Expenses
            </h4>
            <div className="flex flex-col gap-2">
              {currentTripTransactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 font-mono text-xs font-bold font-mono">
                      {t.category[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-950 truncate max-w-[170px]">
                        {t.notes || t.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {t.category} • {t.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-gray-950">
                      -{currentTrip.currency}{t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-gray-300 hover:text-red-500 border-0 bg-transparent p-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {currentTripTransactions.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 font-sans italic">
                  No linked expenses inside this trip yet. Link a transaction when creating or adding!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "history" ? (
        /* RENDER VIEW: Ledger history log list */
        <div className="flex flex-col gap-4 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-semibold">
                Total Month Expenses
              </span>
              <span className="text-2xl font-mono font-bold text-gray-950 mt-1">
                {currencySymbol}{totalSpend.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setShowAddTxModal(true)}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer select-none transition shadow-xs"
              style={{ backgroundColor: brandColor }}
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {transactions.map((t) => {
              const linkedTripObj = trips.find(trip => trip.id === t.tripId);
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-mono text-xs font-bold text-gray-500 shrink-0">
                      {t.category[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-950 truncate max-w-[170px]">
                        {t.notes || `Spent on ${t.category}`}
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {t.category} • {t.date}
                        </span>
                        {linkedTripObj && (
                          <span className="text-[9px] bg-green-50 text-green-800 font-sans px-1.5 py-0.2 rounded-full font-semibold">
                            🌴 {linkedTripObj.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold font-mono text-gray-950">
                      -{currencySymbol}{t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-gray-300 hover:text-red-500 border-0 bg-transparent p-1 cursor-pointer transition select-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {transactions.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
                Blank slate of expenses. Add entries using the upper buttons or talk to the NLP assistant!
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RENDER VIEW: Trip budgets list */
        <div className="flex flex-col gap-4 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-semibold">
                Trip Ledger Management
              </span>
              <span className="text-xs text-gray-500 font-sans mt-1">
                Establish budgets for specific tours
              </span>
            </div>
            <button
              onClick={() => setShowAddTripModal(true)}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer select-none transition shadow-xs"
              style={{ backgroundColor: brandColor }}
            >
              <Plus className="w-4 h-4" /> Create Trip
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {trips.map((trip) => {
              const tripTransactions = transactions.filter(t => t.tripId === trip.id);
              const tripSpend = tripTransactions.reduce((acc, item) => acc + item.amount, 0);
              const isOver = tripSpend > trip.targetBudget;

              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:border-gray-200 transition cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 shrink-0">
                        <Briefcase className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-gray-950 truncate max-w-[150px]">
                          {trip.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {trip.startDate} to {trip.endDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold font-mono text-gray-950">
                        {trip.currency}{tripSpend.toFixed(2)} / {trip.currency}{trip.targetBudget}
                      </span>
                      <span className={`text-[9px] font-semibold font-sans mt-0.5 px-2 py-0.2 rounded-full ${
                        isOver ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-800"
                      }`}>
                        {isOver ? "Over Limit" : `${((tripSpend / trip.targetBudget) * 100).toFixed(0)}% Consumed`}
                      </span>
                    </div>
                  </div>

                  {/* Tiny inline progress bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((tripSpend / trip.targetBudget) * 100, 100)}%`,
                        backgroundColor: isOver ? "#EA580C" : "#2E7D32"
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {trips.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
                No trips created. Set a budget limit for your next tour or vacation!
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORM MODAL: Add Expense */}
      {showAddTxModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-green-900 px-5 py-4 text-white flex justify-between items-center" style={{ backgroundColor: brandColor }}>
              <span className="text-sm font-semibold font-sans">Add Ledger Expense</span>
              <button 
                onClick={() => setShowAddTxModal(false)}
                className="text-white opacity-70 hover:opacity-100 border-0 bg-transparent text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="p-5 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">{currencySymbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as TransactionCategory)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Notes Description</label>
                <input
                  type="text"
                  placeholder="Costco grocery, electric utility bill, etc."
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Date</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Attach to Trip Budget (Optional)</label>
                <select
                  value={txLinkedTrip}
                  onChange={(e) => setTxLinkedTrip(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="">-- No Tour Link --</option>
                  {trips.filter(tr => tr.status === "active").map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full text-center text-white py-2.5 rounded-xl font-semibold font-sans text-xs select-none cursor-pointer hover:opacity-90 transition mt-2"
                style={{ backgroundColor: brandColor }}
              >
                Insert Expense Form
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Create Trip */}
      {showAddTripModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-green-900 px-5 py-4 text-white flex justify-between items-center" style={{ backgroundColor: brandColor }}>
              <span className="text-sm font-semibold font-sans">Establish Trip Budget Limit</span>
              <button 
                onClick={() => setShowAddTripModal(false)}
                className="text-white opacity-70 hover:opacity-100 border-0 bg-transparent text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTripSubmit} className="p-5 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Trip Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hawaii Summer Cruise"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Currency</label>
                  <select
                    value={tripCurrency}
                    onChange={(e) => setTripCurrency(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2.5 focus:outline-none"
                  >
                    <option value="$">$ USD</option>
                    <option value="د.إ">د.إ AED</option>
                    <option value="₹">₹ INR</option>
                    <option value="S$">S$ SGD</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Target Budget Limit *</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={tripBudget}
                    onChange={(e) => setTripBudget(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Start Date</label>
                  <input
                    type="date"
                    value={tripStart}
                    onChange={(e) => setTripStart(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">End Date</label>
                  <input
                    type="date"
                    value={tripEnd}
                    onChange={(e) => setTripEnd(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-center text-white py-2.5 rounded-xl font-semibold font-sans text-xs select-none cursor-pointer hover:opacity-90 transition mt-2"
                style={{ backgroundColor: brandColor }}
              >
                Register Tour Track
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
