import { ArrowUpRight, ArrowDownRight, Activity, Calendar, ShoppingBag, Plus, Sparkles, Coins } from "lucide-react";
import { Lending, Transaction, PantryItem, Reminder } from "../types";

interface DashboardScreenProps {
  lendings: Lending[];
  transactions: Transaction[];
  pantryItems: PantryItem[];
  reminders: Reminder[];
  onNavigate: (tabId: string) => void;
  onOpenQuickAdd: (type: "expense" | "debt" | "reminder") => void;
  osStyle: "ios" | "android";
  currencySymbol?: string;
}

export default function DashboardScreen({
  lendings,
  transactions,
  pantryItems,
  reminders,
  onNavigate,
  onOpenQuickAdd,
  osStyle,
  currencySymbol = "$",
}: DashboardScreenProps) {
  // Calculated outstanding to collect (unpaid lendings)
  const outstandingCollect = lendings
    .filter((l) => l.status === "pending")
    .reduce((sum, current) => {
      const repaidSum = current.repayments.reduce((acc, rep) => acc + rep.amount, 0);
      return sum + (current.amount - repaidSum);
    }, 0);

  // Active items to buy
  const itemsToBuyCount = pantryItems.filter((item) => item.isNeeded && !item.isBought).length;

  // Reminders due today
  const remindersDueToday = reminders.filter((rem) => {
    if (rem.isCompleted) return false;
    // Just mock due today or soon
    const dateStr = rem.dateTime.split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];
    return dateStr <= todayStr;
  }).length;

  // Recent transactions (sorted by date desc)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Recent pantry changes
  const recentlyNeeded = pantryItems
    .filter((item) => item.isNeeded)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="absolute inset-0 flex flex-col gap-5 p-4 overflow-y-auto">
      {/* Aggregated Health Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-800 to-green-950 text-white rounded-[24px] p-6 shadow-xs shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">
            Remaining to collect
          </span>
          <span className="text-3xl font-bold tracking-tight font-sans">
            {currencySymbol}{outstandingCollect.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-4 items-center mt-5 pt-4 border-t border-white/10 text-xs text-green-100">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-green-300" />
            <span><b>{itemsToBuyCount}</b> needed</span>
          </div>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-300" />
            <span><b>{remindersDueToday}</b> today</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="flex flex-col gap-2 shrink-0">
        <h3 className="text-xs font-mono uppercase text-gray-500 tracking-wider font-semibold ml-1">
          Quick-Add Shortcuts
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onOpenQuickAdd("expense")}
            className="flex flex-col items-center justify-center p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50/50 shadow-xs active:scale-[0.97] transition select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-gray-900 text-center">Add Expense</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd("debt")}
            className="flex flex-col items-center justify-center p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50/50 shadow-xs active:scale-[0.97] transition select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-gray-900 text-center">Lend Asset</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd("reminder")}
            className="flex flex-col items-center justify-center p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50/50 shadow-xs active:scale-[0.97] transition select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-gray-900 text-center">New Alert</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Log Lists */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-mono uppercase text-gray-500 tracking-wider font-semibold">
            Recent Activities
          </h3>
          <button
            onClick={() => onNavigate("finance")}
            className="text-[11px] font-sans text-green-700 hover:underline cursor-pointer"
          >
            All Ledger Logs →
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              onClick={() => onNavigate("finance")}
              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-gray-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                  <Activity className="w-4 h-4 text-green-700" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-sans font-semibold text-gray-950 truncate max-w-[170px]">
                    {t.notes || `Expense: ${t.category}`}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {t.category} • {t.date}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold font-mono text-gray-950 shrink-0">
                -{currencySymbol}{t.amount.toFixed(2)}
              </span>
            </div>
          ))}

          {recentlyNeeded.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate("todos")}
              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-gray-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-sans font-semibold text-gray-950 truncate max-w-[170px]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Category: {item.category} • Needed
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md shrink-0">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}

          {recentTransactions.length === 0 && recentlyNeeded.length === 0 && (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans">
              No recent entries. Use the form or conversational AI assistant to add ledger records instantly!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
