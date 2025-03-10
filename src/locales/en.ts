export default {
  common: {
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    selectTopic: 'Select a topic to view its content',
    generateAnswer: 'Generating answer...',
    send: 'Send',
    you: 'You',
    assistant: 'Assistant',
    errors: {
      failedToGetAnswer: "Sorry, I couldn't generate an answer. Please try again."
    },
    save: 'Save',
    saved: {
      title: 'Saved Items',
      empty: 'No saved items yet',
      delete: 'Delete',
      interview: 'Interview Questions',
      knowledge: 'Knowledge Base'
    },
    settings: "Setting"
  },
  nav: {
    home: 'Interview Hub',
    knowledgeBase: '📚 Knowledge Base',
    interviewQuestions: '❓ Interview Questions',
    chat: 'Chat with AI',
    settings: 'Setting',
  },
  home: {
    hero: {
      title: 'Interview Preparation Hub',
      subtitle: 'Your comprehensive platform for mastering technical interviews. Track your progress, practice with AI-powered responses, and prepare effectively.',
      apiKeyGuideLink: "Get API Keys",
      apiKeyGuideDescription: "To get started, you need to obtain the necessary API keys. Please visit the "
    },
    features: {
      knowledgeBase: {
        title: 'Knowledge Base',
        description: 'Track your learning progress across different topics and mark your understanding level.',
        action: 'Explore Knowledge Base',
      },
      interviewQuestions: {
        title: 'Interview Questions',
        description: 'Practice with our curated list of technical questions and get AI-powered responses.',
        action: 'Start Practicing',
      },
      chat: {
        title: 'AI Chat Assistant',
        description: 'Have a conversation with our AI assistant to get instant help with your programming questions.',
        action: 'Start chatting'
      }
    },
    stats: {
      knowledgeTopics: {
        value: '100+',
        label: 'Knowledge Topics',
      },
      questions: {
        value: '500+',
        label: 'Interview Questions',
      },
      categories: {
        value: '7',
        label: 'Categories',
      },
      aiSupport: {
        value: '24/7',
        label: 'AI Support',
      },
    },
    chat: {
      welcome: "Welcome, {{name}}! How can I help you today?",
      startPrompt: "Ask me anything about programming, interviews, or technical topics!",
      inputPlaceholder: "Type your message here..."
    },
  },
  knowledgeBase: {
    title: 'Knowledge Base',
    searchPlaceholder: 'Search topics...',
    selectTopic: 'Select a topic from the list to see its explanation',
    status: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      notStarted: 'Not Started'
    },
    messages: {
      loading: 'Generating explanation...',
      selectTopic: 'Select a topic from the list to view its explanation',
      selectFromSidebar: 'Please select a topic from the sidebar to view its content',
      error: 'Failed to generate explanation. Please try again.',
      rateLimitError: 'API rate limit exceeded. Please try again later.',
      cacheClearedSuccess: 'All cached content has been cleared',
      cacheClearError: 'Failed to clear cached content'
    },
    actions: {
      getAnswer: 'Get AI Answer',
      regenerate: 'Regenerate explanation',
      clearCache: 'Clear cached content'
    },
    prompts: {
      chatInstruction: 'Provide a detailed explanation of this topic: {{topic}}'
    },
    models: {
      select: 'Select Model'
    }
  },
  interviewQuestions: {
    title: 'Interview Questions',
    searchPlaceholder: 'Search questions...',
    tooltips: {
      search: 'Search through all questions',
      shuffle: 'Randomly shuffle selected category questions',
      collapse: 'Collapse category selection'
    },
    categories: {
      select: 'Select Categories',
      selected: 'categories',
      more: 'more',
      selectCount: '{{selected}}/{{total}} categories'
    },
    messages: {
      loading: 'Generating answer...',
      selectQuestion: 'Select a question to see the suggested answer',
      selectFromSidebar: 'Select a question from the sidebar to view the answer.',
      rateLimitError: 'API rate limit exceeded. Please try again later or check your API quota.',
      error: 'Sorry, failed to generate response. Please try again.',
      cacheClearedSuccess: 'All cached answers have been cleared',
      cacheClearError: 'Failed to clear cached answers'
    },
    prompts: {
      chatInstruction: 'Please provide a detailed answer in English for this interview question: {{question}}'
    },
    models: {
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'gpt-4-turbo-preview': 'GPT-4 Turbo'
    },
    actions: {
      regenerate: 'Regenerate answer',
      clearCache: 'Clear cached answers'
    }
  },
  chat: {
    inputPlaceholder: 'Ask a question...',
    saveAsQuestion: 'Save as Interview Question',
    selectCategory: 'Select a category',
    prompts: {
      default: '{{input}}'
    },
    errors: {
      noResponse: 'No response from AI',
      unknown: 'An unknown error occurred',
      apiError: 'Failed to get response from ChatGPT',
      invalidKey: 'Invalid API key',
      rateLimit: 'Rate limit exceeded. Please try again later.',
      networkError: 'Network connection error',
      geminiApiError: 'Gemini API Error: {message}',
      openchatApiError: 'OpenChat API Error: {message}',
      invalidApiKey: 'Invalid API key for {model}',
      endpointNotFound: 'API endpoint not found for {model}'
    },
    models: {
      select: 'Select model',
      premium: 'Premium'
    },
    welcome: {
      greeting: "Hello! I'm AI Assistant",
      capabilities: "I can help you with:\n- 📚 Programming concepts\n- 💡 Technical solutions\n- 🔍 Code analysis\n- 📝 Unit testing\n- ⚡ Performance optimization"
    },
    input: {
      placeholder: "Type your question...",
      hint: "Press Enter to send, Shift + Enter for new line"
    },
    header: {
      title: "AI Chat Assistant"
    },
    actions: {
      send: "Send",
      retry: "Retry",
      clear: "Clear chat",
      save: "Save to questions"
    }
  },
  knowledge: {
    title: "Knowledge Base",
    searchPlaceholder: "Search topics...",
    selectTopic: "Please select a topic from the list on the left to see its explanation.",
    noResults: "No topics found for your search",
    followUp: {
      title: "Ask Follow-up Questions",
      inputPlaceholder: "Ask a question about this topic..."
    }
  },
  interview: {
    title: "Interview Questions",
    searchPlaceholder: "Search questions...",
    selectQuestion: "Select a question from the list to see the suggested answer.",
    messages: {
      selectFromSidebar: "Please select a question from the sidebar"
    },
    categories: {
      select: "Select categories",
      selectCount: "{{selected}}/{{total}} categories",
      more: "more"
    },
    tooltips: {
      search: "Search questions",
      shuffle: "Shuffle selected categories",
      collapse: "Collapse categories"
    }
  },
  auth: {
    login: "Sign In",
    loginTitle: "Welcome Back!",
    logout: "Sign Out",
    enterEmail: "Enter your email",
    requestLogin: "Login to Save Your Chat History",
  },
  settings: {
    title: "Settings",
    tabs: {
      apiKeys: "API Keys"
    },
    apiKeys: {
      info: "Enter your API keys below. Your keys are stored securely in your browser and never sent to our servers.",
      openai: {
        label: "OpenAI API Key",
        help: "Get your API key from OpenAI dashboard"
      },
      gemini: {
        label: "Google Gemini API Key",
        help: "Get your API key from Google Cloud Console"
      },
      mistral: {
        label: "Mistral API Key",
        help: "Get your API key from Mistral AI dashboard"
      },
      openchat: {
        label: "OpenChat API Key",
        help: "Get your API key from OpenChat dashboard"
      }
    },
    save: "Save Settings",
    saved: "Settings saved successfully!",
    showKeys: 'Show API Keys',
    hideKeys: 'Hide API Keys',
    upload: "Upload API Keys",
    downloadSample: "Download Sample API Keys"
  },
  apiKeyForm: {
    title: "Enter Google Sheet API Key and Spreadsheet ID",
    labels: {
      apiKey: "Google Sheet API Key",
      spreadsheetId: "Spreadsheet ID"
    },
    placeholders: {
      apiKey: "Enter your API key",
      spreadsheetId: "Enter your Spreadsheet ID"
    },
    errors: {
      required: "Both API key and Spreadsheet ID are required."
    },
    buttons: {
      fetchData: "Fetch Data"
    }
  },
  apiKeyGuide: {
    title: "API Key Guide",
    googleSheet: {
      title: "Google Sheet API Key",
      description: "Follow these steps to obtain your Google Sheet API key:",
      steps: {
        "1": "Go to the Google Cloud Console.",
        "2": "Create a new project or select an existing project.",
        "3": "Navigate to the 'APIs & Services' section and enable the Google Sheets API.",
        "4": "Create credentials for the API and copy the API key."
      },
      link: "Google Cloud Console"
    },
    openai: {
      title: "OpenAI API Key",
      description: "Follow these steps to obtain your OpenAI API key:",
      steps: {
        "1": "Go to the OpenAI website and sign in to your account.",
        "2": "Navigate to the API section.",
        "3": "Generate a new API key and copy it."
      },
      link: "OpenAI Signup"
    },
    googleClient: {
      title: "Google Client ID and Secret",
      description: "Follow these steps to obtain your Google Client ID and Secret:",
      steps: {
        "1": "Go to the Google Cloud Console.",
        "2": "Create a new project or select an existing project.",
        "3": "Navigate to the 'APIs & Services' section and enable the Google OAuth 2.0 API.",
        "4": "Create OAuth 2.0 credentials and copy the Client ID and Secret."
      },
      link: "Google Cloud Console Credentials"
    }
  }
}