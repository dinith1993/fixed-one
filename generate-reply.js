import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  try {
    const { review, tone } = req.body;
    if (!review || !tone) {
      return res.status(400).json({ error: "Missing review or tone in request body" });
    }

    const prompt = `You are a customer service assistant. Write a ${tone.toLowerCase()} reply to the following review:\n\n"\${review}"`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You write professional review replies." },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API request error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate reply" });
  }
}
