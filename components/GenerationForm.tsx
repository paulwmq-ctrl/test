import React, { useState } from 'react';
import { GenerationConfig, ModelType, PostLength, PostStyle } from '../types';

interface GenerationFormProps {
  onSubmit: (config: GenerationConfig) => void;
  isLoading: boolean;
}

const GenerationForm: React.FC<GenerationFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState<PostStyle>(PostStyle.EMOTIONAL);
  const [length, setLength] = useState<PostLength>(PostLength.MEDIUM);
  const [model, setModel] = useState<ModelType>(ModelType.GEMINI_FLASH);
  
  // New state variables
  const [customImagePrompt, setCustomImagePrompt] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({ 
      topic, 
      keywords, 
      style, 
      length, 
      model,
      customImagePrompt,
      additionalContext
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-redbook-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          R
        </div>
        <h2 className="text-xl font-bold text-gray-800">参数设置</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Model Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">AI 模型选择</label>
          <div className="relative">
             <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelType)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3 appearance-none"
            >
              <option value={ModelType.GEMINI_FLASH}>Gemini 2.5 Flash (极速/推荐)</option>
              <option value={ModelType.GEMINI_PRO}>Gemini 3 Pro (高智商/深度)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">笔记主题 <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：夏日美白攻略"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3"
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">核心关键词/标签</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="例如：平价，学生党，沉浸式"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">文案风格</label>
            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as PostStyle)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3 appearance-none"
              >
                {Object.values(PostStyle).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">篇幅长度</label>
             <div className="relative">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as PostLength)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3 appearance-none"
              >
                {Object.values(PostLength).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Context (API String) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            补充要求 / API Context
            <span className="ml-2 text-xs text-gray-400 font-normal">(选填，例如：特定的语气、品牌名称)</span>
          </label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="输入任何额外的指令或上下文信息..."
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3 resize-none"
          />
        </div>

        {/* Custom Cover Image Prompt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            封面画面描述
            <span className="ml-2 text-xs text-gray-400 font-normal">(选填，不填则自动根据主题生成)</span>
          </label>
          <textarea
            value={customImagePrompt}
            onChange={(e) => setCustomImagePrompt(e.target.value)}
            placeholder="例如：一个穿着白色连衣裙的女孩在海边奔跑，阳光明媚..."
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-redbook-500 focus:border-redbook-500 block p-3 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-redbook-500 hover:bg-redbook-600 hover:shadow-redbook-500/30'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在生成爆款笔记...
            </span>
          ) : (
            '一键生成'
          )}
        </button>
      </form>
    </div>
  );
};

export default GenerationForm;