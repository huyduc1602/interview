import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// Define a mapping of languages to their import functions
const languageMap: Record<string, () => Promise<any>> = {
    jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
    typescript: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
    ts: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
    javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
    js: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
    css: () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
    python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
    py: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
    java: () => import('react-syntax-highlighter/dist/esm/languages/prism/java'),
    php: () => import('react-syntax-highlighter/dist/esm/languages/prism/php'),
    go: () => import('react-syntax-highlighter/dist/esm/languages/prism/go'),
    ruby: () => import('react-syntax-highlighter/dist/esm/languages/prism/ruby'),
    rust: () => import('react-syntax-highlighter/dist/esm/languages/prism/rust'),
    swift: () => import('react-syntax-highlighter/dist/esm/languages/prism/swift'),
    c: () => import('react-syntax-highlighter/dist/esm/languages/prism/c'),
    cpp: () => import('react-syntax-highlighter/dist/esm/languages/prism/cpp'),
    'c++': () => import('react-syntax-highlighter/dist/esm/languages/prism/cpp'),
    csharp: () => import('react-syntax-highlighter/dist/esm/languages/prism/csharp'),
    'c#': () => import('react-syntax-highlighter/dist/esm/languages/prism/csharp'),
    sql: () => import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
    json: () => import('react-syntax-highlighter/dist/esm/languages/prism/json'),
    yaml: () => import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
    yml: () => import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
    bash: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
    shell: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
    markdown: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
    md: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
    html: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
    xml: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
    scala: () => import('react-syntax-highlighter/dist/esm/languages/prism/scala'),
    kotlin: () => import('react-syntax-highlighter/dist/esm/languages/prism/kotlin'),
    dart: () => import('react-syntax-highlighter/dist/esm/languages/prism/dart'),
};

// Modify the loadLanguages function to properly handle the import response
const registerLanguage = async (lang: string): Promise<string | null> => {
    if (languageMap[lang]) {
        try {
            const module = await languageMap[lang]();
            // Handle both ESM and CJS import formats
            const language = module.default || module;
            SyntaxHighlighter.registerLanguage(lang, language);
            return lang;
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
            return null;
        }
    }
    return null;
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
                if (!loadedLanguages.includes(lang)) {
                    return registerLanguage(lang);
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
                            <pre className="relative group my-4">
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
                                    PreTag="pre"
                                    {...props}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            </pre>
                        );
                    },
                    p(props: React.ComponentPropsWithoutRef<'p'>) {
                        const children = React.Children.toArray(props.children);
                        const hasCodeBlock = children.some(child =>
                            React.isValidElement(child) &&
                            (child.type === 'pre' || child.type === SyntaxHighlighter)
                        );

                        if (hasCodeBlock) {
                            return <>{props.children}</>;
                        }

                        return <p {...props} />;
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}