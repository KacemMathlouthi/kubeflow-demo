import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ImplementedFeatures() {
    const features = [
        {
            title: "Data Loading & Preprocessing",
            description: "Created a custom data loader for loading and preprocessing Any Kubeflow Github Repository data. This data is then split based on files, chunked into 1000 token chunks with 100 token overlap. I used the Gitingest API to get the whole repository into one file.",
        },
        {
            title: "Embedding Generation with OpenAI model `text-embedding-ada-002`",
            description: "Transforms documentation chunks into vector embeddings using OpenAI model `text-embedding-ada-002` model.",
        },
        {
          title: "Weaviate Vector Database",
          description: "I used Weaviate as a vector database to store and retrieve embeddings of Kubeflow documentation. I used Cosine Similarity to find the most similar embeddings.",
        },
        {
            title: "LLM Integration",
            description: "I integrated an LLM to generate meaningful responses based on the retrieved chunks of documentation. The chatbot currently has no memory.",
        },
        {
          title: "LLM Configuration",
          description: "I used GROQ as an llm provider, you can choose from groq supported models, and configure the temperature and max tokens in the settings section.",
        },
        {
          title: "Markdown Rendering for Enhanced Responses",
          description: "Supports rich text formatting in bot responses, allowing structured information presentation with Markdown features such as bold text, lists, hyperlinks and code blocks (you can copy code snippets directly).",
        },
        {
            title: "Interactive Chat Interface",
            description: "A responsive chat UI, enabling smooth interactions. Real-time communication between the frontend and backend is handled via WebSockets.",
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

