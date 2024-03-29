export default async (req, res) => {

    const prompt = req.body;

    console.log(req.body)

    try {
        var tweetAI = "";
        const response = await fetch("https://" + process.env.VERCEL_URL + "/api/openai/generate", {
        // const response = await fetch("http://localhost:3000" + "/api/openai/generate", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "prompt": prompt,
            }),
        });

        console.log("Edge function returned.");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const stream = response.body;
        if (!stream) {
            console.log("No stream returned.")
            return "";
        }

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            tweetAI = tweetAI + chunkValue;
            // setTweetAI((prev) => prev + chunkValue);
        }
        return res.status(200).json(tweetAI);

    } catch (e) {
        console.log(e)
        return res.status(400).json({
            status: e.message
        });
    }
}