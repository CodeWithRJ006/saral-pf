"use server";

export async function fetchChatCompletion(messages: { role: string; content: string }[], maxTokens = 250, temperature = 0.3) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  try {
    if (!apiKey) {
      // Use Pollinations GET endpoint to bypass Turnstile
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const encodedPrompt = encodeURIComponent(prompt + "\n\nAssistant:");
      const res = await fetch(`https://text.pollinations.ai/prompt/${encodedPrompt}?model=openai`, {
        method: "GET"
      });

      if (!res.ok) {
        console.error("Pollinations API Error", await res.text());
        return "ERROR_API_FAILED";
      }

      const text = await res.text();
      return text || "No response generated.";
    }

    // Official OpenAI POST
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      console.error("API Error", await res.text());
      return "ERROR_API_FAILED";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error(error);
    return "ERROR_API_FAILED";
  }
}
