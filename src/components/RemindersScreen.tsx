import React, { useState } from "react";
import { Bell, Calendar, Trash2, Plus, Clock, CheckSquare, Square, CheckCircle2, Circle } from "lucide-react";
import { Reminder } from "../types";

interface RemindersScreenProps {
  reminders: Reminder[];
  onAddReminder: (rem: Omit<Reminder, "id" | "isCompleted" | "createdBy">) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  osStyle: "ios" | "android";
}

export default function RemindersScreen({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  osStyle,
}: RemindersScreenProps) {
  const [filter, setFilter] = useState<"pending" | "completed">("pending");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Form state
  const [remText, setRemText] = useState("");
  const [remDate, setRemDate] = useState("");
  const [remTime, setRemTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remText.trim()) return;

    // Combine date + time
    const finalDateStr = remDate || new Date().toISOString().split("T")[0];
    const finalTimeStr = remTime || "12:00";
    const combinedIso = `${finalDateStr}T${finalTimeStr}:00.000Z`;

    onAddReminder({
      text: remText,
      dateTime: combinedIso,
    });

    setRemText("");
    setRemDate("");
    setRemTime("");
    setShowAddModal(false);
  };

  const filteredReminders = reminders.filter((rem) =>
    filter === "completed" ? rem.isCompleted : !rem.isCompleted
  );

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] overflow-y-auto max-h-full">
      {/* Tab Filter Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shrink-0 flex flex-col gap-3">
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter("pending")}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              filter === "pending" ? "bg-white text-gray-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Pending Alarm ({reminders.filter((r) => !r.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              filter === "completed" ? "bg-white text-gray-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Completed logs ({reminders.filter((r) => r.isCompleted).length})
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-col gap-4 p-4">
        {/* Statistics or visual motivation card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-semibold">
              Background Notifier
            </span>
            <span className="text-xs text-gray-500 font-sans mt-1">
              Active system alerts and local push schedule
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer select-none transition shadow-xs"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="w-4 h-4" /> New Alert
          </button>
        </div>

        {/* Reminders List board */}
        <div className="flex flex-col gap-2.5">
          {filteredReminders.map((rem) => {
            const dateObj = new Date(rem.dateTime);
            const formattedDateStr = isNaN(dateObj.getTime())
              ? rem.dateTime
              : dateObj.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

            return (
              <div
                key={rem.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-gray-150 transition group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className="border-0 bg-transparent text-gray-400 hover:text-green-700 cursor-pointer p-0.5 transition shrink-0"
                  >
                    {rem.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-700 fill-green-100 rounded-full" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-sans font-semibold text-gray-950 truncate max-w-[170px] ${
                        rem.isCompleted ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {rem.text}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-gray-300" />
                      {formattedDateStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rem.isCompleted && (
                    <span className="text-[9px] font-mono text-green-700 bg-green-55 bg-green-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Done
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="text-gray-300 hover:text-red-500 border-0 bg-transparent p-1 cursor-pointer transition select-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredReminders.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
              Nothing to displays inside this filter section.
            </div>
          )}
        </div>
      </div>

      {/* FORM MODAL: Add Reminder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div
              className="bg-green-900 px-5 py-4 text-white flex justify-between items-center"
              style={{ backgroundColor: brandColor }}
            >
              <span className="text-sm font-semibold font-sans">Initialize Active Alarm Notifier</span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white opacity-70 hover:opacity-100 border-0 bg-transparent text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">What to remind you? *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Settle water bill dues, buy medicine..."
                  value={remText}
                  onChange={(e) => setRemText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Alarm Date</label>
                  <input
                    type="date"
                    value={remDate}
                    onChange={(e) => setRemDate(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Alarm Time</label>
                  <input
                    type="time"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-xl text-[10px] text-green-800 leading-relaxed font-sans">
                💡 **Haptic Feedbacks Background Engine Active**: In iOS or Android, this automatically registers a native Push Notification which triggers even when the app is offline or closed in the container!
              </div>

              <button
                type="submit"
                className="w-full text-center text-white py-2.5 rounded-xl font-semibold font-sans text-xs select-none cursor-pointer hover:opacity-90 transition mt-1"
                style={{ backgroundColor: brandColor }}
              >
                Configure Alert Alarm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
