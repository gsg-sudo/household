import React, { useState } from "react";
import { Sparkles, ArrowRight, CornerDownRight, Check, AlertCircle, RefreshCw } from "lucide-react";

interface AssistantControlProps {
  onParsedApply: (parsed: {
    detectedType: string;
    explanation: string;
    data: any;
  }) => void;
  osStyle: "ios" | "android";
}

export default function AssistantControl({ onParsedApply, osStyle }: AssistantControlProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [applied, setApplied] = useState(false);

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setParsedResult(null);
    setApplied(false);

    try {
      const response = await fetch("/api/parse-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          currentDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with parsing server");
      }

      const result = await response.json();
      setParsedResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during NLP structuring.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyParsed = () => {
    if (!parsedResult) return;
    onParsedApply(parsedResult);
    setApplied(true);
    setInputText("");
    setTimeout(() => {
      setApplied(false);
      setParsedResult(null);
    }, 3000);
  };

  const samplePrompts = [
    { text: "Lent 500 to Raju today for groceries", label: "Loan" },
    { text: "Spent 45 on Travel on my Summer Hawaii Trip", label: "Trip Expense" },
    { text: "need to buy sourdough bread and 3 count apples", label: "Shopping" },
    { text: "Remind me to call Raju about debt at 6pm tomorrow", label: "Reminder" },
  ];

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-sans font-semibold text-gray-950 text-base">Gemini NLP Assistant</h2>
          <p className="text-xs text-gray-500 font-sans">Talk to your ledger in natural human speech</p>
        </div>
      </div>

      <form onSubmit={handleParse} className="flex flex-col gap-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. 'I lent 500 to Raju today for food' or 'Buy 3 packs of eggs'..."
          className="w-full min-h-[90px] p-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-700 transition"
        />

        <div className="flex gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputText(p.text)}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition font-sans"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 text-white font-sans text-xs font-semibold rounded-xl select-none cursor-pointer transition shadow-xs shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                Parse <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 items-start text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-sans">{error}</p>
        </div>
      )}

      {parsedResult && (
        <div className="p-4 bg-green-50/40 border border-green-100/80 rounded-xl flex flex-col gap-3">
          <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-green-100">
            <span className="text-[11px] font-mono uppercase tracking-wider text-green-800 font-bold">
              Detected: {parsedResult.detectedType}
            </span>
            <span className="text-xs text-gray-400 font-sans">Confidence High</span>
          </div>

          <p className="text-xs text-gray-700 font-sans italic leading-relaxed">
            "{parsedResult.explanation}"
          </p>

          <div className="mt-1 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 text-xs text-gray-600 font-mono">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 flex items-center gap-1">
              <CornerDownRight className="w-3.5 h-3.5" /> Structured Schema Content
            </div>
            {Object.entries(parsedResult.data || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between py-0.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 font-semibold">{key}:</span>
                <span className="text-gray-900 truncate max-w-[160px]">{JSON.stringify(val)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={applyParsed}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold rounded-xl select-none cursor-pointer transition shadow-xs"
            disabled={applied}
          >
            {applied ? (
              <>
                <Check className="w-4 h-4" /> Applied to Database!
              </>
            ) : (
              <>
                Apply to {parsedResult.detectedType === "lending" ? "Kathabook" : 
                         parsedResult.detectedType === "transaction" ? "Finance Book" :
                         parsedResult.detectedType === "item" ? "Pantry & Lists" :
                         parsedResult.detectedType === "reminder" ? "Alarms" : "Database"}
              </>
            )}
          </button>
        </div>
      )}

      {applied && !parsedResult && (
        <div className="p-3 bg-green-50/60 border border-green-100 text-green-800 text-xs font-sans rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-green-700" />
          <span>Real-time local state synchronized! Mock database successfully appended.</span>
        </div>
      )}
    </div>
  );
}
