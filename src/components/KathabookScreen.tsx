import React, { useState } from "react";
import { 
  Coins, FileText, ArrowUpRight, ArrowDownRight, Plus, Calendar, 
  ChevronDown, ChevronUp, History, CreditCard, Trash2, Check, DollarSign 
} from "lucide-react";
import { Lending, Repayment, LendingType, LendingStatus } from "../types";

interface KathabookScreenProps {
  lendings: Lending[];
  onAddLending: (l: Omit<Lending, "id" | "date" | "createdBy">) => void;
  onAddRepayment: (lendingId: string, repayment: Omit<Repayment, "id" | "date">) => void;
  onDeleteLending: (id: string) => void;
  osStyle: "ios" | "android";
  currencySymbol?: string;
}

export default function KathabookScreen({
  lendings,
  onAddLending,
  onAddRepayment,
  onDeleteLending,
  osStyle,
  currencySymbol = "$",
}: KathabookScreenProps) {
  const [filterState, setFilterState] = useState<"all" | "pending" | "paid">("all");
  const [expandedLendingId, setExpandedLendingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lending Form State
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<LendingType>("cash");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  // Incremental Repayment inline form
  const [repayAmount, setRepayAmount] = useState("");
  const [repayNotes, setRepayNotes] = useState("");

  const handleSubmitLending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !amount || isNaN(parseFloat(amount))) return;

    onAddLending({
      personName: personName.trim(),
      amount: parseFloat(amount),
      type,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      notes: notes.trim(),
      status: "pending", // default
      repayments: [] // starts empty
    });

    // Reset Form
    setPersonName("");
    setAmount("");
    setType("cash");
    setDueDate("");
    setNotes("");
    setShowAddModal(false);
  };

  const handleAddRepay = (lendingId: string) => {
    const parsedAmt = parseFloat(repayAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    onAddRepayment(lendingId, {
      amount: parsedAmt,
      notes: repayNotes.trim() || "Incremental repayment contribution"
    });

    setRepayAmount("");
    setRepayNotes("");
  };

  // Calculations
  const totalVolumeLent = lendings.reduce((sum, item) => sum + item.amount, 0);
  
  const totalOutstandingCollect = lendings
    .filter(item => item.status === "pending")
    .reduce((sum, item) => {
      const repaidSum = item.repayments.reduce((acc, rep) => acc + rep.amount, 0);
      return sum + (item.amount - repaidSum);
    }, 0);

  const filteredLendings = lendings.filter((lending) => {
    if (filterState === "pending") return lending.status === "pending";
    if (filterState === "paid") return lending.status === "paid";
    return true; // "all"
  });

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] overflow-y-auto max-h-full">
      {/* Outstanding Ledger stats header card */}
      <div className="p-4 shrink-0 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-semibold">
              Outstanding Debt
            </span>
            <span className="text-xl font-mono font-bold text-green-800 mt-1.5">
              {currencySymbol}{totalOutstandingCollect.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 font-sans mt-0.5">
              Net balance to recover
            </span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-semibold">
              Total Lent volume
            </span>
            <span className="text-xl font-mono font-bold text-gray-950 mt-1.5">
              {currencySymbol}{totalVolumeLent.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 font-sans mt-0.5">
              Total historic lent principal
            </span>
          </div>
        </div>

        {/* Filter navigation list */}
        <div className="flex justify-between items-center gap-3 mt-1.5">
          <div className="flex bg-gray-100 p-1 rounded-xl w-full">
            {(["all", "pending", "paid"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`py-1.5 text-[11px] font-semibold rounded-lg capitalize flex-1 transition ${
                  filterState === st ? "bg-white text-gray-950 shadow-xs" : "text-gray-500"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer select-none shrink-0 transition"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="w-3.5 h-3.5" /> Log Debt
          </button>
        </div>
      </div>

      {/* Main Items board */}
      <div className="flex flex-col gap-3 p-4 pt-0">
        <h4 className="text-xs font-mono uppercase text-gray-500 tracking-wider font-semibold ml-1">
          Active debtor books
        </h4>

        <div className="flex flex-col gap-3">
          {filteredLendings.map((lending) => {
            const isExpanded = expandedLendingId === lending.id;
            const repaidAmount = lending.repayments.reduce((acc, r) => acc + r.amount, 0);
            const remainingBalance = Math.max(lending.amount - repaidAmount, 0);
            const repaidPercent = Math.min((repaidAmount / lending.amount) * 100, 100);

            return (
              <div
                key={lending.id}
                className={`bg-white border rounded-2xl shadow-xs overflow-hidden transition ${
                  isExpanded ? "border-green-600/30 ring-2 ring-green-600/5" : "border-gray-100"
                }`}
              >
                {/* Main clickable Header row */}
                <div
                  onClick={() => setExpandedLendingId(isExpanded ? null : lending.id)}
                  className="p-4 flex justify-between items-center cursor-pointer select-none gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      lending.type === "product_bill" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-800"
                    }`}>
                      {lending.type === "product_bill" ? (
                        <FileText className="w-4.5 h-4.5" />
                      ) : (
                        <Coins className="w-4.5 h-4.5" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-950 flex items-center gap-1.5">
                        {lending.personName}
                        {lending.status === "paid" && (
                          <span className="text-[9px] bg-green-100 text-green-900 border border-green-200.5 font-bold font-mono px-1.5 py-0.2 rounded-full uppercase">
                            Paid
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-500 font-sans italic truncate max-w-[150px]">
                        {lending.notes || "No notes"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-950 tracking-tight">
                        {currencySymbol}{remainingBalance.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {lending.status === "paid" || remainingBalance === 0 ? (
                          <span className="text-green-600">cleared</span>
                        ) : repaidAmount > 0 ? (
                          `of ${currencySymbol}${lending.amount.toFixed(0)}`
                        ) : (
                          "due"
                        )}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Inline mini progress progress */}
                {lending.status === "pending" && (
                  <div className="w-full bg-gray-50 h-1">
                    <div className="bg-green-700 h-full transition-all duration-300" style={{ width: `${repaidPercent}%` }} />
                  </div>
                )}

                {/* EXPANDED AREA detailing part-payment timeline and logging form */}
                {isExpanded && (
                  <div className="bg-[#FAFBFB] px-4 py-4 border-t border-gray-100/80 flex flex-col gap-4">
                    {/* Details overview metrics */}
                    <div className="grid grid-cols-2 bg-white rounded-xl border border-gray-150 p-3 text-[11px] font-sans text-gray-600 gap-1.5">
                      <div>Debt Logged: <b className="text-gray-900 font-semibold">{new Date(lending.date).toLocaleDateString()}</b></div>
                      <div>Repayment target: <b className="text-gray-900 font-semibold">{lending.dueDate}</b></div>
                      <div>Type: <b className="text-gray-900 font-semibold capitalize">{lending.type}</b></div>
                      <div className="flex justify-between items-center col-span-2 pt-1 border-t border-gray-100">
                        <span>Lending database settle ID:</span>
                        <code className="text-[10px] text-gray-400 font-mono tracking-tighter">{lending.id}</code>
                      </div>
                    </div>

                    {/* Timeline repayment ledger */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1 font-mono">
                        <History className="w-3.5 h-3.5 text-gray-300" /> repayment timeline logs ({lending.repayments.length})
                      </span>

                      {lending.repayments.map((rep) => (
                        <div key={rep.id} className="bg-white rounded-xl border border-gray-100 p-3 flex justify-between items-center gap-2 shadow-2xs">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-semibold text-gray-900 truncate">
                              {rep.notes}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">
                              {new Date(rep.date).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-bold font-mono text-green-700 shrink-0">
                            -{currencySymbol}{rep.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {lending.repayments.length === 0 && (
                        <div className="text-center p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
                          No payments received yet. Use the log box below to credit repayment.
                        </div>
                      )}
                    </div>

                    {/* Quick repayment form inputs (ONLY IF UNPAID) */}
                    {lending.status === "pending" ? (
                      <div className="bg-white rounded-xl border border-gray-150 p-3.5 flex flex-col gap-2.5">
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                          Log Part-Payment repays
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder={`Amount (${currencySymbol})`}
                            value={repayAmount}
                            onChange={(e) => setRepayAmount(e.target.value)}
                            className="bg-gray-50 rounded-lg p-2 text-xs border border-gray-200 text-center font-mono focus:bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Remarks (e.g. cash repaid)"
                            value={repayNotes}
                            onChange={(e) => setRepayNotes(e.target.value)}
                            className="bg-gray-50 rounded-lg p-2 text-xs border border-gray-200 col-span-2 focus:bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddRepay(lending.id)}
                          className="w-full text-center text-white font-semibold font-sans py-2 rounded-xl text-xs bg-green-700 hover:bg-green-800 transition cursor-pointer select-none"
                          style={{ backgroundColor: brandColor }}
                        >
                          Credit repayment value
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50/60 text-green-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-green-100">
                        <Check className="w-4 h-4 text-green-700" />
                        <span className="font-semibold">Settle complete! Ledger entry is fully cleared.</span>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => onDeleteLending(lending.id)}
                        className="text-xs text-red-600 bg-transparent border-0 hover:underline cursor-pointer flex items-center gap-1 select-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete ledger entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredLendings.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
              Empty balance sheet. Record cash borrowings or product invoices by clicking Log Debt flag.
            </div>
          )}
        </div>
      </div>

      {/* NEW DEBT ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-green-900 px-5 py-4 text-white flex justify-between items-center" style={{ backgroundColor: brandColor }}>
              <span className="text-sm font-semibold font-sans">Establish Outstanding Kathabook Debt</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white opacity-70 hover:opacity-100 border-0 bg-transparent text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitLending} className="p-5 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Debtor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raju, Samar, etc."
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Lent Amount *</label>
                  <input
                    type="number"
                    required
                    placeholder="250.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as LendingType)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-2 py-2 focus:outline-none h-[38px]"
                  >
                    <option value="cash">💵 Cash Loan</option>
                    <option value="product_bill">🧾 Bill Debt</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Reason Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Shared room washing repair bill contributions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full text-center text-white py-2.5 rounded-xl font-semibold font-sans text-xs select-none cursor-pointer hover:opacity-90 transition mt-2"
                style={{ backgroundColor: brandColor }}
              >
                Incorporate Book Debt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
