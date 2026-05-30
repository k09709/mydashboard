import React from 'react';
import type { LinkCard as LinkCardType } from '../../types';
import { CardWrapper } from './CardWrapper';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface Props {
  card: LinkCardType;
}

export const LinkCard: React.FC<Props> = ({ card }) => {
  return (
    <CardWrapper card={card}>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="text-[#9784af] flex-shrink-0" size={18} />
            <h3 className="font-medium text-zinc-100 text-base">{card.title}</h3>
          </div>
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Quick Visit"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        
        {card.summary && (
          <p className="text-zinc-400 text-sm mt-1 ml-6 leading-relaxed">
            {card.summary}
          </p>
        )}
        <a 
          href={card.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-[#9784af] transition-colors ml-6 truncate block mt-1"
        >
          {card.url}
        </a>
      </div>
    </CardWrapper>
  );
};
