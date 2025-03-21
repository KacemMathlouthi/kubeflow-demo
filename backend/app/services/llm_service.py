from app.core.db import get_groq_client

# Initialize the Groq client
llm_client = get_groq_client()


async def get_response(user_message: str):
    """
    Get a response from the LLM using the provided prompt.
    """
    # Create the chat completion
    chat_completion = llm_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a helpful Kubeflow Documentation assistant that answers questions based on the provided context.",
            },
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
        stream=False,
    )

    return chat_completion.choices[0].message.content
