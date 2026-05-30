import React from 'react';
import type { ThoughtCard as ThoughtCardType } from '../../types';
import { CardWrapper } from './CardWrapper';
import { FileText } from 'lucide-react';

interface Props {
  card: ThoughtCardType;
}

export const ThoughtCard: React.FC<Props> = ({ card }) => {
  return (
    <CardWrapper card={card}>
      <div className="flex items-start gap-3">
        <FileText className="text-zinc-500 mt-1 flex-shrink-0" size={18} />
        <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
          {card.content}
        </div>
      </div>
    </CardWrapper>
  );
};
