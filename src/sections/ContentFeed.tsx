import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Filter, 
  Clock, 
  TrendingUp, 
  Flame, 
  Bookmark,
  Share2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { formatDistanceToNow } from '../utils/format';
import type { ContentCategory } from '../types';

gsap.registerPlugin(ScrollTrigger);

const categories: { id: ContentCategory | 'all'; label: string; icon: typeof Filter }[] = [
  { id: 'all', label: 'All Stories', icon: Filter },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'viral', label: 'Viral', icon: Flame },
  { id: 'tech', label: 'Technology', icon: Filter },
  { id: 'business', label: 'Business', icon: Filter },
  { id: 'entertainment', label: 'Entertainment', icon: Filter },
  { id: 'sports', label: 'Sports', icon: Filter },
  { id: 'science', label: 'Science', icon: Filter },
  { id: 'health', label: 'Health', icon: Filter },
  { id: 'culture', label: 'Culture', icon: Filter },
];

const sorts = [
  { id: 'trending', label: 'Trending' },
  { id: 'latest', label: 'Latest' },
  { id: 'popular', label: 'Most Popular' },
];

export function ContentFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { content, loading, hasMore, loadMore } = useContent({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 12
  });

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const header = section.querySelector('.feed-header');
      const items = section.querySelectorAll('.feed-item');

      if (header) {
        const st = ScrollTrigger.create({
          trigger: header,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(header,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
          },
          once: true
        });
        triggers.push(st);
      }

      items.forEach((item, i) => {
        const st = ScrollTrigger.create({
          trigger: item,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(item,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.5, delay: (i % 6) * 0.05, ease: 'power2.out' }
            );
          },
          once: true
        });
        triggers.push(st);
      });
    }, section);

    return () => {
      triggers.forEach(st => st.kill());
      ctx.revert();
    };
  }, [content]);

  return (
    <section
      ref={sectionRef}
      id="feed"
      className="relative py-24 lg:py-32 bg-[#0A0A0A] min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="feed-header mb-8 opacity-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-4">
            Content Feed
          </h2>
          <p className="text-[#A3A3A3] max-w-xl">
            Discover stories from around the world, curated and updated in real-time
          </p>
        </div>

        {/* Filters */}
        <div className="feed-header flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1F1F1F] opacity-0">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-[#D7FF00] text-[#0A0A0A]'
                      : 'bg-[#141414] text-[#A3A3A3] hover:bg-[#1F1F1F] hover:text-[#F5F5F7]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-[#141414] rounded-full text-sm text-[#F5F5F7] border border-[#1F1F1F] hover:border-[#525252] transition-colors"
            >
              <Filter className="w-4 h-4" />
              Sort by: {sorts.find(s => s.id === selectedSort)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] rounded-xl border border-[#1F1F1F] shadow-xl z-20">
                {sorts.map((sort) => (
                  <button
                    key={sort.id}
                    onClick={() => {
                      setSelectedSort(sort.id);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-[#1F1F1F] transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      selectedSort === sort.id ? 'text-[#D7FF00]' : 'text-[#F5F5F7]'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && content.length === 0 ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="feed-item bg-[#141414] rounded-xl overflow-hidden border border-[#1F1F1F] h-80 animate-pulse" />
            ))
          ) : (
            content.map((item, index) => (
              <article
                key={item.id}
                ref={index === content.length - 1 ? lastElementRef : null}
                className="feed-item group bg-[#141414] rounded-xl overflow-hidden border border-[#1F1F1F] hover:border-[#D7FF00]/30 transition-all duration-300 opacity-0"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-md text-xs font-medium text-[#D7FF00] uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Bookmark */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D7FF00] hover:text-[#0A0A0A]">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-[#F5F5F7] mb-2 line-clamp-2 group-hover:text-[#D7FF00] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#A3A3A3] mb-3 line-clamp-2">
                    {item.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1F1F1F]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#525252]">{item.source}</span>
                      <span className="text-[#525252]">•</span>
                      <div className="flex items-center gap-1 text-xs text-[#525252]">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(item.publishedAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#1F1F1F] text-[#525252] hover:text-[#F5F5F7] transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#1F1F1F] text-[#525252] hover:text-[#D7FF00] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Loading More */}
        {loading && content.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#D7FF00] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && content.length > 0 && (
          <div className="text-center py-12">
            <p className="text-[#525252]">You've reached the end of the feed</p>
          </div>
        )}
      </div>
    </section>
  );
}
