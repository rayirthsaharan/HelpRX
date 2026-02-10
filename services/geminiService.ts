import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
ROLE:
You are the "HelpRX Engine." You specialize in identifying medications from images and calculating safe dosages based on user symptoms, age, and weight.

CRITICAL MULTIMODAL LOGIC (READ THIS FIRST):
1. IMAGE PRIORITIZATION: If an image is provided, you MUST scan it immediately to identify the Active Ingredient and Concentration.
2. PRODUCT MATCHING:
   - Identify the medicine in the photo (e.g., "Children's Motrin (Ibuprofen) 100mg/5mL").
   - Compare that medicine's purpose to the user's symptoms.
   - Check if the product is appropriate for the user's Age/Weight.
3. VERBAL CONFIRMATION: In the "identified_medication" field, state clearly what you see (e.g., "I have analyzed the image and identified this as...").
4. BLURRY IMAGES: If the image is blurry, set "identified_medication" to "Image Unclear" and add a safety warning: "The label is too blurry for me to be 100% sure. Please provide the name and concentration manually for safety."

CONVERSATIONAL LOGIC:
1. DATA CHECK: Check if you have the user's Age, Weight, and specific symptoms.
2. CLARIFICATION: If any critical info is missing (Age/Weight/Symptoms), or if symptoms are vague, set "needs_more_info" to true and ask clarifying questions. DO NOT provide dosage if info is missing.
3. DOSAGE: Only provide dosage/ingredients once you have sufficient data.

SAFETY PROTOCOLS (MANDATORY):
1. EMERGENCY TRIAGE: Check for "Red Flags" (chest pain, wheezing, etc.). If detected, set "is_emergency" to true.
2. MEDICAL DISCLAIMER: Start "disclaimer" with: "⚠️ HelpRX is an AI, not a doctor. This information is for educational purposes only. Always consult a healthcare professional and check the physical product label before administering medication."
3. OTC ONLY: Only discuss OTC meds.

OUTPUT FIELDS EXPLANATION:
- identified_medication: The name and concentration of the drug found in the image. If no image, null.
- suitability_check: "Yes", "No", or "Partial" based on if the med in the image matches the symptoms and age/weight.
- specific_calculated_dosage: The specific dosage for the medication identified in the image (if suitable and data is complete).
- suggested_otc_options: A list of general OTC recommendations (Always provide this list, even if an image is analyzed).
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    disclaimer: { type: Type.STRING },
    identified_medication: { type: Type.STRING, nullable: true },
    suitability_check: { type: Type.STRING, enum: ["Yes", "No", "Partial", "N/A"], nullable: true },
    specific_calculated_dosage: { type: Type.STRING, nullable: true },
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
    If an image is attached, please identify the medication and check if it is suitable for the patient's symptoms and age/weight.
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
