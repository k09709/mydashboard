import React, { useState, useRef } from 'react';
import { useDeck } from '../context/DeckContext';
import type { CardType } from '../types';
import { FileText, Link as LinkIcon, Code, Plus, Image as ImageIcon, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const NewCardInput: React.FC = () => {
  const { addCard } = useDeck();
  const [activeTab, setActiveTab] = useState<CardType>('thought');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const now = Date.now();

    let cardData: any = null;

    if (activeTab === 'thought' && (content.trim() || selectedImage)) {
      cardData = { type: 'thought', content, tags, createdAt: now, updatedAt: now };
    } else if (activeTab === 'link' && url.trim()) {
      cardData = { type: 'link', title: title || url, url, summary, tags, createdAt: now, updatedAt: now };
    } else if (activeTab === 'snippet' && code.trim()) {
      cardData = { type: 'snippet', code, language, description, tags, createdAt: now, updatedAt: now };
    } else {
      return;
    }

    setIsSubmitting(true);
    try {
      await addCard(cardData, selectedImage ?? undefined);
      setContent(''); setTitle(''); setUrl(''); setSummary('');
      setCode(''); setDescription(''); setTagsStr(''); setSelectedImage(null);
    } catch (err: any) {
      console.error(err);
      alert('Failed to save card: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TabButton = ({ type, icon: Icon, label }: { type: CardType, icon: any, label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(type)}
      className={twMerge(clsx(
        "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2",
        activeTab === type
          ? "border-[#9784af] text-zinc-100"
          : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
      ))}
    >
      <Icon size={16} className="hidden sm:block" />
      {label}
    </button>
  );

  return (
    <div className="bg-zinc-900/40 rounded-2xl shadow-lg border border-zinc-800/50 p-4 sm:p-5 backdrop-blur-sm mt-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-1 sm:gap-2 mb-4 border-b border-zinc-800/50 px-1 sm:px-2">
        <TabButton type="thought" icon={FileText} label="Thought" />
        <TabButton type="link" icon={LinkIcon} label="Link" />
        <TabButton type="snippet" icon={Code} label="Snippet" />
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-4 px-1 sm:px-2 pb-2">
        {selectedImage && (
          <div className="relative w-fit mb-2">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 p-1 bg-zinc-800 text-zinc-300 hover:text-white rounded-full shadow-lg border border-zinc-700 z-10 transition-colors"
            >
              <X size={14} />
            </button>
            <img src={selectedImage} alt="Preview" className="h-24 w-auto rounded-lg object-cover border border-zinc-800/50 shadow-sm" />
          </div>
        )}

        {activeTab === 'thought' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedImage ? "Add a thought to your image... (optional)" : "What's on your mind? (Markdown supported)"}
            className="w-full bg-transparent border-none outline-none resize-none text-zinc-200 placeholder:text-zinc-600 min-h-[100px]"
            required={!selectedImage}
          />
        )}

        {activeTab === 'link' && (
          <div className="flex flex-col gap-3">
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
              className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-1 text-sm sm:text-base" required />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
              className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-1 text-sm sm:text-base" />
            <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary..."
              className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-1 text-sm sm:text-base" />
          </div>
        )}

        {activeTab === 'snippet' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language (e.g. tsx)"
                className="w-full sm:w-1/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-1 text-sm font-mono" />
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Snippet description..."
                className="w-full sm:w-2/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-1 text-sm sm:text-base" />
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..."
              className="w-full bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 outline-none resize-none text-zinc-300 font-mono text-sm min-h-[150px] placeholder:text-zinc-600" required />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-2 pt-4 sm:pt-2 border-t border-zinc-800/50 gap-3 sm:gap-0">
          <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)}
            placeholder="Tags (comma separated)"
            className="flex-grow bg-transparent outline-none text-sm text-zinc-400 placeholder:text-zinc-600" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors" title="Upload Photo">
              <ImageIcon size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageImport} accept="image/*" className="hidden" />
            <button type="submit" disabled={isSubmitting}
              className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-[#9784af] hover:bg-[#a694bf] disabled:opacity-50 text-zinc-950 px-4 py-2 sm:py-1.5 rounded-full font-medium transition-colors text-sm">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" />
                : <Plus size={16} />}
              <span>{isSubmitting ? 'Saving...' : 'Add Card'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
