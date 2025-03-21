"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn("max-w-[85%] flex items-start gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            message.role === "user"
              ? "bg-primary/10 text-primary"
              : "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500",
          )}
        >
          {message.role === "user" ? (
            <User className="h-5 w-5" />
          ) : (
            <img src="/logo.png" className="h-6 w-6" alt="Assistant" />
          )}
        </div>

        <Card
          className={cn(
            "p-4 shadow-md",
            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border/50",
            message.role === "assistant" && "animate-fade-in",
          )}
        >
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={message.content} />
          </div>
        </Card>
      </div>
    </div>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""

          // Only render as code block if it has a language or multiple lines
          const code = String(children).replace(/\n$/, "")
          const shouldRenderAsBlock = !inline && (language || code.includes("\n"))

          return shouldRenderAsBlock ? (
            <CodeBlock language={language} code={code} />
          ) : (
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
        },
        ul({ children }) {
          return <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
        },
        ol({ children }) {
          return <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {children}
            </a>
          )
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 my-4 italic">
              {children}
            </blockquote>
          )
        },
        hr() {
          return <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-700">{children}</table>
            </div>
          )
        },
        th({ children }) {
          return (
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">
              {children}
            </th>
          )
        },
        td({ children }) {
          return <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{children}</td>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Map common language aliases to their proper names for display
  const getLanguageDisplay = (lang: string) => {
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "React JSX",
      tsx: "React TSX",
      py: "Python",
      rb: "Ruby",
      go: "Go",
      java: "Java",
      cpp: "C++",
      cs: "C#",
      php: "PHP",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      yml: "YAML",
      yaml: "YAML",
      md: "Markdown",
      sh: "Shell",
      bash: "Bash",
      sql: "SQL",
    }

    return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1) || "Plain Text"
  }

  return (
    <div className="code-block my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="code-header flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm">
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {language ? getLanguageDisplay(language) : "Plain Text"}
        </span>
        <button
          onClick={copyToClipboard}
          className="transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: 0 }}
          showLineNumbers={code.split("\n").length > 1}
          wrapLines={true}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

