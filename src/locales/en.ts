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
    chat: '🤖 Chat with AI',
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
    save: "Save",
    remove: "Remove",
    send: "Send",
    you: "You",
    assistant: "Trợ lý",
    errors: {
      failedToGetAnswer: "Failed to generate answer. Please try again."
    }
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
      unShuffle: 'Return to normal view',
      collapse: 'Collapse category selection',
      selectCategories: "Select the category to display"
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
    },
    actions: {
      regenerate: "Refresh answer"
    }
  },
  auth: {
    login: "Log in",
    loginTitle: "Welcome Back!",
    logout: "Sign Out",
    enterEmail: "Enter your email",
    requestLogin: "Login to Save Your Chat History",
    signInWithGithub: "Sign in with GitHub",
    loginLocal: "Log in on your computer",
    signingIn: "Signing in...",
    signInWithGoogle: "Sign in with Google",
    redirecting: "Redirecting...",
    pleaseWait: "Please wait...",
    error: {
      title: "Authentication Error",
      returnToHome: "Return to Home",
      authFailed: "Authentication failed. Please try again.",
      duringAuth: "Error during authentication. Please try again.",
    },
    loginSection: {
      title: "Login Section",
      description: "Please sign in to save your chat history.",
      local: "Local Authentication",
      social: "Social Login",
      localNote: 'When logged in locally your data is saved on the browser and is not sent to our servers.',
      socialNote: 'When you log in social, just log in again and the data will be saved according to the login account.'
    },
    processingAuthentication: "Processing authentication...",
    backToHome: 'Back to Home'
  },
  settings: {
    title: "Settings",
    tabs: {
      apiKeys: "API Keys",
      features: "Features"
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
      },
      googleSheetApiKey: {
        label: "Google Sheet API Key",
        help: "Enter your Google Sheet API key."
      },
      spreadsheetId: {
        label: "Spreadsheet ID",
        help: "Enter your Spreadsheet ID."
      },
      sheetNameKnowledgeBase: {
        label: "Knowledge Base Sheet Name",
        help: "Enter the sheet name for the Knowledge Base."
      },
      sheetNameInterviewQuestions: {
        label: "Interview Questions Sheet Name",
        help: "Enter the sheet name for the Interview Questions."
      },
      modelKeys: {
        title: "AI Model API Keys",
        description: "API keys for AI models used in the application."
      },
      googleSheets: {
        title: "Google Sheets Integration",
        description: "Settings for Google Sheets data source integration."
      }
    },
    features: {
      title: "Feature Settings",
      info: "Control application features and behaviors.",
      autoSaveKnowledge: {
        label: "Auto-save Knowledge Base",
        description: "Automatically save answers when viewing knowledge base content"
      },
      autoSaveInterview: {
        label: "Auto-save Interview Questions",
        description: "Automatically save answers when viewing interview questions"
      },
      autoSave: {
        title: "Automatic Question Saving",
        description: "Configure if questions should be saved automatically.",
        knowledge: "Auto-save Knowledge Base questions",
        knowledgeHelp: "Automatically save answers when viewing knowledge base content.",
        interview: "Auto-save Interview questions",
        interviewHelp: "Automatically save answers when viewing interview questions."
      },
      saveHistory: {
        title: "Chat History",
        description: "Configure chat history settings for follow-up questions.",
        knowledge: "Save Knowledge Base chat history",
        knowledgeHelp: "Store follow-up questions and answers for knowledge base items.",
        interview: "Save Interview chat history",
        interviewHelp: "Store follow-up questions and answers for interview questions."
      }
    },
    storageInfo: {
      cloud: "Your settings are stored securely in the cloud and will be available on any device you sign in to.",
      local: "Your settings are stored locally on this device only."
    },
    save: "Save Settings",
    saved: "Settings saved successfully!",
    showKeys: 'Show API Keys',
    hideKeys: 'Hide API Keys',
    upload: "Upload API Keys",
    downloadSample: "Download Sample API Keys",
    downloadSampleCsv: "Download Sample CSV"
  },
  apiKeyForm: {
    title: "Enter Google Sheet API Key and Spreadsheet ID",
    labels: {
      apiKey: "Google Sheet API Key",
      spreadsheetId: "Spreadsheet ID",
      sheetName: "Sheet Name"
    },
    placeholders: {
      apiKey: "Enter your API key",
      spreadsheetId: "Enter your Spreadsheet ID",
      sheetName: "Enter the sheet name"
    },
    errors: {
      required: "Both API key and Spreadsheet ID are required."
    },
    buttons: {
      fetchData: "Fetch Data"
    },
    submit: "Save"
  },
  apiKeyGuide: {
    title: "API Key Guide",
    googleSheet: {
      title: "Google Sheet API Key",
      description: "Follow these steps to obtain your Google Sheet API key:",
      steps: {
        1: "Go to the Google Cloud Console.",
        2: "Create a new project or select an existing project.",
        3: "Navigate to the 'APIs & Services' section and enable the Google Sheets API.",
        4: "Create credentials for the API and copy the API key."
      },
      link: "Google Cloud Console"
    },
    openai: {
      title: "OpenAI API Key",
      description: "Follow these steps to obtain your OpenAI API key:",
      steps: {
        1: "Go to the OpenAI website and sign in to your account.",
        2: "Navigate to the API section.",
        3: "Generate a new API key and copy it."
      },
      link: "OpenAI Signup"
    },
    googleClient: {
      title: "Google Client ID and Secret",
      description: "Follow these steps to obtain your Google Client ID and Secret:",
      steps: {
        1: "Go to the Google Cloud Console.",
        2: "Create a new project or select an existing project.",
        3: "Navigate to the 'APIs & Services' section and enable the Google OAuth 2.0 API.",
        4: "Create OAuth 2.0 credentials and copy the Client ID and Secret."
      },
      link: "Google Cloud Console Credentials"
    },
    googleGemini: {
      title: "Google Gemini API Key",
      description: "Follow these steps to obtain your Google Gemini API key.",
      steps: {
        1: "Go to the Google Cloud Console.",
        2: "Create a new project or select an existing project.",
        3: "Enable the Google Gemini API.",
        4: "Create credentials for the API key."
      },
      link: "Go to Google Cloud Console"
    },
    mistral: {
      title: "Mistral API Key",
      description: "Follow these steps to obtain your Mistral API key.",
      steps: {
        1: "Go to the Mistral API website.",
        2: "Sign up for an account.",
        3: "Generate a new API key."
      },
      link: "Go to Mistral API"
    },
    openChat: {
      title: "OpenChat API Key",
      description: "Follow these steps to obtain your OpenChat API key.",
      steps: {
        1: "Go to the OpenChat website.",
        2: "Sign up for an account.",
        3: "Generate a new API key."
      },
      link: "Go to OpenChat"
    },
    spreadsheetId: {
      title: "Spreadsheet ID",
      description: "Follow these steps to obtain your Google Spreadsheet ID.",
      steps: {
        1: "Open your Google Spreadsheet.",
        2: "Look at the URL in your browser.",
        3: "The Spreadsheet ID is the long string in the URL between '/d/' and '/edit'."
      },
      link: "Go to Google Sheets"
    }
  },
  notFound: {
    title: "Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    homeLink: "Go to Home"
  },
  models: {
    groups: {
      openai: "OpenAI",
      free: "Free Alternatives"
    },
    openai: {
      gpt35: "GPT-3.5 Turbo",
      gpt4: "GPT-4 Turbo"
    },
    google: {
      gemini: "Gemini Pro"
    },
    mistral: {
      small: "Mistral Small"
    },
    openchat: {
      35: "OpenChat 3.5"
    },
    badges: {
      premium: "Premium",
      google: "Google",
      mistral: "Mistral",
      free: "Free"
    }
  },
}