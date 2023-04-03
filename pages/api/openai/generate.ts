import { OpenAIStream, OpenAIStreamPayload } from "../../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: Array<Object>;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  console.log(prompt)

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: prompt,
    temperature: 1,
    top_p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0.25,
    max_tokens: 70,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
