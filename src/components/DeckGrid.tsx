import React, { useState, useEffect } from 'react';
import { useDeck } from '../context/DeckContext';
import { ThoughtCard } from './cards/ThoughtCard';
import { LinkCard } from './cards/LinkCard';
import { SnippetCard } from './cards/SnippetCard';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 30;

export const DeckGrid: React.FC = () => {
  const { cards, searchQuery, activeTagFilter } = useDeck();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCards = cards.filter(card => {
    if (activeTagFilter && !card.tags.includes(activeTagFilter)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTags = card.tags.some(t => t.toLowerCase().includes(q));
      let inContent = false;
      
      if (card.type === 'thought') {
        inContent = card.content.toLowerCase().includes(q);
      } else if (card.type === 'link') {
        inContent = card.title.toLowerCase().includes(q) || 
                    card.url.toLowerCase().includes(q) || 
                    (card.summary || '').toLowerCase().includes(q);
      } else if (card.type === 'snippet') {
        inContent = card.code.toLowerCase().includes(q) || 
                    (card.description || '').toLowerCase().includes(q);
      }
      
      if (!inTags && !inContent) return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mt-8">
      {filteredCards.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-zinc-500 text-sm">
          {cards.length === 0 ? 'Your deck is empty. Add a thought, link, or snippet above.' : 'No cards match your search.'}
        </div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            <AnimatePresence>
              {paginatedCards.map((card) => {
                if (card.type === 'thought') return <ThoughtCard key={card.id} card={card} />;
                if (card.type === 'link') return <LinkCard key={card.id} card={card} />;
                if (card.type === 'snippet') return <SnippetCard key={card.id} card={card} />;
                return null;
              })}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-zinc-500 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
