import React, { useState } from 'react';
import GenerationForm from './components/GenerationForm';
import PostPreview from './components/PostPreview';
import { generatePostText, generateCoverImage } from './services/geminiService';
import { AppState, GenerationConfig } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    generatedPost: null,
    generatedImage: null,
    error: null,
  });

  const handleGenerate = async (config: GenerationConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, generatedPost: null, generatedImage: null }));

    try {
      // Execute text generation
      const postPromise = generatePostText(config);
      
      // Execute image generation concurrently
      // Pass topic, style, and optional custom prompt
      const imagePromise = generateCoverImage(config.topic, config.style, config.customImagePrompt);

      // Wait for both results
      // We can actually set state incrementally to make it feel faster
      const post = await postPromise;
      setState(prev => ({ ...prev, generatedPost: post }));

      const imageResult = await imagePromise;
      setState(prev => ({ ...prev, generatedImage: imageResult }));
      
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: "生成失败，请重试。(Failed to generate content)",
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-redbook-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-redbook-500/20">
              书
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              小红书爆款 <span className="text-redbook-500">生成器</span>
            </h1>
          </div>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-redbook-500 transition-colors">
            Based on Gemini API
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-redbook-500 to-redbook-600 rounded-3xl p-6 text-white shadow-xl shadow-redbook-500/20 mb-2">
                <h2 className="text-2xl font-bold mb-2">打造爆款笔记 🚀</h2>
                <p className="opacity-90">输入主题，AI自动生成吸睛标题、爆款文案和精美封面。</p>
            </div>
            <GenerationForm onSubmit={handleGenerate} isLoading={state.isLoading} />
            
            {state.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PostPreview post={state.generatedPost} imageData={state.generatedImage} />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default App;