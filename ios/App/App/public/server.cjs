var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/parse-input", async (req, res) => {
    try {
      const { text, currentDate } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt text" });
        return;
      }
      const promptText = `
User Input: "${text}"
Current Date Context: "${currentDate || (/* @__PURE__ */ new Date()).toISOString()}"

Analyze the user input and determine if it represents:
1. Lending (e.g., lending money, debt, loan, lent, "I lent 500 to Raju for food")
2. Transaction (e.g., income or spending, buying something, personal expense, "Spent 20$ on movies", "Paid rent 1500")
3. Item (e.g., groceries, pantry additions, pantry count, items to buy or needed list, "We need 2kg apples", "add bread to pantry")
4. Reminder (e.g., alarm, checklist alert, schedule, reminder, "Remind me to pay electric bill tomorrow at 6pm")

Structure the representation perfectly as JSON matching the schema.
`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: "You are an expert NLP parser for a household bookkeeping and management app. Your job is to classify and parse free-form user speech/text into strict structured schemas.",
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              detectedType: {
                type: import_genai.Type.STRING,
                description: "Must be one of 'lending', 'transaction', 'item', 'reminder', or 'unknown'."
              },
              explanation: {
                type: import_genai.Type.STRING,
                description: "A short human explanation of what was parsed."
              },
              data: {
                type: import_genai.Type.OBJECT,
                description: "Parsed details corresponding to the detected type.",
                properties: {
                  // fields for lending
                  personName: { type: import_genai.Type.STRING, description: "Name of the person lent to or borrowed from. For example: 'Raju'." },
                  amount: { type: import_genai.Type.NUMBER, description: "Numeric amount of currency." },
                  type: { type: import_genai.Type.STRING, description: "Must be 'cash' or 'product_bill'. Default to 'cash'." },
                  notes: { type: import_genai.Type.STRING, description: "Notes of the lending or transaction (e.g., 'for food', 'shampoo debt')." },
                  dueDate: { type: import_genai.Type.STRING, description: "Due date in YYYY-MM-DD format if mentioned, otherwise leave empty." },
                  // fields for transaction
                  category: { type: import_genai.Type.STRING, description: "Category of expense/income: Rent, Grocery, Bills, Entertainment, Shopping, Travel, Medical, Debt, Education, or Other." },
                  date: { type: import_genai.Type.STRING, description: "Date of transaction in YYYY-MM-DD format (default to current date if not specified)." },
                  // fields for item (Pantry/Shopping)
                  name: { type: import_genai.Type.STRING, description: "Item description, e.g., 'apples', 'toilet paper'." },
                  itemCategory: { type: import_genai.Type.STRING, description: "Preset item category: Produce, Dairy, Bakery, Household, Meat, Snacks, or Other." },
                  quantity: { type: import_genai.Type.NUMBER, description: "Items count (integer), default to 1 if not specified." },
                  unit: { type: import_genai.Type.STRING, description: "Measurement unit, e.g., 'kg', 'pcs', 'liters', or default to 'pcs'." },
                  isNeeded: { type: import_genai.Type.BOOLEAN, description: "True if user mentions they need to buy it or shopping cart; false if they are just describing what they have in stock." },
                  // fields for reminder
                  text: { type: import_genai.Type.STRING, description: "Reminder content label." },
                  dateTime: { type: import_genai.Type.STRING, description: "Formatted ISO 8601 time string representing the scheduled alarm/due date, or relative time from the current date." }
                }
              }
            },
            required: ["detectedType", "explanation"]
          }
        }
      });
      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({
        error: "Failed to parse natural language statement",
        details: error?.message || String(error)
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing successfully on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
