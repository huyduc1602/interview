import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// Thêm các language supports nếu cần thiết
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';

// Đăng ký ngôn ngữ 
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface MarkdownContentProps {
    content: string;
    className?: string;
}

interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                console.log('Code copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy code:', err);
            });
    };

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
            "prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded dark:prose-code:bg-gray-800",
            className
        )}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children, ...props }: CodeProps) {
                        const match = /language-(\w+)/.exec(className || '');
                        const code = String(children).replace(/\n$/, '');

                        return !inline ? (
                            <div className="relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleCopyCode(code)}
                                        className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        aria-label="Copy code to clipboard"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match ? match[1] : ''}
                                    PreTag="div"
                                    customStyle={{
                                        padding: '1rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.5',
                                        margin: 0
                                    }}
                                    {...props}
                                >
                                    {code}
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