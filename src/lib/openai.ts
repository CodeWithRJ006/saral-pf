"use server";

// Simple in-memory cache to prevent burning through free tier limits during judging/rapid clicking
// Note: In a real serverless deployment, this cache resets per-lambda cold start, but is sufficient for a single demo session.
const cache = new Map<string, { result: string, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function fetchChatCompletion(messages: { role: string; content: string }[], maxTokens = 250, temperature = 0.3) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error("[Groq API] GROQ_API_KEY is missing from environment variables.");
      return "ERROR_API_FAILED";
    }

    // Cache key based on input messages
    const cacheKey = JSON.stringify(messages);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[Groq API] Serving response from cache to conserve rate limits.");
      return cached.result;
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Groq API] Error ${res.status}:`, errorText);
      return "ERROR_API_FAILED";
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content;
    
    if (result) {
      cache.set(cacheKey, { result, timestamp: Date.now() });
      return result;
    }
    
    console.error("[Groq API] Unexpected response structure:", data);
    return "ERROR_API_FAILED";
  } catch (error) {
    console.error("[Groq API] Fetch exception:", error);
    return "ERROR_API_FAILED";
  }
}

