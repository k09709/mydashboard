import React from 'react';
import type { BaseCard } from '../../types';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeck } from '../../context/DeckContext';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface CardWrapperProps {
  card: BaseCard;
  children: React.ReactNode;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({ card, children }) => {
  const { setActiveTagFilter, setHoveredTag, hoveredTag } = useDeck();
  
  const parseDate = (val: any): Date => {
    if (!val) return new Date();
    if (typeof val.toDate === 'function') return val.toDate();
    if (val.seconds !== undefined) return new Date(val.seconds * 1000);
    return new Date(val);
  };

  const dateObj = parseDate(card.createdAt);
  const formattedDate = isNaN(dateObj.getTime())
    ? 'Loading date...'
    : dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const isHighlighted = hoveredTag && card.tags.includes(hoveredTag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          "break-inside-avoid mb-4 p-5 rounded-xl bg-zinc-900/50 shadow-xl transition-all duration-300 flex flex-col gap-3 group border",
          isHighlighted ? "border-[#9784af]/50 shadow-[#9784af]/10 shadow-2xl bg-zinc-800/80" : "border-transparent hover:border-zinc-800/50 hover:shadow-2xl"
        )
      )}
    >
      {card.imageUrl && (
        <img 
          src={card.imageUrl} 
          alt="Card attachment" 
          className="w-full rounded-lg object-cover border border-zinc-800/50 mb-1" 
          loading="lazy"
        />
      )}

      <div className="flex-grow">{children}</div>

      <div className="flex flex-col gap-3 mt-2">
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => setActiveTagFilter(tag)}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag(null)}
                className={twMerge(
                  clsx(
                    "text-xs px-2 py-1 rounded-md transition-colors cursor-pointer",
                    hoveredTag === tag 
                      ? "bg-[#9784af]/20 text-[#9784af]" 
                      : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80"
                  )
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center text-xs text-zinc-500 gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <Clock size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};
