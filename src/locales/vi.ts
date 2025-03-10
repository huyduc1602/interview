export default {
  common: {
    search: 'Tìm kiếm',
    loading: 'Đang tải...',
    error: 'Lỗi',
    selectTopic: 'Chọn một chủ đề để xem nội dung',
    generateAnswer: 'Đang tạo câu trả lời...',
    "send": "Gửi",
    "you": "Bạn",
    "assistant": "Trợ lý",
    errors: {
      failedToGetAnswer: "Xin lỗi, tôi không thể tạo ra câu trả lời. Vui lòng thử lại."
    },
    save: 'Lưu',
    saved: {
      title: 'Mục đã lưu',
      empty: 'Chưa có mục nào được lưu',
      delete: 'Xóa',
      interview: 'Câu hỏi phỏng vấn',
      knowledge: 'Cơ sở kiến thức'
    },
    settings: "Cài đặt"
  },
  nav: {
    home: 'Trung tâm Phỏng vấn',
    knowledgeBase: '📚 Cơ sở Kiến Thức',
    interviewQuestions: '❓ Câu hỏi Phỏng vấn',
    chat: 'Trò chuyện với AI',
    settings: 'Cài đặt',
  },
  home: {
    hero: {
      title: 'Trung Tâm Chuẩn Bị Phỏng Vấn',
      subtitle: 'Nền tảng toàn diện để thành thạo các cuộc phỏng vấn kỹ thuật. Theo dõi tiến độ, luyện tập với trí tuệ nhân tạo và chuẩn bị hiệu quả.',
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
      collapse: 'Thu gọn lựa chọn danh mục'
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
  auth: {
    login: "Đăng nhập",
    loginTitle: "Chào mừng trở lại!",
    logout: "Đăng xuất",
    enterEmail: "Nhập địa chỉ email",
    requestLogin: "Đăng nhập để xem lịch sử chat",
  },
  settings: {
    title: "Cài đặt",
    tabs: {
      apiKeys: "Khóa API"
    },
    apiKeys: {
      info: "Nhập khóa API của bạn bên dưới. Các khóa của bạn được lưu trữ an toàn trong trình duyệt và không bao giờ được gửi đến máy chủ của chúng tôi.",
      openai: {
        help: "Lấy khóa API từ bảng điều khiển OpenAI"
      },
      gemini: {
        help: "Lấy khóa API từ Google Cloud Console"
      },
      mistral: {
        help: "Lấy khóa API từ bảng điều khiển Mistral AI"
      },
      openchat: {
        help: "Lấy khóa API từ bảng điều khiển OpenChat"
      }
    },
    save: "Lưu Cài đặt",
    saved: "Đã lưu cài đặt thành công!",
    showKeys: 'Hiển thị API Keys',
    hideKeys: 'Ẩn API Keys',
  },
  apiKeyForm: {
    title: "Nhập Khóa API Google Sheet và ID Bảng tính",
    labels: {
      apiKey: "Khóa API Google Sheet",
      spreadsheetId: "ID Bảng tính"
    },
    placeholders: {
      apiKey: "Nhập khóa API của bạn",
      spreadsheetId: "Nhập ID Bảng tính của bạn"
    },
    errors: {
      required: "Cần nhập cả khóa API và ID Bảng tính"
    },
    buttons: {
      fetchData: "Lấy dữ liệu"
    }
  }
};