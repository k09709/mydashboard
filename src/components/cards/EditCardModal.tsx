import React, { useState } from 'react';
import type { Card } from '../../types';
import { useDeck } from '../../context/DeckContext';
import { X, Save } from 'lucide-react';

interface Props {
  card: Card;
  onClose: () => void;
}

export const EditCardModal: React.FC<Props> = ({ card, onClose }) => {
  const { updateCard } = useDeck();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States initialized from existing card
  const [content, setContent] = useState(card.type === 'thought' ? card.content : '');
  const [title, setTitle] = useState(card.type === 'link' ? card.title : '');
  const [url, setUrl] = useState(card.type === 'link' ? card.url : '');
  const [summary, setSummary] = useState(card.type === 'link' ? card.summary : '');
  const [code, setCode] = useState(card.type === 'snippet' ? card.code : '');
  const [language, setLanguage] = useState(card.type === 'snippet' ? card.language : '');
  const [description, setDescription] = useState(card.type === 'snippet' ? (card.description || '') : '');
  const [tagsStr, setTagsStr] = useState(card.tags.join(', '));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    
    let updatedFields: Partial<Card> = { tags };

    if (card.type === 'thought') {
      if (!content.trim() && !card.imageUrl) return;
      updatedFields = { ...updatedFields, content } as Partial<Card>;
    } else if (card.type === 'link') {
      if (!url.trim()) return;
      updatedFields = { ...updatedFields, title: title || url, url, summary } as Partial<Card>;
    } else if (card.type === 'snippet') {
      if (!code.trim()) return;
      updatedFields = { ...updatedFields, code, language, description } as Partial<Card>;
    }

    setIsSubmitting(true);
    try {
      await updateCard(card.id, updatedFields);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Failed to update card: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <h2 className="text-lg font-medium text-zinc-100">Edit {card.type}</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <form id="edit-form" onSubmit={handleSave} className="flex flex-col gap-4">
            
            {card.type === 'thought' && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? (Markdown supported)"
                className="w-full bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 outline-none resize-none text-zinc-200 placeholder:text-zinc-600 min-h-[150px]"
                required={!card.imageUrl}
              />
            )}

            {card.type === 'link' && (
              <div className="flex flex-col gap-3">
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
                  className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-2" required />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
                  className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-2" />
                <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary..."
                  className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-2" />
              </div>
            )}

            {card.type === 'snippet' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language (e.g. tsx)"
                    className="w-full sm:w-1/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-2 font-mono text-sm" />
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Snippet description..."
                    className="w-full sm:w-2/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-200 placeholder:text-zinc-600 py-2" />
                </div>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..."
                  className="w-full bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50 outline-none resize-none text-zinc-300 font-mono text-sm min-h-[200px] placeholder:text-zinc-600" required />
              </div>
            )}

            <div className="pt-2">
              <label className="text-xs text-zinc-500 mb-1 block">Tags (comma separated)</label>
              <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)}
                placeholder="react, tutorial, idea"
                className="w-full bg-transparent border-b border-zinc-800 outline-none text-zinc-300 placeholder:text-zinc-700 py-2" />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-zinc-800/50 flex justify-end gap-3 bg-zinc-900/80 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-form" disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#9784af] hover:bg-[#a694bf] disabled:opacity-50 text-zinc-950 px-5 py-2 rounded-full font-medium transition-colors text-sm shadow-lg shadow-[#9784af]/20">
            {isSubmitting ? <span className="w-4 h-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            <span>Save Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
