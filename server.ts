import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse incoming JSON requests
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Chat will use rich simulated responses.");
}

// ------------------- API ROUTES -------------------

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Colonel AI Assistant Chat Endpoint using gemini-3.5-flash
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, budget, groupSize } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array provided." });
    }

    const systemInstruction = 
      "You are Captain Colonel, the charming, witty, and helpful AI ordering assistant for KFC Ghana. " +
      "You help customers choose the best meals, recommend spicy local options like Jollof Buckets or Crispy Yam Fries, " +
      "create custom orders based on their budget in Ghanaian Cedis (GH₵), and answer questions about calories or ingredients. " +
      "Be warm, exciting, extremely polite, and inject a touch of Ghanaian hospitality (terms like 'Akwaaba', 'Chale', 'Medaase' are welcome, but use them tastefully!). " +
      "Keep responses concise (max 3 short paragraphs), delicious, and prioritize upselling. " +
      "KFC Ghana Meal Guide:\n" +
      "- Streetwise 1 with Jollof: GH₵ 45 (1 pc chicken + Jollof + shito) [BEST SELLER]\n" +
      "- Streetwise Jollof Giant Feaster: GH₵ 85 (2 pcs chicken + double Jollof + coleslaw + soda)\n" +
      "- KFC Ghana Jollof Bucket Feast: GH₵ 210 (6 pcs chicken + 3x Jollof bowls + fries + 1.5L drink) [FAMILY CHOICE]\n" +
      "- Streetwise 2 Classic: GH₵ 60 (2 pcs chicken + fries + shito)\n" +
      "- 6 Hot Spicy Wings Combo: GH₵ 75\n" +
      "- 10-Piece Golden Bucket: GH₵ 180 (bucket of chicken only)\n" +
      "- Zinger Burger Classic: GH₵ 68\n" +
      "- Zinger Tower Mighty Combo: GH₵ 98\n" +
      "- Ghanaian Golden Yam Fries: GH₵ 28 [LOCAL FAVORITE]\n" +
      "- Coca Cola: GH₵ 15\n" +
      "- Strawberry Krusher: GH₵ 36\n\n" +
      "Ensure all menu-referencing response items display their real prices. Offer the user options on how they would like to navigate or order.";

    let userPrompt = "";
    if (budget) {
      userPrompt += `[System Note: User has a budget of GH₵ ${budget}. Recommend a meal arrangement for ${groupSize || 1} person(s).]\n`;
    }
    
    // Structure chat contents
    const lastMessage = messages[messages.length - 1];
    userPrompt += lastMessage?.content || "Hello!";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        });
        
        return res.json({
          reply: response.text || "Medaase! That sounds amazing. What else can I add to your bucket today?"
        });
      } catch (geminiError: any) {
        console.error("Gemini API call failed:", geminiError);
        return res.json({
          reply: `Chale! I had a slight connection hitch, but I highly recommend our **Streetwise Jollof Giant Feaster** (GH₵ 85) or **Ghanaian Golden Yam Fries** (GH₵ 28)! How many of those should we put in your bucket?`,
          simulated: true
        });
      }
    } else {
      // High-quality fallback simulation with rich Ghanaian context
      const textLower = userPrompt.toLowerCase();
      let responseText = "Akwaaba! I am Captain Colonel, your KFC Ghana guide. We have hot, spicy chicken buckets, Zinger Burgers (GH₵ 68), and our legendary local Jollof combos (Streetwise Jollof Giant is GH₵ 85). What are we craving today?";
      
      if (textLower.includes("jollof") || textLower.includes("local")) {
        responseText = "Chale! The Streetwise Jollof combos are phenomenal. You can get our **Streetwise Jollof Giant Feaster** for just GH₵ 85 (comes with 2 crispy chicken pieces, double Jollof, slaw, and ice-cold soda) or the **Ghana Jollof Bucket Feast** for GH₵ 210, perfect for family sharing! Shall I add one of these to your basket?";
      } else if (textLower.includes("yam") || textLower.includes("side") || textLower.includes("fry")) {
        responseText = "You have elite taste! Our **Ghanaian Golden Yam Fries** (GH₵ 28) are fried to perfection and seasoned with bird-eye chili salt. They pair beautifully with our **6 Hot Spicy Wings** (GH₵ 75)! Would you like to add these locally grown golden beauties?";
      } else if (textLower.includes("budget") || textLower.includes("money") || budget) {
        const cashValue = Number(budget) || 100;
        if (cashValue < 50) {
          responseText = `With GH₵ ${cashValue}, you can grab a delicious **Streetwise 1 with Jollof** (GH₵ 45) or our classic **Ghanaian Golden Yam Fries** (GH₵ 28) with a side of shito! A perfect, satisfying bite for your pocket.`;
        } else if (cashValue < 100) {
          responseText = `With GH₵ ${cashValue}, you have plenty of options! I highly recommend the deluxe **Streetwise Jollof Giant Feaster** (GH₵ 85), or get a **Zinger Burger Classic** (GH₵ 68) with side **Yam Fries** (GH₵ 28) for GH₵ 96! Delicious and loaded.`;
        } else {
          responseText = `With GH₵ ${cashValue}, we can feast! Grab our signature **6 Hot Spicy Wings Combo** (GH₵ 75) + **Oreo Krusher** (GH₵ 35) or get the premium **Zinger Tower Mighty Combo** (GH₵ 98). Chale, we can also add a side of Coleslaw (GH₵ 18) to seal the deal!`;
        }
      } else if (textLower.includes("chicken") || textLower.includes("bucket")) {
        responseText = "Nothing beats the crunch! Chale, our **10-Piece Golden Buckets** are only GH₵ 180, cooked fresh in pure sunflower oil. Or grab the **Streetwise 2 Classic** (GH₵ 60) for a solo crunch session. Do you prefer original recipe or Hot & Crispy?";
      } else if (textLower.includes("burger") || textLower.includes("zinger")) {
        responseText = "A spicy classic! The **Zinger Burger** is GH₵ 68, or go absolute beast-mode with our **Zinger Tower Mighty Combo** at GH₵ 98. We can add a creamy Strawberry Krusher (GH₵ 36) to balance the hot spices!";
      }

      return res.json({ reply: responseText, simulated: true });
    }
  } catch (err: any) {
    console.error("General API Error:", err);
    res.status(500).json({ error: "Something went wrong on Captain Colonel's server." });
  }
});

// ------------------- VITE SETUP -------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KFC Ghana Server listening at http://0.0.0.0:${PORT}`);
  });
}

start();
