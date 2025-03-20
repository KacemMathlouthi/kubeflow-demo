import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function UpcomingFeatures() {
    const features = [
        {
          title: "Improve Conversation Memory",
          description: "Currently, I am passing memory in the context, but I will explore better and smarter ways to handle long-term memory for more contextual responses.",
        },
        {
          title: "Create a Comprehensive Dataset",
          description: "For this demo, I scraped the website repo, but I will build a complete dataset that includes all Kubeflow repositories, projects using Kubeflow, Medium articles, press releases, tutorials, GitHub issues, PRs, StackOverflow discussions, and more.",
        },
        {
          title: "Integrate User Reranker Models for Better RAG",
          description: "I will implement reranker models to refine retrieval quality, ensuring that the most relevant documents are selected before being passed to the LLM.",
        },
        {
          title: "Analyze and Evaluate RAG Behavior",
          description: "I need to assess how well my retrieval pipeline performs. I can track retrieval accuracy, response relevance, and overall system quality using models like Judge LLM while also creating a test dataset for benchmarking.",
        },
        {
          title: "Implement a User Feedback System",
          description: "Users should be able to rate responses and report issues. I will build a feedback system to collect insights that will help refine the chatbot’s performance.",
        },
        {
          title: "Create Custom Prompt Templates",
          description: "I want to give users the ability to create and save their own system prompts for more flexible chatbot interactions.",
        },
        {
          title: "Automate Dataset Updates",
          description: "I will schedule automatic dataset updates to keep information fresh. This could be event-based or triggered at regular intervals, such as monthly updates.",
        },
        {
          title: "Explore LLM Fine-Tuning",
          description: "I will experiment with fine-tuning an LLM on Kubeflow-specific data and compare its effectiveness against my current RAG pipeline.",
        },
        {
          title: "Test Advanced Reasoning Models",
          description: "I will compare reasoning models like DeepSeek R1 against standard LLMs to see if they offer better responses for technical and complex queries.",
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

