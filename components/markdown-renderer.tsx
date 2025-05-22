"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-gray max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="text-2xl font-bold tracking-tight mt-6 mb-4" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-xl font-bold tracking-tight mt-6 mb-3" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-lg font-bold tracking-tight mt-5 mb-2" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-base font-bold tracking-tight mt-4 mb-2" {...props} />
          ),
          p: (props) => <p className="leading-7 mb-4" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: (props) => <li className="mt-1" {...props} />,
          a: (props) => (
            <a className="text-primary underline underline-offset-4" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-muted pl-4 italic text-muted-foreground"
              {...props}
            />
          ),
          code: (props) => (
            <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm" {...props} />
          ),
          pre: (props) => (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto" {...props} />
          ),
          hr: (props) => <hr className="my-6 border-muted" {...props} />,
          table: (props) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-muted" {...props} />,
          tbody: (props) => <tbody className="divide-y" {...props} />,
          tr: (props) => <tr className="m-0 border-t p-0" {...props} />,
          th: (props) => (
            <th
              className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
