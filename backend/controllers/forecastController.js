const Transaction = require("../models/Transaction");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getForecast = async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: "expense" });

    // Build last 6 months expense data
    const monthlyExpenses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString("default", { month: "short" });
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const expense = transactions
        .filter((t) => t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyExpenses.push({ month, expense });
    }

    // Math-based prediction (linear trend)
    const last3 = monthlyExpenses.slice(-3).map((m) => m.expense);
    const delta =
      last3.length >= 2
        ? (last3[last3.length - 1] - last3[0]) / (last3.length - 1)
        : 0;
    const predictedNextMonth = Math.max(0, Math.round(last3[last3.length - 1] + delta));

    let trend = "stable";
    if (delta > 500) trend = "increasing";
    else if (delta < -500) trend = "decreasing";

    // Gemini AI insight
    let aiInsight = "No insight available.";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
      const prompt = `
You are a financial analyst for a small company. Based on the following monthly expense data, provide a 2-sentence insight about the trend and a recommendation. Be concise and professional.

Monthly expenses (last 6 months):
${monthlyExpenses.map((m) => `${m.month}: ₹${m.expense}`).join("\n")}

Predicted next month: ₹${predictedNextMonth}
Trend: ${trend}

Respond in exactly 2 sentences. No bullet points, no markdown.
      `;
      const result = await model.generateContent(prompt);
      aiInsight = result.response.text().trim();
    } catch (aiErr) {
      console.error("Gemini error:", aiErr.message);
    }

    res.json({
      predictedNextMonth,
      basedOnMonths: 6,
      trend,
      history: monthlyExpenses,
      aiInsight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};