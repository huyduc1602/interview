export default {
  common: {
    search: 'Tìm kiếm',
    loading: 'Đang tải...',
    error: 'Lỗi',
    selectTopic: 'Chọn một chủ đề để xem nội dung',
    generateAnswer: 'Đang tạo câu trả lời...',
    saved: {
      title: 'Mục đã lưu',
      empty: 'Chưa có mục nào được lưu',
      delete: 'Xóa',
      interview: 'Câu hỏi phỏng vấn',
      knowledge: 'Cơ sở kiến thức'
    },
    settings: "Cài đặt",
    save: "Lưu",
    remove: "Xóa",
    send: "Gửi",
    you: "Bạn",
    assistant: "Trợ lý",
    errors: {
      failedToGetAnswer: "Xin lỗi, tôi không thể tạo ra câu trả lời. Vui lòng thử lại."
    }
  },
  nav: {
    home: 'Trung tâm Phỏng vấn',
    knowledgeBase: '📚 Cơ sở Kiến Thức',
    interviewQuestions: '❓ Câu hỏi Phỏng vấn',
    chat: '🤖 Trò chuyện với AI',
    settings: 'Cài đặt',
  },
  home: {
    hero: {
      title: 'Trung Tâm Chuẩn Bị Phỏng Vấn',
      subtitle: 'Nền tảng toàn diện để thành thạo các cuộc phỏng vấn kỹ thuật. Theo dõi tiến độ, luyện tập với trí tuệ nhân tạo và chuẩn bị hiệu quả.',
      apiKeyGuideLink: "Lấy API Keys",
      apiKeyGuideDescription: "Để bắt đầu, bạn cần lấy các khóa API cần thiết. Vui lòng truy cập "
    },
    features: {
      knowledgeBase: {
        title: 'Cơ Sở Kiến Thức',
        description: 'Theo dõi tiến độ học tập qua các chủ đề và đánh dấu mức độ hiểu biết của bạn.',
        action: 'Khám Phá Kiến Thức',
      },
      interviewQuestions: {
        title: 'Câu Hỏi Phỏng Vấn',
        description: 'Luyện tập với danh sách câu hỏi kỹ thuật được tuyển chọn và nhận câu trả lời từ AI.',
        action: 'Bắt Đầu Luyện Tập',
      },
      chat: {
        title: 'Trợ lý Chat AI',
        description: 'Trò chuyện với trợ lý AI của chúng tôi để nhận được sự trợ giúp tức thì cho các câu hỏi lập trình của bạn.',
        action: 'Bắt đầu trò chuyện'
      }
    },
    stats: {
      knowledgeTopics: {
        value: '100+',
        label: 'Chủ Đề Kiến Thức',
      },
      questions: {
        value: '500+',
        label: 'Câu Hỏi Phỏng Vấn',
      },
      categories: {
        value: '7',
        label: 'Danh Mục',
      },
      aiSupport: {
        value: '24/7',
        label: 'Hỗ Trợ AI',
      },
    },
    chat: {
      welcome: "Xin chào, {{name}}! Tôi có thể giúp gì cho bạn hôm nay?",
      startPrompt: "Hãy hỏi tôi bất cứ điều gì về lập trình, phỏng vấn hoặc các chủ đề kỹ thuật!",
      inputPlaceholder: "Nhập tin nhắn của bạn tại đây...",
    }
  },
  knowledgeBase: {
    title: 'Cơ sở kiến thức',
    searchPlaceholder: 'Tìm kiếm chủ đề...',
    status: {
      pending: 'Chưa học',
      inProgress: 'Đang học',
      completed: 'Hoàn thành',
      notStarted: 'Chưa học'
    },
    messages: {
      loading: 'Đang tạo giải thích...',
      selectTopic: 'Chọn một chủ đề từ danh sách để xem giải thích',
      selectFromSidebar: 'Vui lòng chọn một chủ đề từ thanh bên để xem nội dung.',
      error: 'Không thể tạo giải thích. Vui lòng thử lại.',
      rateLimitError: 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.',
      cacheClearedSuccess: 'Đã xóa tất cả nội dung trong bộ nhớ đệm',
      cacheClearError: 'Không thể xóa bộ nhớ đệm'
    },
    actions: {
      getAnswer: 'Nhận câu trả lời AI',
      regenerate: 'Tạo lại nội dung',
      clearCache: 'Xóa bộ nhớ đệm'
    },
    prompts: {
      chatInstruction: 'Giải thích chi tiết chủ đề sau: {{topic}}'
    },
    models: {
      select: 'Chọn Model'
    },
  },
  interviewQuestions: {
    title: 'Câu Hỏi Phỏng Vấn',
    searchPlaceholder: 'Tìm kiếm câu hỏi...',
    tooltips: {
      search: 'Tìm kiếm trong tất cả câu hỏi',
      shuffle: 'Xáo trộn ngẫu nhiên câu hỏi từ danh mục đã chọn',
      unShuffle: 'Trở lại chế độ xem bình thường',
      collapse: 'Thu gọn lựa chọn danh mục',
      selectCategories: "Chọn danh mục cần hiển thị"
    },
    categories: {
      select: 'Chọn Danh Mục',
      selected: 'danh mục',
      more: 'thêm',
      selectCount: '{{selected}}/{{total}} danh mục'
    },
    messages: {
      loading: 'Đang tạo câu trả lời...',
      selectQuestion: 'Chọn một câu hỏi để xem gợi ý câu trả lời',
      selectFromSidebar: 'Chọn một câu hỏi từ thanh bên để xem câu trả lời.',
      rateLimitError: 'Đã vượt quá giới hạn API. Vui lòng thử lại sau hoặc kiểm tra hạn mức API của bạn.',
      error: 'Xin lỗi, không thể tạo câu trả lời. Vui lòng thử lại.',
      cacheClearedSuccess: 'Đã xóa tất cả câu trả lời trong bộ nhớ đệm',
      cacheClearError: 'Không thể xóa bộ nhớ đệm'
    },
    prompts: {
      chatInstruction: 'Vui lòng cung cấp câu trả lời chi tiết bằng tiếng Việt cho câu hỏi phỏng vấn này: {{question}}'
    },
    models: {
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'gpt-4-turbo-preview': 'GPT-4 Turbo'
    },
    actions: {
      regenerate: 'Tạo lại câu trả lời',
      selectModel: 'Chọn model',
      clearCache: 'Xóa bộ nhớ đệm'
    }
  },
  chat: {
    inputPlaceholder: 'Đặt câu hỏi...',
    saveAsQuestion: 'Lưu thành Câu hỏi Phỏng vấn',
    selectCategory: 'Chọn một danh mục',
    prompts: {
      default: '{{input}}'
    },
    errors: {
      noResponse: 'Không nhận được phản hồi từ AI',
      unknown: 'Đã xảy ra lỗi không xác định',
      apiError: 'Lỗi API ChatGPT: {message}',
      invalidKey: 'API key không hợp lệ',
      rateLimit: 'Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.',
      networkError: 'Lỗi kết nối mạng',
      geminiApiError: 'Lỗi API Gemini: {message}',
      openchatApiError: 'Lỗi API OpenChat: {message}',
      invalidApiKey: 'API key không hợp lệ cho {model}',
      endpointNotFound: 'Không tìm thấy endpoint API cho {model}'
    },
    models: {
      select: 'Chọn mô hình',
      premium: 'Premium'
    },
    welcome: {
      greeting: "Xin chào! Tôi là AI Assistant",
      capabilities: "Tôi có thể giúp bạn:\n- 📚 Giải thích khái niệm lập trình\n- 💡 Đề xuất giải pháp kỹ thuật\n- 🔍 Phân tích và review code\n- 📝 Tạo unit test\n- ⚡ Tối ưu hiệu suất code"
    },
    input: {
      placeholder: "Nhập câu hỏi của bạn...",
      hint: "Nhấn Enter để gửi, Shift + Enter để xuống dòng"
    },
    header: {
      title: "AI Chat Assistant"
    },
    actions: {
      send: "Gửi",
      retry: "Thử lại",
      clear: "Xóa chat",
      save: "Lưu vào câu hỏi"
    }
  },
  knowledge: {
    title: "Cơ sở kiến thức",
    searchPlaceholder: "Tìm kiếm chủ đề...",
    selectTopic: "Vui lòng chọn một chủ đề từ danh sách bên trái để xem giải thích.",
    noResults: "Không tìm thấy chủ đề nào phù hợp",
    followUp: {
      title: "Đặt câu hỏi thêm",
      inputPlaceholder: "Đặt câu hỏi về chủ đề này..."
    }
  },
  interview: {
    title: "Câu hỏi phỏng vấn",
    searchPlaceholder: "Tìm kiếm câu hỏi...",
    selectQuestion: "Chọn một câu hỏi từ danh sách để xem câu trả lời được gợi ý.",
    messages: {
      selectFromSidebar: "Vui lòng chọn một câu hỏi từ thanh bên"
    },
    categories: {
      select: "Chọn danh mục",
      selectCount: "{{selected}}/{{total}} danh mục",
      more: "more"
    },
    tooltips: {
      search: "Tìm kiếm câu hỏi",
      shuffle: "Xáo trộn các danh mục đã chọn",
      collapse: "Thu gọn các danh mục"
    },
    actions: {
      regenerate: "Làm mới câu trả lời"
    }
  },
  auth: {
    login: "Đăng nhập",
    loginTitle: "Chào mừng trở lại!",
    logout: "Đăng xuất",
    enterEmail: "Nhập địa chỉ email",
    requestLogin: "Đăng nhập để xem lịch sử chat",
    loginLocal: "Đăng nhập trên máy",
    signInWithGithub: "Đăng nhập với GitHub",
    signInWithGoogle: "Đăng nhập với Google",
    signingIn: "Đang đăng nhập...",
    redirecting: "Đang chuyển hướng...",
    pleaseWait: "Vui lòng đợi...",
    error: {
      title: "Lỗi xác thực",
      returnToHome: "Quay lại trang chủ",
      authFailed: "Xác thực không thành công. Vui lòng thử lại.",
      duringAuth: "Lỗi trong quá trình xác thực. Vui lòng thử lại.",
    },
    loginSection: {
      title: "Phần đăng nhập",
      description: "Vui lòng đăng nhập để lưu lịch sử trò chuyện của bạn.",
      local: "Đăng nhập cục bộ",
      social: "Đăng nhập tài khoản online",
      localNote: 'Khi đăng nhập cục bộ dữ liệu của bạn được lưu trên trình duyệt và không gửi tới máy chủ của chúng tôi.',
      socialNote: 'Khi đăng nhập online chỉ cần bạn đăng nhập lại dữ liệu sẽ được lưu theo tài khoản đăng nhập.'
    },
    processingAuthentication: "Đang xử lý xác thực...",
    backToHome: 'Về trang chủ'
  },
  settings: {
    title: "Cài đặt",
    tabs: {
      apiKeys: "Khóa API",
      features: "Tính năng"
    },
    apiKeys: {
      info: "Nhập khóa API của bạn bên dưới. Các khóa của bạn được lưu trữ an toàn trong trình duyệt và không bao giờ được gửi đến máy chủ của chúng tôi.",
      openai: {
        label: "Khóa API OpenAI",
        help: "Lấy khóa API từ bảng điều khiển OpenAI"
      },
      gemini: {
        label: "Khóa API Google Gemini",
        help: "Lấy khóa API từ Google Cloud Console"
      },
      mistral: {
        label: "Khóa API Mistral",
        help: "Lấy khóa API từ bảng điều khiển Mistral AI"
      },
      openchat: {
        label: "Khóa API OpenChat",
        help: "Lấy khóa API từ bảng điều khiển OpenChat"
      },
      googleSheetApiKey: {
        label: "Khóa API Google Sheet",
        help: "Nhập khóa API Google Sheet của bạn."
      },
      spreadsheetId: {
        label: "ID Bảng tính",
        help: "Nhập ID Bảng tính của bạn."
      },
      sheetNameKnowledgeBase: {
        label: "Tên trang tính cơ sở tri thức",
        help: "Nhập tên trang tính cho Cơ sở kiến thức."
      },
      sheetNameInterviewQuestions: {
        label: "Tên trang tính câu hỏi phỏng vấn",
        help: "Nhập tên trang tính cho Câu hỏi phỏng vấn."
      },
      modelKeys: {
        title: "Khóa API mô hình AI",
        description: "Khóa API cho các mô hình AI được sử dụng trong ứng dụng."
      },
      googleSheets: {
        title: "Tích hợp Google Trang tính",
        description: "Cài đặt tích hợp nguồn dữ liệu Google Trang tính."
      }
    },
    features: {
      title: "Cài đặt tính năng",
      info: "Kiểm soát các tính năng và hành vi của ứng dụng.",
      autoSaveKnowledge: {
        label: "Tự động lưu Cơ sở kiến thức",
        description: "Tự động lưu câu trả lời khi xem nội dung cơ sở kiến ​​thức"
      },
      autoSaveInterview: {
        label: "Tự động lưu câu hỏi phỏng vấn",
        description: "Tự động lưu câu trả lời khi xem câu hỏi phỏng vấn"
      },
      autoSave: {
        title: "Lưu câu hỏi tự động",
        description: "Cấu hình xem câu hỏi có nên được lưu tự động không.",
        knowledge: "Tự động lưu câu hỏi trong Cơ sở kiến ​​thức",
        knowledgeHelp: "Tự động lưu câu trả lời khi xem nội dung cơ sở kiến ​​thức.",
        interview: "Tự động lưu câu hỏi phỏng vấn",
        interviewHelp: "Tự động lưu câu trả lời khi xem câu hỏi phỏng vấn."
      },
      saveHistory: {
        title: "Lịch sử trò chuyện",
        description: "Cấu hình cài đặt lịch sử trò chuyện cho các câu hỏi tiếp theo.",
        knowledge: "Lưu lịch sử trò chuyện trong Cơ sở kiến ​​thức",
        knowledgeHelp: "Lưu câu hỏi và câu trả lời tiếp theo cho các mục cơ sở kiến ​​thức.",
        interview: "Lưu lịch sử trò chuyện trong Phỏng vấn",
        interviewHelp: "Lưu câu hỏi và câu trả lời tiếp theo cho các câu hỏi phỏng vấn."
      }
    },
    storageInfo: {
      cloud: "Cài đặt của bạn được lưu trữ an toàn trên đám mây và có thể truy cập từ bất kỳ thiết bị nào bạn đăng nhập vào.",
      local: "Cài đặt của bạn chỉ được lưu trữ cục bộ trên thiết bị này."
    },
    save: "Lưu Cài đặt",
    saved: "Đã lưu cài đặt thành công!",
    showKeys: 'Hiển thị API Keys',
    hideKeys: 'Ẩn API Keys',
    upload: "Tải lên khóa API",
    downloadSample: "Tải xuống mẫu khóa API",
    downloadSampleCsv: "Tải xuống mẫu file CSV"
  },
  apiKeyForm: {
    title: "Nhập Khóa API Google Sheet và ID Bảng tính",
    labels: {
      apiKey: "Khóa API Google Sheet",
      spreadsheetId: "ID Bảng tính",
      sheetName: "Tên trang"
    },
    placeholders: {
      apiKey: "Nhập khóa API của bạn",
      spreadsheetId: "Nhập ID Bảng tính của bạn",
      sheetName: "Nhập tên trang"
    },
    errors: {
      required: "Cần nhập cả khóa API và ID Bảng tính"
    },
    buttons: {
      fetchData: "Lấy dữ liệu"
    },
    submit: "Lưu"
  },
  apiKeyGuide: {
    title: "Hướng dẫn API Key",
    googleSheet: {
      title: "Google Sheet API Key",
      description: "Thực hiện theo các bước sau để lấy Google Sheet API key của bạn:",
      steps: {
        1: "Truy cập Google Cloud Console.",
        2: "Tạo dự án mới hoặc chọn dự án hiện có.",
        3: "Điều hướng đến phần 'API & Dịch vụ' và bật Google Sheets API.",
        4: "Tạo thông tin xác thực cho API và sao chép khóa API."
      },
      link: "Google Cloud Console"
    },
    openai: {
      title: "OpenAI API Key",
      description: "Thực hiện theo các bước sau để lấy OpenAI API key của bạn:",
      steps: {
        1: "Truy cập trang web OpenAI và đăng nhập vào tài khoản của bạn.",
        2: "Điều hướng đến phần API.",
        3: "Tạo khóa API mới và sao chép khóa đó."
      },
      link: "Đăng ký OpenAI"
    },
    googleClient: {
      title: "Google Client ID và Bí mật",
      description: "Thực hiện theo các bước sau để lấy Google Client ID và Bí mật của bạn:",
      steps: {
        1: "Truy cập Google Cloud Console.",
        2: "Tạo dự án mới hoặc chọn dự án hiện có.",
        3: "Điều hướng đến phần 'API & Dịch vụ' và bật Google OAuth 2.0 API.",
        4: "Tạo thông tin xác thực OAuth 2.0 và sao chép Client ID và Bí mật."
      },
      link: "Thông tin xác thực Google Cloud Console"
    },
    googleGemini: {
      title: "Google Gemini API Key",
      description: "Thực hiện theo các bước sau để lấy Google Gemini API key.",
      steps: {
        1: "Truy cập Google Cloud Console.",
        2: "Tạo dự án mới hoặc chọn dự án hiện có.",
        3: "Bật Google Gemini API.",
        4: "Tạo thông tin xác thực cho khóa API."

      },
      link: "Đi tới Google Cloud Console"
    },
    mistral: {
      title: "Mistral API Key",
      description: "Thực hiện theo các bước sau để lấy khóa API Mistral của bạn.",
      steps: {
        1: "Truy cập trang web Mistral API.",
        2: "Đăng ký tài khoản.",
        3: "Tạo khóa API mới."
      },
      link: "Truy cập Mistral API"
    },
    openChat: {
      title: "OpenChat API Key",
      description: "Thực hiện theo các bước sau để lấy khóa API OpenChat của bạn.",
      steps: {
        1: "Truy cập trang web OpenChat.",
        2: "Đăng ký tài khoản.",
        3: "Tạo khóa API mới."
      },
      link: "Truy cập OpenChat"
    },
    spreadsheetId: {
      title: "ID bảng tính",
      description: "Thực hiện theo các bước sau để lấy ID bảng tính Google của bạn.",
      steps: {
        1: "Mở bảng tính Google của bạn",
        2: "Xem URL trong trình duyệt của bạn",
        3: "ID bảng tính là chuỗi dài trong URL giữa '/d/' và '/edit'"
      },
      link: "Đi tới Google Trang tính"
    }
  },
  notFound: {
    title: "Không tìm thấy trang",
    message: "Xin lỗi, trang bạn đang tìm không tồn tại.",
    homeLink: "Về trang chủ"
  },
  models: {
    groups: {
      openai: "OpenAI",
      free: "Các lựa chọn thay thế miễn phí"
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
      premium: "Cao cấp",
      google: "Google",
      mistral: "Mistral",
      free: "Miễn phí"
    }
  },
};