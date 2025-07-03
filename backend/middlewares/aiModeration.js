// import axios from "axios";

// export const aiModeration = async (req, res, next) => {
//   const openaiApiKey = process.env.OPENAI_API_KEY;
//   const fieldsToCheck = ["title", "content", "bio", "username", "website", "category", "tags"];

//   // Gather all non-empty fields as strings
//   const inputs = [];
//   const fieldNames = [];
//   for (const field of fieldsToCheck) {
//     if (req.body[field]) {
//       let value = req.body[field];
//       if (Array.isArray(value)) value = value.join(" ");
//       value = String(value);
//       inputs.push(value);
//       fieldNames.push(field);
//     }
//   }

//   if (inputs.length === 0) return next();

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/moderations",
//       { input: inputs },
//       { headers: { Authorization: `Bearer ${openaiApiKey}` } }
//     );
//     // response.data.results is an array, one per input
//     for (let i = 0; i < response.data.results.length; i++) {
//       if (response.data.results[i].flagged) {
//         return res.status(400).json({ error: `Inappropriate content detected in ${fieldNames[i]}.` });
//       }
//     }
//     next();
//   } catch (err) {
//     if (err.response && err.response.status === 429) {
//       return res.status(429).json({ error: "AI moderation rate limit reached. Please try again later." });
//     }
//     console.error("AI moderation error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "AI moderation failed." });
//   }
// };

import { bannedWords } from "../utils/bannedWords.js";

export const aiModeration = async (req, res, next) => {
  // List all fields you want to check
  const fieldsToCheck = ["title", "content", "bio", "username", "website", "category", "tags"];

  try {
    for (const field of fieldsToCheck) {
      if (req.body[field]) {
        let value = req.body[field];
        if (Array.isArray(value)) value = value.join(" ");
        const lowerValue = String(value).toLowerCase();

        for (const word of bannedWords) {
          const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
          if (wordRegex.test(lowerValue)) {
            return res.status(400).json({ error: `Inappropriate content detected in ${field}.` });
          }
        }
      }
    }
    next();
  } catch (err) {
    console.error("AI moderation error:", err);
    return res.status(500).json({
      error: "An internal error occurred during content moderation. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};