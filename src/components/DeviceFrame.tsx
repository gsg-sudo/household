import React, { useState, useEffect } from "react";
import { 
  Menu, Wifi, Battery, Signal, Home, Wallet, CheckSquare, Bell, Coins, Laptop, 
  Smartphone, Palette, Shield, Share2, LogOut, Copy, Check, Users, X
} from "lucide-react";
import { CURRENCIES } from "../types";

interface DeviceFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  osStyle: "ios" | "android";
  setOsStyle: (style: "ios" | "android") => void;
  headerTitle: string;
  cartStateActive: boolean;
  onCartStateToggle: (val: boolean) => void;
  lendingsCount: number;
  remindersCount: number;
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
  onParsedApply?: (parsed: {
    detectedType: string;
    explanation: string;
    data: any;
  }) => void;
}

export default function DeviceFrame({
  children,
  activeTab,
  setActiveTab,
  osStyle,
  setOsStyle,
  headerTitle,
  cartStateActive,
  onCartStateToggle,
  lendingsCount,
  remindersCount,
  currencyCode,
  onCurrencyChange,
  onParsedApply,
}: DeviceFrameProps) {
  const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const [currentTime, setCurrentTime] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSubView, setDrawerSubView] = useState<"main" | "share" | "leave" | "signedOut">("main");
  const [householdCode, setHouseholdCode] = useState("GSG36FAM");
  const [copied, setCopied] = useState(false);
  const [newCodeInput, setNewCodeInput] = useState("");

  // Live Simulated clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minStr = minutes < 10 ? "0" + minutes : minutes;
      setCurrentTime(`${hours}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "finance", label: "Finance", icon: Wallet },
    { id: "todos", label: "Todos", icon: CheckSquare },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "kathabook", label: "Kathabook", icon: Coins },
  ];

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full sm:h-auto">
      {/* Visual OS Controller top utility toolbar */}
      <div className="hidden sm:flex items-center gap-3.5 bg-gray-100 p-2 rounded-2xl w-full max-w-sm justify-between border border-gray-200 shadow-2xs">
        <span className="text-[11px] font-mono font-bold text-gray-500 uppercase flex items-center gap-1 pl-2">
          <Palette className="w-3.5 h-3.5" /> Virtual Core Preview
        </span>
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-150">
          <button
            onClick={() => { setOsStyle("ios"); setDrawerOpen(false); }}
            className={`px-3 py-1 text-[10px] font-sans font-bold rounded-lg transition flex items-center gap-1 cursor-pointer select-none ${
              osStyle === "ios" ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
            style={osStyle === "ios" ? { backgroundColor: brandColor } : {}}
          >
             iOS Style
          </button>
          <button
            onClick={() => { setOsStyle("android"); setDrawerOpen(false); }}
            className={`px-3 py-1 text-[10px] font-sans font-bold rounded-lg transition flex items-center gap-1 cursor-pointer select-none ${
              osStyle === "android" ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
            style={osStyle === "android" ? { backgroundColor: brandColor } : {}}
          >
            🤖 Material MD3
          </button>
        </div>
      </div>

      {/* Main Physical Phone mockup envelope casing */}
      <div className="relative w-full max-w-none sm:max-w-sm h-screen sm:h-[680px] bg-white rounded-none sm:rounded-[44px] shadow-none sm:shadow-2xl border-0 sm:border-[12px] border-gray-950 overflow-hidden flex flex-col group.pwa select-none">
        {/* Dynamic Notch / Island depending on OS */}
        {osStyle === "ios" ? (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-[22px] bg-black rounded-full z-40 items-center justify-center">
            {/* Speaker hole / camera sensor dots */}
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 absolute right-4" />
            <div className="w-10 h-1 rounded-full bg-neutral-800 absolute left-4" />
          </div>
        ) : (
          <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-black rounded-full z-40 items-center justify-center">
            {/* Punch hole camera sensor dots */}
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
          </div>
        )}

        {/* Dynamic System Status Bar */}
        <div className="hidden sm:flex bg-white px-6 pt-3 h-10 justify-between items-center z-30 relative select-none text-gray-900 text-xs font-sans">
          <span className="font-semibold font-sans tabular-nums text-[10px]">{currentTime}</span>
          <div className="flex items-center gap-1 text-gray-700 shrink-0 select-none">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* INTERACTIVE TOP APP HEADER BAR */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between z-20 relative select-none shrink-0 h-12">
          {activeTab === "todos" && cartStateActive ? (
            /* Handles nested custom back action bar for Todos shopping cart */
            <button
              onClick={() => onCartStateToggle(false)}
              className="text-xs font-semibold text-green-700 bg-transparent border-0 flex items-center gap-0.5 cursor-pointer"
            >
              &lt; Back to Pantry
            </button>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-gray-900 hover:bg-gray-100 p-1.5 rounded-xl border-0 bg-transparent cursor-pointer transition shrink-0"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          )}

          <div className="absolute left-1/2 -translate-x-1/2 font-sans font-bold text-gray-950 text-xs shrink-0 select-none text-center">
            {activeTab === "todos" && cartStateActive ? "Shopping Cart Checklist" : headerTitle}
          </div>

          <button
            onClick={() => {
              setDrawerOpen(true);
              setDrawerSubView("main");
            }}
            className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-700 uppercase cursor-pointer hover:bg-green-100 transition border-0 outline-none select-none"
          >
            SG
          </button>
        </div>

        {/* MAIN VISUAL LAYOUT CONTENT BODY (ROUTED SUB-PAGES) */}
        <div className="flex-1 overflow-hidden relative bg-gray-50 bg-[#F9FAFB]">
          {children}

          {/* BACKGROUND DRAWER SLIDE-OUT PANEL */}
          {drawerOpen && (
            <div className="absolute inset-0 bg-black/45 backdrop-blur-3xs z-30 animate-in fade-in transition duration-200">
              <div className="w-[85%] max-w-[320px] bg-white h-full p-5 overflow-y-auto flex flex-col gap-5 animate-in slide-in-from-left duration-200 scrollbar-none">
                
                {/* Header of Drawer */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider">
                    Family Workspace Hub
                  </span>
                  <button 
                    onClick={() => {
                      setDrawerOpen(false);
                      setDrawerSubView("main");
                    }}
                    className="text-gray-400 hover:text-gray-900 border-0 bg-transparent text-sm cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Sub View 1: Main View of Drawer */}
                {drawerSubView === "main" && (
                  <div className="flex flex-col gap-5">
                    
                    {/* User profile details header card */}
                    <div className="flex gap-3">
                      <div className="relative shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                          alt="Sathish Gajarla" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-3xs"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans font-bold text-gray-950 text-sm truncate">Sathish Gajarla</span>
                          <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1 py-0.5 rounded-sm shrink-0">
                            SG
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 truncate mt-0.5">sathishgajarla@gmail.com</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                          👥 GROUP: <span className="font-mono text-gray-950 font-extrabold bg-gray-100 px-1 py-0.5 rounded-sm">{householdCode}</span>
                        </span>
                      </div>
                    </div>

                    {/* Status row/badge */}
                    <div className="bg-gray-50 border border-gray-100 py-2.5 px-3.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-700" />
                        <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider font-bold">
                          Status
                        </span>
                      </div>
                      <div className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wider">
                        FREE
                      </div>
                    </div>

                    {/* Currency selection option */}
                    <div className="bg-gray-50 border border-gray-100 py-3 px-3.5 rounded-xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-green-700" />
                          <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider font-bold">
                            Currency
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-green-50 text-green-800 px-2 py-0.5 rounded font-extrabold">
                          {selectedCurrency.symbol} {selectedCurrency.code}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {CURRENCIES.map((cur) => (
                          <button
                            key={cur.code}
                            type="button"
                            onClick={() => onCurrencyChange(cur.code)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold font-sans transition flex items-center justify-between border cursor-pointer select-none ${
                              currencyCode === cur.code
                                ? "bg-green-700 text-white border-green-700 shadow-3xs"
                                : "bg-white text-gray-600 border-gray-150 hover:bg-gray-100"
                            }`}
                          >
                            <span>{cur.code}</span>
                            <span className={currencyCode === cur.code ? "text-green-200" : "text-gray-400 font-mono"}>
                              {cur.symbol}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* List of active sync controls */}
                    <div className="flex flex-col gap-1 pt-1">
                      
                      {/* Option 1: Share & Sync */}
                      <button 
                        onClick={() => setDrawerSubView("share")}
                        className="flex items-center gap-3 text-left border-0 bg-transparent hover:bg-gray-50 p-2 -mx-2 rounded-xl transition cursor-pointer w-full group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-950">Share & Sync</h4>
                          <p className="text-[10px] text-gray-400">Invite family or switch groups</p>
                        </div>
                      </button>

                      {/* Option 2: Leave Household */}
                      <button 
                        onClick={() => setDrawerSubView("leave")}
                        className="flex items-center gap-3 text-left border-0 bg-transparent hover:bg-gray-50 p-2 -mx-2 rounded-xl transition cursor-pointer w-full group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-950">Leave Household</h4>
                          <p className="text-[10px] text-gray-400">Exit the current shared list</p>
                        </div>
                      </button>

                    </div>

                    {/* Sign out red button */}
                    <button 
                      onClick={() => setDrawerSubView("signedOut")}
                      className="border border-red-150 rounded-xl py-2.5 flex justify-center items-center gap-1.5 text-red-600 font-bold hover:bg-red-50/50 transition cursor-pointer bg-white text-xs"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      Sign Out
                    </button>

                    {/* Meta build tag */}
                    <div className="text-center pt-2">
                      <span className="text-[9px] font-mono tracking-widest text-gray-400 font-semibold block uppercase">
                        Household V1.0.5
                      </span>
                    </div>

                  </div>
                )}

                {/* Sub View 2: Share and Sync info & join */}
                {drawerSubView === "share" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                      <h3 className="text-xs font-bold text-gray-950">Share & Sync</h3>
                      <button 
                        onClick={() => setDrawerSubView("main")}
                        className="text-[10px] uppercase font-bold text-green-700 bg-transparent border-0 cursor-pointer"
                      >
                        ← Back
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-550 leading-relaxed">
                      Household data is automatically synchronized across devices using the same unique family group sync code.
                    </p>

                    <div className="bg-gray-50 p-3.5 rounded-xl flex flex-col gap-2.5 border border-gray-150">
                      <span className="text-[9px] uppercase font-mono text-gray-400 font-bold tracking-wider">
                        Family Sync Code
                      </span>
                      
                      <div className="flex items-center justify-between gap-2.5 bg-white p-2 rounded-lg border border-gray-200">
                        <span className="font-mono font-extrabold text-[#2E7D32] text-sm tracking-widest pl-1">
                          {householdCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(householdCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="bg-green-700 hover:bg-green-800 text-white text-[9px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition select-none border-0 shrink-0"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newCodeInput.trim().length >= 4) {
                          setHouseholdCode(newCodeInput.trim().toUpperCase());
                          setNewCodeInput("");
                          setDrawerSubView("main");
                        }
                      }} 
                      className="flex flex-col gap-2.5 border-t border-gray-100 pt-3"
                    >
                      <h4 className="text-xs font-bold text-gray-950 font-sans">Join Household</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">Enter sync code provided by a family member to import data books.</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newCodeInput}
                          onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                          placeholder="E.G. GSG36FAM"
                          maxLength={12}
                          className="flex-1 bg-gray-50 text-xs border border-gray-150 rounded-lg px-2 py-1.5 outline-none focus:border-green-700 font-mono"
                        />
                        <button
                          type="submit"
                          disabled={!newCodeInput.trim()}
                          className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-0"
                        >
                          Join
                        </button>
                      </div>
                    </form>

                    <div className="p-3 bg-green-50/50 rounded-xl border border-green-100 flex items-start gap-2 pt-1">
                      <Users className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-bold text-green-800 uppercase font-mono block">Household Members</span>
                        <span className="text-[10px] text-gray-600 block mt-1">
                          1. Sathish Gajarla (Admin) <span className="text-[8px] text-emerald-600 block font-semibold">● Active Now</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub View 3: Leave Household view */}
                {drawerSubView === "leave" && (
                  <div className="flex flex-col gap-4 text-center py-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                      <LogOut className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-950">Leave {householdCode}?</h3>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Revert device registry to a private offline ledger. Shared family notes will be detached.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newCode = "SOLO_" + Math.random().toString(36).substr(2, 6).toUpperCase();
                          setHouseholdCode(newCode);
                          setDrawerSubView("main");
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-xs cursor-pointer border-0 w-full transition"
                      >
                        Exit Shared Sync
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerSubView("main")}
                        className="bg-transparent hover:bg-gray-100 border-0 text-gray-500 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition w-full"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub View 4: Signed Out view */}
                {drawerSubView === "signedOut" && (
                  <div className="flex flex-col gap-4 text-center py-2">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto">
                      <Shield className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-900">Signed Out</h3>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Currently running in local sandbox. Sync with family cloud storage to see updates.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setDrawerSubView("main")}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-3 rounded-lg text-xs cursor-pointer border-0 w-full transition"
                      >
                        Sign in (Google)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerSubView("main")}
                        className="bg-transparent hover:bg-gray-100 border-0 text-gray-400 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition w-full"
                      >
                        Use Sandbox
                      </button>
                    </div>
                  </div>
                )}

                {/* Drawer base signature */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="text-[9px] text-gray-400 font-sans leading-normal">
                    Active theme: **Forest Green `#2E7D32`**, respecting MD3 Guidelines & Inter typeface.
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* SYSTEM BOTTOM NAVIGATION GRID */}
        <div className="bg-white border-t border-gray-100 px-3.5 pb-5 pt-2 flex justify-between items-center z-20 relative shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setDrawerOpen(false);
                }}
                className="flex flex-col items-center justify-center flex-1 cursor-pointer select-none bg-transparent border-0 transition relative py-1"
              >
                {/* Visual styling variation per OS layout */}
                {osStyle === "android" ? (
                  // Material Design 3 Pill background indicator style
                  <div className="flex flex-col items-center gap-1 w-full">
                    <div
                      className={`px-4.5 py-1.5 rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-100/50"
                      }`}
                      style={isSelected ? { backgroundColor: brandColor } : {}}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span
                      className={`text-[9px] font-sans transition-all font-medium ${
                        isSelected ? "text-green-800 font-bold" : "text-gray-400"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                ) : (
                  // iOS minimalist HIG style
                  <div className="flex flex-col items-center gap-1.5">
                    <Icon
                      className={`w-[21px] h-[21px] transition-all ${
                        isSelected ? "text-green-700" : "text-gray-400"
                      }`}
                      style={isSelected ? { color: brandColor } : {}}
                    />
                    <span
                      className={`text-[9px] font-sans font-medium transition-all ${
                        isSelected ? "text-green-700 font-bold" : "text-gray-400"
                      }`}
                      style={isSelected ? { color: brandColor } : {}}
                    >
                      {tab.label}
                    </span>
                  </div>
                )}

                {/* Small indicator badges for lists (reminders & lendings count) */}
                {tab.id === "reminders" && remindersCount > 0 && (
                  <span className="absolute top-1 right-2.5 bg-red-600 text-white rounded-full text-[8px] w-3.5 h-3.5 font-bold flex items-center justify-center border border-white">
                    {remindersCount}
                  </span>
                )}
                {tab.id === "kathabook" && lendingsCount > 0 && (
                  <span className="absolute top-1 right-2.5 bg-orange-600 text-white rounded-full text-[8px] w-3.5 h-3.5 font-bold flex items-center justify-center border border-white">
                    {lendingsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Physical Home slide indicators */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-40 select-none pb-0" />
      </div>
    </div>
  );
}
