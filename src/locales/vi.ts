export default {
  common: {
    search: 'Tìm kiếm',
    loading: 'Đang tải...',
    error: 'Lỗi',
    selectTopic: 'Chọn một chủ đề để xem thông tin chi tiết.',
    generateAnswer: 'Đang tạo câu trả lời...',
  },
  nav: {
    home: 'Trung tâm Phỏng vấn',
    knowledgeBase: '📚 Cơ sở Kiến thức',
    interviewQuestions: '❓ Câu hỏi Phỏng vấn',
    chat: 'Trò chuyện với AI',
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
  },
  knowledgeBase: {
    title: 'Cơ Sở Kiến Thức',
    searchPlaceholder: 'Tìm kiếm...',
    status: {
      pending: 'Chưa học',
      inProgress: 'Đang học',
      completed: 'Hoàn thành',
      notStarted: 'Chưa học'
    },
    messages: {
      loading: 'Đang tạo giải thích...',
      selectTopic: 'Chọn một chủ đề để xem chi tiết.',
      selectFromSidebar: 'Chọn một chủ đề từ thanh bên.',
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
    }
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
      selectQuestion: 'Chọn một câu hỏi để xem câu trả lời.',
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
  }
};