from app.core.db import get_groq_client
from langchain.prompts import PromptTemplate
from app.services.weaviate_service import similarity_search

# Initialize the Groq client
llm_client = get_groq_client()


prompt_template = """You are a helpful Kubeflow Documentation assistant that answers questions based on the provided context.

Using the information contained in the context, give a comprehensive answer to the question.
Respond only to the question asked, response should be concise and relevant to the question.

If the answer cannot be deduced from the context, do not give an answer.

Here are some Context (ONLY use if relevant to the question):
{context}
"""


# PromptTemplate instance
prompt = PromptTemplate(
    input_variables=["context"],
    template=prompt_template,
)


async def get_response(
        user_message: str,
        llm_model: str = "llama-3.3-70b-versatile",
        temperature: float = 0.5,
        max_tokens: int = 8192):
    """
    Get a response from the LLM using the provided prompt.
    """
    # Perform Similarity Search based on the user message
    context = await similarity_search(user_message, top_k=5)

    # Format the Retrieved Snippets with document title, URL, and the content
    formatted_snippets = []
    for snippet in context:
        formatted_snippets.append(
            {
                "Documentation URL": snippet.properties.get("documentURL"),
                "content": snippet.properties.get("documentContent"),
            }
        )

    # Format the prompt with real values
    formatted_prompt = prompt.format(context = str(formatted_snippets))

    # Create the chat completion
    chat_completion = llm_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": formatted_prompt,
            },
            {"role": "user", "content": user_message},
        ],
        model=llm_model,
        temperature=temperature,
        max_completion_tokens=max_tokens,
        stream=False,
    )

    return chat_completion.choices[0].message.content
