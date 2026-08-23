const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


// Allow JSON requests
app.use(express.json());


// Serve your frontend files
app.use(express.static(__dirname));


// Chat API
app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "Message is required"
            });
        }


        // Send message to OpenRouter
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                },

                body: JSON.stringify({
                    model: "openrouter/free",

                    messages: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error("OpenRouter error:", data);

            return res.status(response.status).json({
                error: data.error?.message || "OpenRouter request failed"
            });
        }


        const reply = data.choices[0].message.content;


        res.json({
            reply: reply
        });


    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            error: "Something went wrong"
        });

    }

});


app.listen(3000, () => {

    console.log("Chatbot server running at:");
    console.log("http://localhost:3000");

});