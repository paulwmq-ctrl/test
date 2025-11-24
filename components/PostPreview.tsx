import React, { useState } from 'react';
import { GeneratedPost, GeneratedImageResult } from '../types';

interface PostPreviewProps {
  post: GeneratedPost | null;
  imageData: GeneratedImageResult | null;
}

type Tab = 'preview' | 'prompt';

const PostPreview: React.FC<PostPreviewProps> = ({ post, imageData }) => {
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  const handleCopy = () => {
    if (post) {
      navigator.clipboard.writeText(post.emojiContent + '\n\n' + post.hashtags.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyPrompt = () => {
    if (imageData?.prompt) {
      navigator.clipboard.writeText(imageData.prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  if (!post && !imageData) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg">等待生成您的爆款笔记...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tab Switcher */}
      <div className="flex bg-gray-200 p-1 rounded-xl self-center">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'preview' ? 'bg-white text-redbook-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📱 效果预览
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'prompt' ? 'bg-white text-redbook-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎨 绘画提示词 (Prompt)
        </button>
      </div>

      {activeTab === 'preview' ? (
        <>
          {/* Phone Preview Container */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900 max-w-sm mx-auto w-full relative">
            <div className="absolute top-0 w-full h-6 bg-gray-900 z-20 flex justify-center">
                <div className="w-32 h-4 bg-black rounded-b-xl"></div>
            </div>
            
            <div className="h-full overflow-y-auto bg-white pb-12 pt-8 no-scrollbar max-h-[700px]">
              
              {/* Header */}
              <div className="px-4 flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-2 rounded-full cursor-pointer">
                   <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </div>
                <div className="flex gap-2">
                     <div className="bg-gray-100 p-2 rounded-full cursor-pointer">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                     </div>
                     <div className="bg-gray-100 p-2 rounded-full cursor-pointer">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                     </div>
                </div>
              </div>

              {/* Image */}
              <div className="w-full aspect-[3/4] bg-gray-100 relative mb-4 group">
                {imageData?.imageUrl ? (
                  <img src={imageData.imageUrl} alt="Generated Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm">正在生成封面图...</span>
                  </div>
                )}
                {/* Image Tags Simulation */}
                {post && (
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-redbook-500"></div>
                        {post.hashtags[0] ? post.hashtags[0].replace('#', '') : 'Tag'}
                    </div>
                )}
              </div>

              {/* Content */}
              <div className="px-5">
                <h1 className="font-bold text-gray-900 text-lg leading-snug mb-3">
                  {post?.title || '等待生成标题...'}
                </h1>
                
                <div className="prose prose-sm text-gray-700 whitespace-pre-line mb-6">
                  {post?.content || '等待生成正文...'}
                </div>

                <div className="flex flex-wrap gap-2 text-blue-900 font-medium text-sm mb-8">
                  {post?.hashtags.map((tag, idx) => (
                    <span key={idx}>{tag}</span>
                  ))}
                </div>
                
                <div className="text-gray-400 text-xs py-4 border-t border-gray-100">
                    Created with RedBook Viral Gen
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center w-full">
            <button
              onClick={handleCopy}
              disabled={!post}
              className={`flex items-center gap-2 px-8 py-3 rounded-full shadow-lg transition-all font-semibold
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-800 hover:bg-gray-50'}`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  已复制!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  一键复制标题和正文
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        // Prompt Tab
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 max-w-sm mx-auto w-full">
          <h3 className="font-bold text-gray-800 mb-2">AI 绘画提示词 (Midjourney / Stable Diffusion)</h3>
          <p className="text-xs text-gray-500 mb-4">这是AI根据您的主题生成的英文绘画指令，您可以复制到其他AI绘画软件中使用。</p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 font-mono mb-4 break-words whitespace-pre-wrap min-h-[200px]">
             {imageData?.prompt || "等待生成图片提示词..."}
          </div>

           <button
              onClick={handleCopyPrompt}
              disabled={!imageData?.prompt}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-md transition-all font-semibold
                ${promptCopied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-900'}`}
            >
              {promptCopied ? '已复制提示词!' : '复制提示词'}
            </button>
        </div>
      )}
    </div>
  );
};

export default PostPreview;