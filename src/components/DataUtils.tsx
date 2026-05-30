import React, { useRef } from 'react';
import { useDeck } from '../context/DeckContext';
import { Download, Upload } from 'lucide-react';

export const DataUtils: React.FC = () => {
  const { cards, importCards } = useDeck();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-deck-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          importCards(imported);
          alert('Deck imported successfully!');
        } else {
          alert('Invalid file format. Expected an array of cards.');
        }
      } catch (err) {
        console.error('Import error', err);
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3">
      <button
        onClick={handleExport}
        className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 transition-all shadow-lg"
        title="Export JSON"
      >
        <Download size={18} />
      </button>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 transition-all shadow-lg"
        title="Import JSON"
      >
        <Upload size={18} />
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};
