from app.core.db import get_openai_client


client = get_openai_client()


def get_embeddings(text: str):
    """
    Get embeddings for a given text using the OpenAI embedding model.

    :param text: The text to embed
    :return: The embeddings as a list of floats
    """
    # Get embeddings
    response = client.embeddings.create(
        input = text,
        model = "text-embedding-ada-002"
    )
    return response.data[0].embedding
