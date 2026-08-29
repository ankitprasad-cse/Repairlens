import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  console.error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

// Basic CORS middleware for local Vite frontend integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Configure Multer memory storage and image validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  }
});

// Single-file upload wrapper with Multer error handling
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Please upload a valid image file (JPG, PNG, or WEBP).' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image size exceeds the 10MB limit.' });
      }
      return res.status(400).json({ error: 'Failed to process the uploaded image.' });
    }
    next();
  });
};

app.post('/api/analyze-image', handleUpload, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No image file uploaded. Please provide an image under the field name "image".' });
    }

    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `You are the vision-analysis component of RepairLens, an AI tool for diagnosing broken everyday objects.

Your job is to identify ANY physical object shown in the image, not just objects from a predefined list.

Analyze the image carefully and determine:

1. The most specific reasonable name of the physical item.
2. Its general category (electronics, appliance, furniture, sports equipment, clothing, tool, kitchenware, vehicle, accessory, etc.).
3. The visible damage or abnormal condition.
4. The most likely repair-relevant issue based ONLY on what can reasonably be inferred from the image.
5. The approximate severity of the damage: low, medium, or high.
6. Whether the item appears potentially repairable, replaceable, or uncertain.
7. A reasonable estimated repair cost range in Indian Rupees (INR), based on the type of object and apparent damage.
8. A reasonable estimated replacement cost range in Indian Rupees (INR), based on the type and typical quality level of the object.
9. Whether repair or replacement is more sensible.
10. Your confidence level: high, medium, or low.

IMPORTANT RULES:
- You can identify objects that are NOT present in any predefined database.
- NEVER classify an unknown object as "generic electrical appliance" merely because it is not recognized.
- NEVER assume an object is electronic unless the image supports that conclusion.
- For example, a racket should be identified as a racket/sports equipment, a shoe as footwear, a chair as furniture, and a backpack as a bag/accessory.
- Do not invent damage that cannot reasonably be seen.
- Clearly distinguish visual evidence from uncertainty.
- Cost estimates must depend on the identified object and damage. Do not use one universal repair/replacement price for every object.
- If the exact model or brand cannot be determined, provide a reasonable category-level estimate.
- If the image is too unclear to identify the object reliably, use "Unknown object" rather than incorrectly assigning an unrelated category.

Return ONLY a valid JSON object matching this exact schema:

{
  "item": "specific item name",
  "category": "general object category",
  "visibleDamage": "what can actually be seen",
  "likelyIssue": "most likely repair-relevant issue",
  "severity": "low" | "medium" | "high",
  "repairability": "repairable" | "replaceable" | "uncertain",
  "repairCostRange": [minimum_number, maximum_number],
  "replacementCostRange": [minimum_number, maximum_number],
  "recommendation": "repair" | "replace" | "uncertain",
  "confidence": "high" | "medium" | "low"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text ? response.text.trim() : '';

    if (!responseText) {
      return res.status(500).json({ error: 'Vision model returned an empty response. Please try again with another image.' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse visual diagnosis data from the AI model.' });
    }

 const structuredResponse = {
  item: parsedResult.item || 'Unknown Item',
  category: parsedResult.category || 'Unknown category',
  visibleDamage: parsedResult.visibleDamage || 'No obvious damage visible in the provided image.',
  likelyIssue: parsedResult.likelyIssue || 'Visual inspection inconclusive. Physical testing required.',
  severity: ['low', 'medium', 'high'].includes(parsedResult.severity)
    ? parsedResult.severity
    : 'medium',
  repairability: ['repairable', 'replaceable', 'uncertain'].includes(parsedResult.repairability)
    ? parsedResult.repairability
    : 'uncertain',
  repairCostRange: Array.isArray(parsedResult.repairCostRange)
    ? parsedResult.repairCostRange
    : [0, 0],
  replacementCostRange: Array.isArray(parsedResult.replacementCostRange)
    ? parsedResult.replacementCostRange
    : [0, 0],
  recommendation: ['repair', 'replace', 'uncertain'].includes(parsedResult.recommendation)
    ? parsedResult.recommendation
    : 'uncertain',
  confidence: ['high', 'medium', 'low'].includes(parsedResult.confidence)
    ? parsedResult.confidence
    : 'medium'
};

    return res.status(200).json(structuredResponse);
  }  catch (error) {
    console.error('Error during image analysis:', {
      message: error?.message,
      status: error?.status,
      code: error?.code
    });

    return res.status(500).json({
      error: 'An error occurred while analyzing the image.',
      details: error?.message || 'Unknown internal error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`RepairLens AI server running on http://localhost:${PORT}`);
});