// Message role type
enum MessageRole {
    User = 'user',
    Assistant = 'assistant'
}

// Answer type enum
enum AnswersType {
    Interview = 'interview',
    Knowledge = 'knowledge'
}

// Message interface for the JSONB messages field
interface Message {
    role: MessageRole;
    content: string;
    timestamp?: Date;
}

// Interface for the answers table
interface Answer {
    id: string; // UUID
    user_id: string; // UUID, foreign key to auth.users
    type: AnswersType;
    category: string | null;
    question: string;
    answer: string;
    created_at: Date;
    updated_at: Date;
    model: string;
}

// Interface for the chat_history table
interface ChatHistory {
    id: string; // UUID
    answer_id: string; // UUID, foreign key to answers
    user_id: string; // UUID, foreign key to auth.users
    messages: Message[];
    created_at: Date;
    updated_at: Date;
}