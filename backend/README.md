# 📦 Backend - Kubeflow Documentation RAG App

This is the **FastAPI backend** for the Kubeflow Documentation Retrieval-Augmented Generation (RAG) application. It powers documentation ingestion, embedding, vector storage, LLM integration, and real-time communication via WebSockets.

---

## 🚀 Features

- 📥 **GitHub Documentation Ingestion** using Gitingest
- 🧠 **Embeddings** via Azure OpenAI text-ada-002 
- 🗂️ **Vector Database** powered by Weaviate
- 🤖 **LLM Chat Responses** using similarity search + Groq LLMs
- 🔌 **REST API** and **WebSocket** interfaces
- 🪄 **Modular Architecture** (Controllers, Services, Routes)

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI entrypoint
│   ├── core/                    # Config, database & websocket manager
│   ├── routes/                  # FastAPI route definitions
│   ├── controllers/            # Request logic delegation
│   ├── services/               # Business logic
│   └── parsed_repositories/    # Saved docs after ingestion
├── Dockerfile
├── poetry.lock
├── pyproject.toml
└── README.md
```

---

## ⚙️ Configuration

The app uses **environment variables**, defined in a `.env` file.

### Example `.env` file:

```env
FRONTEND_URL=http://localhost:5173

# Weaviate Config
WEAVIATE_HOST=localhost
WEAVIATE_PORT=8080
WEAVIATE_API_KEY=your_api_key_if_any

# LLM & Embeddings
GROQ_API_KEY=your_groq_api_key
LLM_MODEL=llama-3.3-70b-versatile

# Azure OpenAI Config
OPENAI_API_KEY=your_openai_key
OPENAI_API_VERSION=2023-12-01-preview
OPENAI_AZURE_ENDPOINT=https://your-resource-name.openai.azure.com/
```

---

## 🐳 Running the Backend

### 🧱 With Docker

```bash
# From root directory
docker-compose up --build
```

### 💻 Or manually (without Docker)

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

---

## 📡 API Endpoints

### 🧠 LLM
| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| POST   | `/llm`         | Get response from LLM            |

### 📄 Documentation
| Method | Endpoint              | Description                                |
|--------|-----------------------|--------------------------------------------|
| POST   | `/documentation`      | Ingest repo using Gitingest                |
| POST   | `/documentation/embed`| Chunk & embed repo content to Weaviate     |

### 📊 VectorDB (Weaviate)
| Method | Endpoint                   | Description                            |
|--------|----------------------------|----------------------------------------|
| GET    | `/vectordb/healthcheck`    | Check Weaviate connection              |
| POST   | `/vectordb/checkcollection`| Check if collection exists             |
| POST   | `/vectordb/collection`     | Create collection if missing           |
| POST   | `/vectordb`                | Add a document manually                |
| GET    | `/vectordb`                | Retrieve documents                     |
| DELETE | `/vectordb/{uuid}`         | Delete a document by UUID              |
| GET    | `/vectordb/similarity`     | Perform similarity search              |
| GET    | `/vectordb/count`          | Get total document count               |

### 🔗 Embedding
| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| POST   | `/embeddings`  | Get embedding for custom text    |

### 🔄 WebSocket
| Type   | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| WS     | `/ws/chat`     | Real-time LLM chat interface     |

---

## 🔍 Technologies Used

- **FastAPI** – Web framework
- **Langchain** – Text splitting & prompt templating
- **Weaviate** – Vector DB
- **Groq / Azure OpenAI** – LLM & Embeddings
- **WebSocket** – Real-time chat support
- **Poetry** – Dependency management

---

