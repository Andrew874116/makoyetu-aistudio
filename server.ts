import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily or with a fallback
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY not found or is default placeholder. Using smart Kenyan real estate data simulations.");
}

// ----------------------------------------------------
// 🚀 SERVER API ENDPOINTS
// ----------------------------------------------------

// 1. Health & Configuration Check
app.get("/api/config", (req, res) => {
  res.json({
    appName: "Makao Yetu",
    hasApiKey: !!ai,
    message: ai ? "Real Gemini integration active" : "Demo simulated mode active"
  });
});

// 2. AI Property Consultant API
app.post("/api/gemini/consult", async (req, res) => {
  const { question, chatHistory = [] } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  // Construct context instructions for Kenyan real estate
  const systemInstruction = `You are "Makao Yetu AI Advisor", an elite real estate expert in Kenya.
Your job is to assist clients on renting, purchasing land, student hostels, and commercial structures in Kenya.
Knowledge depth includes:
- Major estates in Nairobi (Kileleshwa, Kilimani, Westlands, Roysambu, Kahawa West, Pipeline, South B, etc.) and other towns (Mombasa, Kisumu, Nakuru, Eldoret).
- Pricing norms, water and electricity reliability reports, common agency scams (e.g., viewing fee traps, fake landlords, double-booked deposits).
- Kenyan land purchase rules: Title deeds (Registry Index Maps, title search at Ardhi House, ArdhiSasa platform).
- Escrow deposits safety and tenant rights under the Landlord and Tenant Act.
Keep answers structured, highly conversational, and format them with markdown (bullet points, bold text).`;

  if (ai) {
    try {
      // Build a simple context prompt combining history
      let prompt = "";
      if (chatHistory.length > 0) {
        prompt += "Previous conversation:\n";
        chatHistory.slice(-5).forEach((msg: any) => {
          prompt += `${msg.sender === "user" ? "Client" : "Advisor"}: ${msg.text}\n`;
        });
        prompt += "\n";
      }
      prompt += `New Client Question: ${question}\nAdvisor:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });

      return res.json({ answer: response.text });
    } catch (err: any) {
      console.error("Gemini Consult Error:", err);
      return res.status(500).json({ error: "Gemini query failed. Fallback active.", details: err.message });
    }
  }

  // Fallback Simulation for Kenyan Property Consultant
  setTimeout(() => {
    let responseText = `### Makao Yetu AI Advisor (Demo Mode)

Thank you for your question about: **"${question}"**. Here is expert advice for the Kenyan housing market:

- **Scam Protection**: Be extremely cautious of agents demanding "viewing fees" before showing a property. Genuine agents in Kenya should only request payments after contract signing.
- **Water & Power**: Estates like Westlands, Kilimani, and Kileleshwa usually have borehole backups, whereas some areas like Syokimau might have saline borehole water. Always test tap water pressure.
- **Legal Compliance**: When buying land, ensure you conduct a title search on **ArdhiSasa** to avoid fake titles or double-ownership issues.
- **Escrow**: Using Makao Yetu's built-in simulated Escrow wallet is the safest way to secure your deposit until you have physically verified the keys and condition of the premises.

Would you like details on typical rent ranges in specific estates?`;
    res.json({ answer: responseText });
  }, 600);
});

// 3. AI Property Recommender API (Salary & Preferences)
app.post("/api/gemini/recommend", async (req, res) => {
  const { salary, dependents, workLocation, lifestyle } = req.body;
  
  const numSalary = Number(salary) || 50000;
  // Rule of thumb in Kenya: Housing shouldn't exceed 30% of income
  const maxRent = Math.floor(numSalary * 0.3);

  const systemInstruction = `You are the "Makao Yetu Financial & Relocation Planner".
You recommend Kenyan housing options (specific estates, sizes, commute patterns) based on their salary, dependents, and work location.
Suggest 3 specific neighborhoods that fit their budget.
Be encouraging and outline budgeting suggestions for M-Pesa, groceries, and transport (matatus or driving).`;

  const prompt = `Salary: Ksh ${numSalary} per month
Dependents: ${dependents || "None"}
Work/Target Location: ${workLocation || "Nairobi CBD"}
Lifestyle focus: ${lifestyle || "Moderate / Budget conscious"}
Recommend 3 distinct Kenyan estates that match this budget (Housing budget: Ksh ${maxRent}/month max). For each, specify property type (bedsitter, 1-bedroom, 2-bedroom), average rent, commute advice, and lifestyle safety.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      return res.json({ recommendations: response.text, housingBudget: maxRent });
    } catch (err) {
      console.error("Gemini Recommender Error:", err);
    }
  }

  // Fallback Recommendations
  setTimeout(() => {
    let recommendations = `### 🏡 Personalized Relocation Plan (Ksh ${numSalary} Salary)

Based on your monthly salary of **Ksh ${numSalary.toLocaleString()}**, your safe maximum housing rent is **Ksh ${maxRent.toLocaleString()}** (30% rule). 

Here are the top 3 neighborhoods in Kenya suited for your lifestyle and target of **${workLocation || "Nairobi CBD"}**:

1. **Roysambu / Zimmerman (Thika Road)**
   - **Type**: Spacious Bedsitter or standard 1-Bedroom (Ksh 10,000 - 15,000)
   - **Comm commute**: Fast commute via Superhighway Matatus (Ksh 80-100 to CBD)
   - **Vibe**: Energetic, high water security due to borehole supply, lots of supermarket hubs (TRM mall).

2. **Utawala / Fedha (Outer Ring Road)**
   - **Type**: Modern 1-Bedroom (Ksh 12,000 - 16,000)
   - **Comm commute**: Matatus or commuter train from Donholm
   - **Vibe**: Family-friendly, active estate with local markets and excellent safety.

3. **Ngong / Juja (Outer Nairobi)**
   - **Type**: 2-Bedroom Apartment (Ksh 13,000 - 17,000)
   - **Comm commute**: Scenic Matatu commute (Ksh 120 to town)
   - **Vibe**: Fresh mountain air, lower cost of living, great for family setup with spacious compounds.`;

    res.json({ recommendations, housingBudget: maxRent });
  }, 600);
});

// 4. AI Soil & Rainfall (Agricultural Land viability) API
app.post("/api/gemini/soil-rain", async (req, res) => {
  const { region } = req.body;
  if (!region) {
    return res.status(400).json({ error: "Region is required." });
  }

  const systemInstruction = `You are a "Kenyan Agro-Real Estate Specialist".
Analyze the soil profile, average annual rainfall, potential cash crops, and overall investment viability of purchasing land in the specified region of Kenya (e.g. Kitale, Laikipia, Naivasha, Kangundo, Nanyuki, Malindi). Use rich markdown tables.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze land purchase in: ${region}`,
        config: { systemInstruction }
      });
      return res.json({ analysis: response.text });
    } catch (err) {
      console.error("Gemini Soil/Rain Error:", err);
    }
  }

  // Fallback Soil-Rain Analysis
  setTimeout(() => {
    let analysis = `### 🌾 Agro-Investment Analysis: **${region}**

| Parameter | Details for ${region} |
| :--- | :--- |
| **Soil Type** | Deep red volcanic soils & clay loams (rich in organic matter) |
| **Average Rainfall** | 900mm - 1200mm per annum (bimodal pattern) |
| **Water Table** | Moderate (Boreholes average 150m-200m depth) |
| **Top Crops** | Maize, Potatoes, Beans, Cabbages, and Hass Avocados |
| **Viability Score** | **8.5 / 10** (Highly fertile with excellent appreciation potential) |

#### 💡 Expert Purchasing Verdict
The soils in **${region}** are highly fertile. Avocados and horticultural crops will thrive here. Verify the beacon points physically with a surveyor and ensure the Land Control Board (LCB) consent is obtained before transfer.`;
    res.json({ analysis });
  }, 600);
});

// 5. AI House Inspector (Photo/Issue Diagnostics)
app.post("/api/gemini/inspect", async (req, res) => {
  const { issueDescription } = req.body;
  if (!issueDescription) {
    return res.status(400).json({ error: "Issue description is required." });
  }

  const systemInstruction = `You are a "Senior Structural Engineer & Kenyan Tenancy inspector".
Your role is to diagnose building health issues based on descriptions.
Detail:
- Cause of issue (e.g., poor damp-proofing, rising damp, active structural settlement, faulty wiring).
- Estimated repair difficulty (Low / Medium / High).
- Legal responsibility (Is the Tenant or Landlord responsible for repairs under Kenyan Law?).
- Safety rating (Safe / Caution / Dangerous).`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Diagnose this rental issue: ${issueDescription}`,
        config: { systemInstruction }
      });
      return res.json({ diagnosis: response.text });
    } catch (err) {
      console.error("Gemini Inspect Error:", err);
    }
  }

  // Fallback Diagnosis
  setTimeout(() => {
    let diagnosis = `### 🔍 AI Structural Inspector Report

**Problem Analyzed**: "${issueDescription}"

- **Potential Root Cause**: Likely related to poor water-proofing of external walls (rising damp) or concrete slab micro-cracks allowing moisture entry.
- **Legal Responsibility (Kenyan Law)**: **LANDLORD**. Under the Landlord and Tenant Act, the landlord is duty-bound to maintain the structural integrity and exterior of the premises.
- **Safety Rating**: ⚠️ **CAUTION** (Prolonged moisture leads to toxic mold spores and weakens mortar joints).
- **Recommended Action**: The landlord must apply a damp-proof course (DPC) paint layer and repair drainage before repainting. Notify them in writing with photos.`;
    res.json({ diagnosis });
  }, 600);
});

// ----------------------------------------------------
// ⚙️ VITE MIDDLEWARE SETUP & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Makao Yetu server is live at http://0.0.0.0:${PORT}`);
  });
}

startServer();
