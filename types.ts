export enum ModelType {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
}

export enum PostStyle {
  EMOTIONAL = '情感共鸣 (走心/治愈)',
  INFORMATIVE = '干货分享 (教程/攻略)',
  HUMOROUS = '幽默搞笑 (段子/吐槽)',
  AESTHETIC = '氛围感 (高级/极简)',
  PROMOTIONAL = '种草带货 (安利/测评)',
}

export enum PostLength {
  SHORT = '短文案 (精简有力)',
  MEDIUM = '中长文案 (标准笔记)',
  LONG = '深度长文 (详细干货)',
}

export interface GenerationConfig {
  model: ModelType;
  topic: string;
  keywords: string;
  style: PostStyle;
  length: PostLength;
  customImagePrompt?: string;
  additionalContext?: string;
}

export interface GeneratedPost {
  title: string;
  content: string;
  emojiContent: string;
  hashtags: string[];
}

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
}

export interface AppState {
  isLoading: boolean;
  generatedPost: GeneratedPost | null;
  generatedImage: GeneratedImageResult | null;
  error: string | null;
}