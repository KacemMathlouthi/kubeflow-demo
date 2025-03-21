# 🌐 Frontend – Kubeflow RAG Chatbot

This is the **React + Vite** frontend for the Kubeflow Documentation Assistant. It connects to a FastAPI backend via WebSockets to provide a real-time, responsive chatbot experience powered by Retrieval-Augmented Generation (RAG).

> ✨ Ask questions about Kubeflow docs, and get contextual, accurate answers.

![Kubeflow Chatbot UI Screenshot](https://i.imgur.com/nw5jZZj.png)

---

## ⚙️ Tech Stack

- ⚛️ **React (TypeScript)**
- ⚡ **Vite**
- 🎨 **Tailwind CSS** 
- 🧠 **WebSockets**
- 🧩 **ShadCN UI**
- 📦 **Docker + NGINX**

---

## 🧠 Key Features

- 💬 **Real-Time Chat Interface**
- ⚙️ **LLM Configuration Panel** (Model, Temperature, Max Tokens)
- 🧠 **Contextual RAG Pipeline Visualization**
- 📚 **Markdown Response Rendering** with code highlighting
- 📈 **Implemented vs. Upcoming Feature Panels**
- 🌐 **Deployed on Azure**

---

## 🏗️ Project Structure

```
frontend/
├── Dockerfile              # Build & serve via NGINX
├── nginx/nginx.conf        # NGINX configuration
├── components.json         # ShadCN UI config
├── src/
│   ├── App.tsx             # Main app layout
│   ├── main.tsx            # Vite entrypoint
│   ├── index.css           # Tailwind + custom styles
│   ├── components/         # All UI components
│   └── lib/utils.ts        # Utility functions
```

---

## 🧪 Development

### 1. 🚀 Run Locally

```bash
cd frontend
npm install         # or pnpm install
npm run dev         # Start Vite dev server
```

The app will be available at `http://localhost:5173`.

Make sure the backend is running at `http://localhost:8000`.

---

### 2. 🐳 Run with Docker

```bash
# From root directory
docker-compose up --build
```

The frontend will be served via **NGINX** on port `80`.

---

## 🔧 LLM Settings Panel

- **LLM Provider:** Choose between Meta, Google, Mistral, Alibaba
- **Model Selection:** E.g., `llama-3.3-70b-versatile`
- **Temperature & Max Tokens:** Choose output creativity & length

---

## 📦 Environment Variables

If needed, add a `.env` file to configure frontend variables (like backend URL). Currently, the WebSocket endpoint is hardcoded to `ws://localhost:8000/ws/chat`.

---
