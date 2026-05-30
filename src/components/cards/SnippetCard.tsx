import React, { useState } from 'react';
import type { SnippetCard as SnippetCardType } from '../../types';
import { CardWrapper } from './CardWrapper';
import { Code, Copy, Check } from 'lucide-react';

interface Props {
  card: SnippetCardType;
}

export const SnippetCard: React.FC<Props> = ({ card }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(card.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CardWrapper card={card}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="text-zinc-500" size={18} />
            {card.description && (
              <span className="text-sm text-zinc-300 font-medium">{card.description}</span>
            )}
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            {card.language}
          </span>
        </div>
        
        <div className="relative group/code mt-1">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-700/50 text-zinc-300 opacity-0 group-hover/code:opacity-100 transition-opacity hover:bg-zinc-600 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
          <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto border border-zinc-800/50">
            <code className="text-sm text-zinc-300 font-mono">
              {card.code}
            </code>
          </pre>
        </div>
      </div>
    </CardWrapper>
  );
};
