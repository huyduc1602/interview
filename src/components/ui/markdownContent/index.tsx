import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// Define a mapping of languages to their import functions
const languageMap: Record<string, () => Promise<any>> = {
    jsx: () => import('react-syntax-highlighter/dist/cjs/languages/prism/jsx').then(m => m.default),
    typescript: () => import('react-syntax-highlighter/dist/cjs/languages/prism/typescript').then(m => m.default),
    ts: () => import('react-syntax-highlighter/dist/cjs/languages/prism/typescript').then(m => m.default),
    javascript: () => import('react-syntax-highlighter/dist/cjs/languages/prism/javascript').then(m => m.default),
    js: () => import('react-syntax-highlighter/dist/cjs/languages/prism/javascript').then(m => m.default),
    css: () => import('react-syntax-highlighter/dist/cjs/languages/prism/css').then(m => m.default),
    python: () => import('react-syntax-highlighter/dist/cjs/languages/prism/python').then(m => m.default),
    py: () => import('react-syntax-highlighter/dist/cjs/languages/prism/python').then(m => m.default),
    java: () => import('react-syntax-highlighter/dist/cjs/languages/prism/java').then(m => m.default),
    php: () => import('react-syntax-highlighter/dist/cjs/languages/prism/php').then(m => m.default),
    go: () => import('react-syntax-highlighter/dist/cjs/languages/prism/go').then(m => m.default),
    ruby: () => import('react-syntax-highlighter/dist/cjs/languages/prism/ruby').then(m => m.default),
    rust: () => import('react-syntax-highlighter/dist/cjs/languages/prism/rust').then(m => m.default),
    swift: () => import('react-syntax-highlighter/dist/cjs/languages/prism/swift').then(m => m.default),
    c: () => import('react-syntax-highlighter/dist/cjs/languages/prism/c').then(m => m.default),
    cpp: () => import('react-syntax-highlighter/dist/cjs/languages/prism/cpp').then(m => m.default),
    'c++': () => import('react-syntax-highlighter/dist/cjs/languages/prism/cpp').then(m => m.default),
    csharp: () => import('react-syntax-highlighter/dist/cjs/languages/prism/csharp').then(m => m.default),
    'c#': () => import('react-syntax-highlighter/dist/cjs/languages/prism/csharp').then(m => m.default),
    sql: () => import('react-syntax-highlighter/dist/cjs/languages/prism/sql').then(m => m.default),
    json: () => import('react-syntax-highlighter/dist/cjs/languages/prism/json').then(m => m.default),
    yaml: () => import('react-syntax-highlighter/dist/cjs/languages/prism/yaml').then(m => m.default),
    yml: () => import('react-syntax-highlighter/dist/cjs/languages/prism/yaml').then(m => m.default),
    bash: () => import('react-syntax-highlighter/dist/cjs/languages/prism/bash').then(m => m.default),
    shell: () => import('react-syntax-highlighter/dist/cjs/languages/prism/bash').then(m => m.default),
    markdown: () => import('react-syntax-highlighter/dist/cjs/languages/prism/markdown').then(m => m.default),
    md: () => import('react-syntax-highlighter/dist/cjs/languages/prism/markdown').then(m => m.default),
    html: () => import('react-syntax-highlighter/dist/cjs/languages/prism/markup').then(m => m.default),
    xml: () => import('react-syntax-highlighter/dist/cjs/languages/prism/markup').then(m => m.default),
    scala: () => import('react-syntax-highlighter/dist/cjs/languages/prism/scala').then(m => m.default),
    kotlin: () => import('react-syntax-highlighter/dist/cjs/languages/prism/kotlin').then(m => m.default),
    dart: () => import('react-syntax-highlighter/dist/cjs/languages/prism/dart').then(m => m.default),
};

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
    const [loadedLanguages, setLoadedLanguages] = useState<string[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        // Detect languages from content using regex to find ```language blocks
        const languageRegex = /```(\w+)/g;
        const detectedLanguages = new Set<string>();
        let match;
        while ((match = languageRegex.exec(content)) !== null) {
            detectedLanguages.add(match[1]);
        }

        // Load detected languages
        const loadLanguages = async () => {
            const promises = Array.from(detectedLanguages).map(async (lang) => {
                if (languageMap[lang] && !loadedLanguages.includes(lang)) {
                    const language = await languageMap[lang]();
                    SyntaxHighlighter.registerLanguage(lang, language);
                    return lang;
                }
                return null;
            });

            const loaded = await Promise.all(promises);
            setLoadedLanguages((prev) => [...prev, ...loaded.filter(Boolean) as string[]]);
        };

        loadLanguages();
    }, [content, loadedLanguages]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopiedCode(code);
                setTimeout(() => setCopiedCode(null), 2000);
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
                    pre({ children }) {
                        // Return children directly to avoid creating unnecessary pre tag
                        return <>{children}</>;
                    },
                    code({ inline, className, children, ...props }: CodeProps) {
                        const match = /language-(\w+)/.exec(className || '');
                        const code = String(children).replace(/\n$/, '');

                        if (inline) {
                            return (
                                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <div className="relative group my-4">
                                <button
                                    onClick={() => handleCopyCode(code)}
                                    className="absolute right-2 top-2 px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition"
                                    aria-label="Copy code to clipboard"
                                >
                                    {copiedCode === code ? "Copied!" : "Copy"}
                                </button>
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match ? match[1] : ''}
                                    customStyle={{
                                        padding: '1rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.5',
                                        margin: 0
                                    }}
                                    PreTag="div"
                                    {...props}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            </div>
                        );
                    },
                    p({ node, children }) {
                        // Check if this paragraph only contains a code block
                        if (node && node.children) {
                            // Check if there's only one child and it's either a code element or a div wrapping a code element
                            const singleChild = node.children.length === 1 && node.children[0];
                            const isCodeBlock =
                                (singleChild && 'tagName' in singleChild && singleChild.tagName === 'code') ||
                                (singleChild && 'tagName' in singleChild && singleChild.tagName === 'div');

                            if (isCodeBlock) {
                                // Return the children directly, not wrapped in a paragraph
                                return <>{children}</>;
                            }
                        }
                        return <p>{children}</p>;
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}