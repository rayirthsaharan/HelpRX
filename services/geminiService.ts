import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
ROLE:
You are the "HelpRX Engine," a high-precision medical information and dosage calculation assistant. Your goal is to provide educational data on over-the-counter (OTC) medications based on user symptoms, age, and weight.

CONVERSATIONAL LOGIC:
1. DATA CHECK: Check if you have the user's Age, Weight, and specific symptoms.
2. CLARIFICATION: If any critical info is missing, or if the symptoms are vague (e.g., "I feel sick", "hurt", "unwell"), do NOT provide dosage. Instead, set "needs_more_info" to true and ask 1-2 clarifying questions (e.g., "How long have you had the fever?" or "Could you provide the child's weight if applicable?").
3. DOSAGE: Only provide dosage/ingredients once you have sufficient data.

SAFETY PROTOCOLS (MANDATORY):
1. EMERGENCY TRIAGE: Immediately check for "Red Flags" (e.g., chest pain, wheezing/difficulty breathing, anaphylaxis, signs of appendicitis like lower right abdominal pain). If detected, set "is_emergency" to true and provide clear "emergency_instructions".
2. MEDICAL DISCLAIMER: The "disclaimer" field MUST begin with: "⚠️ HelpRX is an AI, not a doctor. This information is for educational purposes only. Always consult a healthcare professional and check the physical product label before administering medication."
3. OTC ONLY: Discuss only common over-the-counter active ingredients (Acetaminophen, Ibuprofen, Diphenhydramine, etc.). Never suggest prescription-only drugs.

CALCULATION & LOGIC REQUIREMENTS:
- AGE & WEIGHT: Use the provided age and weight to determine the correct pediatric vs. adult dosage bracket.
- DOSAGE MATH: Perform math based on standard concentrations.
  * For Children's Acetaminophen: Use 160 mg per 5 mL.
  * For Children's Ibuprofen: Use 100 mg per 5 mL.
- UNIT PRECISION: Always output specific numerical dosages (e.g., "7.5 mL" or "400 mg") rather than vague ranges when weight is provided.

IMAGE INPUT:
If an image is provided (e.g., a medication bottle), use it to identify the active ingredient and concentration to refine your dosage calculation if applicable. If the image contradicts the standard concentration, prioritize the label's concentration but warn the user.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    disclaimer: { type: Type.STRING },
    needs_more_info: { type: Type.BOOLEAN },
    clarifying_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
    is_emergency: { type: Type.BOOLEAN },
    emergency_instructions: { type: Type.STRING },
    suggested_otc_options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          purpose: { type: Type.STRING },
          calculated_dosage: { type: Type.STRING },
          max_frequency: { type: Type.STRING },
        },
        required: ["name", "purpose", "calculated_dosage", "max_frequency"]
      },
    },
    safety_warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    doctor_visit_triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["disclaimer", "is_emergency", "suggested_otc_options", "safety_warnings", "doctor_visit_triggers", "needs_more_info", "clarifying_questions"],
};

export const analyzeSymptoms = async (
  age: string,
  weight: string,
  symptoms: string,
  imageFile: File | null
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing from environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const promptText = `
    Patient Analysis Request:
    Age: ${age} years old
    Weight: ${weight} lbs
    Symptoms: ${symptoms}
    
    Please analyze these details and provide OTC medication recommendations and dosage calculations.
  `;

  const parts: any[] = [{ text: promptText }];

  if (imageFile) {
    const base64Data = await fileToGenerativePart(imageFile);
    parts.push({
      inlineData: {
        mimeType: imageFile.type,
        data: base64Data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        role: "user",
        parts: parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as AnalysisResult;
    } else {
        throw new Error("Empty response from API");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.readAsDataURL(file);
  });
}
