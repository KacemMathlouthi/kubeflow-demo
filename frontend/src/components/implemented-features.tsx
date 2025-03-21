import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ImplementedFeatures() {
    const features = [
        {
            title: "Data Loading & Preprocessing",
            description: "I built a custom data loader to fetch and preprocess any Kubeflow GitHub repository using the Gitingest API. The data is split by file and chunked into 1000-token segments with 100-token overlap. For this demo, i just used the Kubeflow/website repository.",
        },
        {
            title: "Embedding Generation",
            description: "I generated vector embeddings from documentation chunks using OpenAI’s `text-embedding-ada-002` model for semantic understanding.",
        },
        {
            title: "Weaviate Vector Database",
            description: "I integrated Weaviate as the vector store, using Cosine Similarity for efficient semantic search over Kubeflow documentation embeddings.",
        },
        {
            title: "LLM Integration",
            description: "I connected an LLM to generate accurate, context-aware responses based on retrieved documentation chunks. The chatbot currently operates statelessly.",
        },
        {
            title: "LLM Configuration",
            description: "I used GROQ as the LLM provider and implemented configurable model selection, temperature, and max tokens in the settings.",
        },
        {
            title: "Markdown Rendering",
            description: "I enabled Markdown support in responses, allowing for code blocks, bold text, lists, and clickable links for better readability.",
        },
        {
            title: "Interactive Chat Interface",
            description: "I developed a responsive real-time chat UI with WebSocket communication between frontend and backend for seamless interaction.",
        },
    ];      

  return (
    <Card className="p-6 shadow-lg border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-400 flex items-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Implemented Features
        </span>
      </h3>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">{feature.title}</p>
              <p className="text-sm text-green-700 dark:text-green-400 opacity-80">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

