export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  IMAGE = 'image',
  ERROR = 'error'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: number;
  imageData?: string; // Base64 string for images
}

export enum AppMode {
  CHAT = 'chat',
  CODE = 'code',
  IMAGE = 'image'
}

export interface GenerationConfig {
  mode: AppMode;
  thinking: boolean;
}