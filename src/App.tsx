import { NewCardInput } from './components/NewCardInput';
import { DeckGrid } from './components/DeckGrid';
import { SearchBar } from './components/SearchBar';
import { DataUtils } from './components/DataUtils';
import { LoginScreen } from './components/LoginScreen';
import { Glasses, LogOut } from 'lucide-react';
import { useDeck } from './context/DeckContext';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

function AppInner() {
  const { currentUser, loading } = useDeck();

  // Auth loading state
  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-zinc-700 border-t-[#9784af] rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 md:p-12 font-sans selection:bg-[#9784af]/30 selection:text-white">
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 mb-2 sm:mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/50 shadow-inner">
            <Glasses className="text-[#9784af]" size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">coolest mf in this dashboard</h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">Capture everything.</p>
          </div>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser.photoURL || ''}
            alt={currentUser.displayName || 'User'}
            className="w-8 h-8 rounded-full border border-zinc-700"
          />
          <div className="hidden sm:block">
            <p className="text-sm text-zinc-300 font-medium leading-none">{currentUser.displayName}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{currentUser.email}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pb-24">
        <SearchBar />
        <NewCardInput />
        <DeckGrid />
      </main>

      <DataUtils />
    </div>
  );
}

function App() {
  return <AppInner />;
}

export default App;
