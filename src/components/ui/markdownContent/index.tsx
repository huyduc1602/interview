import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

// Updated type definition for Prism styles
type PrismTheme = {
    [key: string]: React.CSSProperties;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
    return (
        <div className={cn(
            "prose prose-slate max-w-none dark:prose-invert",
            // Headings
            "prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-200",
            // Links
            "prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-purple-400",
            // Lists
            "prose-ul:my-2 prose-li:my-0 prose-li:marker:text-gray-400",
            // Code blocks
            "prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg",
            // Inline code
            "prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded",
            className
        )}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
                    code({ inline, children, className, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                        return !inline ? (
                            <div className="relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(String(children))}
                                        className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={oneDark as PrismTheme}
                                    customStyle={{
                                        padding: '1rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.5',
                                        margin: 0
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}