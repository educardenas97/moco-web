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
            <h1 className="text-2xl font-medium tracking-tight mt-8 mb-4" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-xl font-medium tracking-tight mt-7 mb-3 text-foreground" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-lg font-medium tracking-tight mt-6 mb-2 text-foreground" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-base font-medium tracking-tight mt-5 mb-2 text-foreground" {...props} />
          ),
          p: (props) => <p className="leading-7 mb-5 text-foreground/90" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 mb-5 marker:text-primary/70 space-y-2" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 mb-5 marker:text-primary/70 space-y-2" {...props} />,
          li: (props) => <li className="mt-1" {...props} />,
          a: (props) => (
            <a className="text-primary font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground bg-primary/5 py-2 pr-2 rounded-r-lg my-4"
              {...props}
            />
          ),
          code: (props) => (
            <code className="bg-primary/5 px-1.5 py-0.5 rounded-md font-mono text-sm text-primary" {...props} />
          ),
          pre: (props) => (
            <pre className="bg-gray-50 p-4 rounded-xl overflow-x-auto border border-gray-200 shadow-sm" {...props} />
          ),
          hr: (props) => <hr className="my-8 border-gray-200" {...props} />,
          table: (props) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-gray-50 border-b border-gray-200" {...props} />,
          tbody: (props) => <tbody className="divide-y divide-gray-200" {...props} />,
          tr: (props) => <tr className="m-0 p-0 even:bg-gray-50/50" {...props} />,
          th: (props) => (
            <th
              className="border-r last:border-r-0 border-gray-200 px-4 py-3 text-left font-medium text-foreground [&[align=center]]:text-center [&[align=right]]:text-right"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="border-r last:border-r-0 border-gray-200 px-4 py-3 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
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
