const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendButton = document.getElementById("sendButton");


// Send button
sendButton.addEventListener("click", sendMessage);


// Enter key
input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


async function sendMessage() {

    const message = input.value.trim();

    if (message === "") {
        return;
    }


    // Show user's message
    addMessage(message, "user");


    // Clear input
    input.value = "";


    // Disable controls while waiting
    input.disabled = true;
    sendButton.disabled = true;


    // Show thinking message
    const thinkingMessage = addMessage(
        "Thinking...",
        "bot"
    );


    // Start timing request
    const startTime = Date.now();


    try {

        // Send message to backend
        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        // Convert response to JSON
        const data = await response.json();


        // Show response time in browser console
        console.log(
            "OpenRouter response time:",
            Date.now() - startTime,
            "ms"
        );


        // Remove Thinking...
        thinkingMessage.remove();


        // Show AI response
        if (data.reply) {

            addMessage(
                data.reply,
                "bot"
            );

        } else {

            addMessage(
                data.error || "Something went wrong.",
                "bot"
            );

        }


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        thinkingMessage.remove();


        addMessage(
            "Could not connect to the server.",
            "bot"
        );

    }


    // Enable controls again
    input.disabled = false;
    sendButton.disabled = false;

    input.focus();

}


function addMessage(text, sender) {

    const messageElement =
        document.createElement("div");


    messageElement.classList.add(
        "message",
        sender
    );


    /*
        AI responses are Markdown.

        marked.parse() converts:

        **bold**

        ```python
        print("Hello")
        ```

        into proper HTML.
    */

    if (sender === "bot") {

        messageElement.innerHTML =
            marked.parse(text);

    } else {

        // User messages stay as plain text
        messageElement.textContent = text;

    }


    chat.appendChild(
        messageElement
    );


    // Scroll to newest message
    chat.scrollTop =
        chat.scrollHeight;


    return messageElement;

}