import weaviate
from groq import Groq
from app.core.config import settings
from openai import AzureOpenAI

# Weaviate Client
weaviate_client = None

# LLM Client
groq_client = None

# Azure OpenAI Client
openai_client = None

# Groq
def connect_groq():
    global groq_client
    if groq_client is None:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return groq_client


def get_groq_client():
    connect_groq()
    groq = groq_client
    return groq


# Weaviate
def connect_weaviate():
    global weaviate_client
    if weaviate_client is None:
        weaviate_client = weaviate.connect_to_local(
            host=settings.WEAVIATE_HOST,
            port=settings.WEAVIATE_PORT,
        )

        if not weaviate_client.is_ready():
            raise ConnectionError("Unable to connect to the Weaviate server.")
    return weaviate_client


def get_weaviate_client():
    connect_weaviate()
    vecdb = weaviate_client
    return vecdb

# OpenAI
def connect_openai():
    global openai_client
    if openai_client is None:
        openai_client = AzureOpenAI(
            api_key=settings.OPENAI_API_KEY,
            api_version=settings.OPENAI_API_VERSION,
            azure_endpoint=settings.OPENAI_AZURE_ENDPOINT,
        )
    return openai_client


def get_openai_client():
    connect_openai()
    openai = openai_client
    return openai