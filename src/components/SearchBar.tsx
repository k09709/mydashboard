import React from 'react';
import { useDeck } from '../context/DeckContext';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, activeTagFilter, setActiveTagFilter } = useDeck();

  return (
    <div className="flex flex-col gap-2 w-full max-w-xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500 group-focus-within:text-[#9784af] transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search title, content, snippet..."
          className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-[#9784af]/50 rounded-full py-2.5 pl-10 pr-4 outline-none text-zinc-100 placeholder:text-zinc-500 transition-all shadow-inner backdrop-blur-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {activeTagFilter && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm text-zinc-400">Filtering by tag:</span>
          <div className="flex items-center gap-1 bg-[#9784af]/20 text-[#9784af] px-3 py-1 rounded-full text-sm font-medium border border-[#9784af]/30">
            <span>#{activeTagFilter}</span>
            <button onClick={() => setActiveTagFilter(null)} className="hover:text-white transition-colors ml-1">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
