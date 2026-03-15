import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { content, search } = useContent({ limit: 10 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query);
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/content/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-[#141414] rounded-2xl border border-[#1F1F1F] shadow-2xl overflow-hidden">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-4 p-4 border-b border-[#1F1F1F]">
          <Search className="w-6 h-6 text-[#A3A3A3]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, topics, sources..."
            className="flex-1 bg-transparent text-lg text-[#F5F5F7] placeholder-[#525252] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-[#1F1F1F] text-[#525252]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:block px-3 py-1.5 bg-[#1F1F1F] rounded-lg text-xs text-[#A3A3A3]"
          >
            ESC
          </button>
        </form>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query ? (
            <div className="p-2">
              {content.length > 0 ? (
                content.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item.id)}
                    className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-[#1F1F1F] transition-colors text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#D7FF00] uppercase">
                          {item.category}
                        </span>
                        <span className="text-[#525252]">•</span>
                        <span className="text-xs text-[#525252]">{item.source}</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#F5F5F7] line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#A3A3A3] line-clamp-1">
                        {item.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#525252] flex-shrink-0 mt-4" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#A3A3A3]">No results found for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-[#A3A3A3]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Climate', 'Sports', 'Markets'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#1F1F1F] rounded-full text-sm text-[#F5F5F7] hover:bg-[#2A2A2A] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#A3A3A3]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Trending Now</span>
                </div>
                <div className="space-y-2">
                  {['AI Breakthrough', 'World Cup', 'Stock Market', 'Climate Summit'].map((term, i) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#1F1F1F] transition-colors text-left"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded bg-[#D7FF00]/10 text-[#D7FF00] text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[#F5F5F7]">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
