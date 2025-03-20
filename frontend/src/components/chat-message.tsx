"use client"

import type { Message } from "ai"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BookOpen, Github, Link, User, Copy, Check, Code } from "lucide-react"
import { useState } from "react"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const references =
    message.role === "assistant"
      ? [
          {
            type: "doc",
            title: "Kubeflow Documentation",
            url: "https://www.kubeflow.org/docs/",
            section: "Getting Started",
          },
          {
            type: "github",
            title: "Issue #1234",
            url: "https://github.com/kubeflow/kubeflow/issues/1234",
            description: "Installation problem on GKE",
          },
          { type: "link", title: "Kubeflow Blog", url: "https://blog.kubeflow.org/", description: "Latest updates" },
        ]
      : []

  // Function to process content and render code blocks
  const processContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract language and code
        const match = part.match(/```(\w+)?\s*([\s\S]*?)```/)
        if (match) {
          const language = match[1] || "text"
          const code = match[2].trim()
          return <CodeBlock key={index} language={language} code={code} />
        }
      }

      // Regular text - process for markdown-like formatting
      return <TextBlock key={index} text={part} />
    })
  }

  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] flex items-start space-x-4",
          message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row",
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            message.role === "user" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500",
          )}
        >
          {message.role === "user" ? <User className="h-5 w-5" /> : <img src="/logo.png" className="h-6 w-6" />}
        </div>

        <Card
          className={cn(
            "p-4 shadow-md",
            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border-2 border-border/50",
          )}
        >
          <div className="prose dark:prose-invert max-w-none">{processContent(message.content)}</div>

          {message.role === "assistant" && references.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">References:</h4>
              <div className="flex flex-wrap">
                {references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "reference-tag",
                      ref.type === "doc" && "reference-tag-doc",
                      ref.type === "github" && "reference-tag-github",
                      ref.type === "link" && "reference-tag-link",
                    )}
                  >
                    {ref.type === "doc" && <BookOpen className="h-3 w-3 mr-1" />}
                    {ref.type === "github" && <Github className="h-3 w-3 mr-1" />}
                    {ref.type === "link" && <Link className="h-3 w-3 mr-1" />}
                    <span className="truncate max-w-[150px]">{ref.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

interface CodeBlockProps {
  language: string
  code: string
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block my-4 rounded-md overflow-hidden">
      <div className="code-block-header">
        <div className="flex items-center">
          <Code className="h-4 w-4 mr-2" />
          <span>{language}</span>
        </div>
        <button onClick={copyToClipboard} className="code-block-copy flex items-center" aria-label="Copy code">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 bg-[#1e1e1e] text-[#d4d4d4] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

interface TextBlockProps {
  text: string
}

function TextBlock({ text }: TextBlockProps) {
  // Process basic markdown-like formatting
  const processedText = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Links
    .replace(
      /\[(.*?)\]$$(.*?)$$/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>',
    )
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Lists
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d\. (.*?)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="my-2">')
    // Line breaks
    .replace(/\n/g, "<br />")

  return <div dangerouslySetInnerHTML={{ __html: `<p>${processedText}</p>` }} />
}

