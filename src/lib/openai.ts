"use server";

export async function fetchChatCompletion(messages: { role: string; content: string }[], maxTokens = 250, temperature = 0.3) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing from environment variables");
      return "ERROR_API_FAILED";
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "groq/compound",
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      console.error("Groq API Error", await res.text());
      return "ERROR_API_FAILED";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error(error);
    return "ERROR_API_FAILED";
  }
}
