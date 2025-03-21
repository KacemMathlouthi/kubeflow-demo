import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function UpcomingFeatures() {
    const features = [
      // MEMORY & CONTEXT MANAGEMENT
      {
        title: "Conversation Memory Integration",
        description: "LLM conversation memory is currently not implemented. Future updates will include mechanisms for maintaining memory across interactions.",
      },

      // DATA INGESTION & MANAGEMENT
      {
        title: "Comprehensive Dataset Expansion",
        description: "The dataset will be expanded to include all Kubeflow repositories, user projects, Medium articles, tutorials, GitHub issues, PRs, StackOverflow discussions, and more.",
      },
      {
        title: "Automated Dataset Refresh",
        description: "A system for automatic dataset updates will be added, triggered by upstream changes or scheduled intervals.",
      },
      {
        title: "Event-Driven Indexing Mechanism",
        description: "The ingestion pipeline will support event-based triggers to re-index documentation upon updates or releases.",
      },

      // RAG PIPELINE IMPROVEMENTS
      {
        title: "Reranker Model Integration",
        description: "Reranker models will be added to enhance the retrieval pipeline by selecting the most contextually relevant documents before LLM input.",
      },
      {
        title: "RAG Pipeline Evaluation & Benchmarking",
        description: "Systematic analysis will be conducted using tools like Judge LLM and custom test datasets to evaluate retrieval quality and response relevance.",
      },
      {
        title: "LLM Fine-Tuning with Kubeflow Trainer",
        description: "Fine-tuned LLMs on Kubeflow-specific data will be evaluated to improve response accuracy and domain understanding.",
      },
      {
        title: "Evaluation of Advanced Reasoning Models",
        description: "Advanced LLMs such as DeepSeek R1 will be tested and compared with baseline models for technical and complex Kubeflow queries.",
      },

      // PIPELINE AUTOMATION & KUBEFLOW INTEGRATION
      {
        title: "Modular RAG Pipelines via Kubeflow",
        description: "Scalable and modular Kubeflow Pipelines will be implemented to automate data ingestion, embedding, and retrieval workflows.",
      },

      // USER EXPERIENCE & FEEDBACK
      {
        title: "User Feedback Collection System",
        description: "A feedback mechanism will be implemented to collect user ratings and issue reports to improve chatbot performance over time.",
      },
      {
        title: "Custom Prompt Template Support",
        description: "Support for user-defined prompt templates will be introduced to offer more flexibility and control in chatbot interactions.",
      },
    ];

  return (
    <Card className="p-6 shadow-lg border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Ideas for Future Features
        </span>
      </h3>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">{feature.title}</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 opacity-80">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

