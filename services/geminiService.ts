import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, GeneratedPost, GeneratedImageResult } from "../types";

// Initialize API client
// CRITICAL: process.env.API_KEY is assumed to be present in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePostText = async (config: GenerationConfig): Promise<GeneratedPost> => {
  const prompt = `
    你是一个资深的小红书爆款内容创作者。
    请根据以下参数创作一篇极具病毒传播潜力的笔记：
    
    主题: ${config.topic}
    关键词: ${config.keywords}
    风格: ${config.style}
    篇幅: ${config.length}
    补充要求/上下文: ${config.additionalContext || '无'}
    
    要求：
    1. 标题：必须吸引眼球，使用Emoji，具有点击欲望（震惊、好奇、或提供极高情绪价值/实用价值）。
    2. 正文：排版清晰，分段合理，大量使用Emoji，语气亲切（姐妹、集美们），符合小红书社区氛围。
    3. 标签：精准且高流量的Hashtag。
    4. 语言：简体中文。
    
    请以JSON格式返回结果。
  `;

  const response = await ai.models.generateContent({
    model: config.model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "The main body text without title or hashtags" },
          emojiContent: { type: Type.STRING, description: "The full post text including title and body formatted with emojis for copy-pasting" },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "content", "emojiContent", "hashtags"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("生成文本失败 / No text generated");
  
  return JSON.parse(text) as GeneratedPost;
};

export const generateCoverImage = async (topic: string, style: string, customPrompt?: string): Promise<GeneratedImageResult> => {
  // Constructing a prompt optimized for social media covers
  // If customPrompt is provided, it takes precedence as the main subject description
  const subjectDescription = customPrompt && customPrompt.trim() !== '' ? customPrompt : topic;
  
  const promptDescription = `
    (Best quality, 4k, masterpiece), A vertical 3:4 aspect ratio social media cover image for Xiaohongshu (Little Red Book).
    Subject/Description: ${subjectDescription}.
    Vibe/Style: ${style}.
    Aesthetic, clean composition, high definition, bright lighting, trending on artstation, photorealistic or stylized illustration depending on the vibe.
    No text in the image. Visually striking.
  `;

  // Using gemini-2.5-flash-image for image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
        parts: [
            { text: promptDescription }
        ]
    },
  });

  // Iterate to find image part
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
      for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
              return {
                imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                prompt: promptDescription.trim()
              };
          }
      }
  }

  throw new Error("Failed to generate image.");
};