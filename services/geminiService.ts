import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getSpendingAnalysis = async (transactions: Transaction[], context: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key not configured.";

  // Simplify data for token efficiency
  const summary = transactions.map(t => `${t.date}: [${t.type.toUpperCase()}] ${t.category} - ₹${t.amount} (${t.note})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a financial advisor. Analyze these transactions (income and expenses) for the selected period (${context}).
      
      Transactions:
      ${summary}

      Please provide:
      1. A brief summary of financial health (income vs spending).
      2. One specific actionable tip to save money or optimize budget.
      3. Keep the tone encouraging but professional.
      4. If data is empty, say "No transactions to analyze."
      5. Keep it under 150 words.
      `,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't analyze your transactions at this moment. Please try again later.";
  }
};