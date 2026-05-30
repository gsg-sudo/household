import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Smart parsing of user speech/input
  app.post("/api/parse-input", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, currentDate } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt text" });
        return;
      }

      const promptText = `
User Input: "${text}"
Current Date Context: "${currentDate || new Date().toISOString()}"

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
            type: Type.OBJECT,
            properties: {
              detectedType: {
                type: Type.STRING,
                description: "Must be one of 'lending', 'transaction', 'item', 'reminder', or 'unknown'."
              },
              explanation: {
                type: Type.STRING,
                description: "A short human explanation of what was parsed."
              },
              data: {
                type: Type.OBJECT,
                description: "Parsed details corresponding to the detected type.",
                properties: {
                  // fields for lending
                  personName: { type: Type.STRING, description: "Name of the person lent to or borrowed from. For example: 'Raju'." },
                  amount: { type: Type.NUMBER, description: "Numeric amount of currency." },
                  type: { type: Type.STRING, description: "Must be 'cash' or 'product_bill'. Default to 'cash'." },
                  notes: { type: Type.STRING, description: "Notes of the lending or transaction (e.g., 'for food', 'shampoo debt')." },
                  dueDate: { type: Type.STRING, description: "Due date in YYYY-MM-DD format if mentioned, otherwise leave empty." },
                  
                  // fields for transaction
                  category: { type: Type.STRING, description: "Category of expense/income: Rent, Grocery, Bills, Entertainment, Shopping, Travel, Medical, Debt, Education, or Other." },
                  date: { type: Type.STRING, description: "Date of transaction in YYYY-MM-DD format (default to current date if not specified)." },
                  
                  // fields for item (Pantry/Shopping)
                  name: { type: Type.STRING, description: "Item description, e.g., 'apples', 'toilet paper'." },
                  itemCategory: { type: Type.STRING, description: "Preset item category: Produce, Dairy, Bakery, Household, Meat, Snacks, or Other." },
                  quantity: { type: Type.NUMBER, description: "Items count (integer), default to 1 if not specified." },
                  unit: { type: Type.STRING, description: "Measurement unit, e.g., 'kg', 'pcs', 'liters', or default to 'pcs'." },
                  isNeeded: { type: Type.BOOLEAN, description: "True if user mentions they need to buy it or shopping cart; false if they are just describing what they have in stock." },
                  
                  // fields for reminder
                  text: { type: Type.STRING, description: "Reminder content label." },
                  dateTime: { type: Type.STRING, description: "Formatted ISO 8601 time string representing the scheduled alarm/due date, or relative time from the current date." }
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

    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ 
        error: "Failed to parse natural language statement", 
        details: error?.message || String(error)
      });
    }
  });

  // Serve static UI assets
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing successfully on http://localhost:${PORT}`);
  });
}

startServer();
