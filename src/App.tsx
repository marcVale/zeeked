import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Menu, Globe } from 'lucide-react';
import { useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import hooks
import { useGeolocation } from '@/hooks/useGeolocation';
import { useI18n, SUPPORTED_LANGUAGES } from '@/hooks/useI18n';
import { useContent, CATEGORIES } from '@/hooks/useContent';

// Import sections
import HeroSection from '@/sections/HeroSection';
import TrendingSection from '@/sections/TrendingSection';
import CultureSection from '@/sections/CultureSection';
import SportsSection from '@/sections/SportsSection';
import BusinessSection from '@/sections/BusinessSection';
import EntertainmentSection from '@/sections/EntertainmentSection';
import TechSection from '@/sections/TechSection';
import ScienceSection from '@/sections/ScienceSection';
import HealthSection from '@/sections/HealthSection';
import ViralSection from '@/sections/ViralSection';
import ClosingSection from '@/sections/ClosingSection';
import ContentFeed from '@/sections/ContentFeed';

// Import components
import LanguageSelector from '@/components/LanguageSelector';
import SearchModal from '@/components/SearchModal';
import MobileMenu from '@/components/MobileMenu';

function App() {
  const { location } = useGeolocation();
  const { language, setLanguage, t, currentLanguage } = useI18n(location?.country);
  const { items, loading, hasMore, loadMore } = useContent(location?.country, language);
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);

  // Setup global snap for pinned sections
  useEffect(() => {
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Cleanup ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const handleExplore = () => {
    setShowFeed(true);
    setTimeout(() => {
      document.getElementById('content-feed')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div ref={mainRef} className="relative bg-[#0B0B0D] min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="text-[#F5F5F7] font-bold text-xl tracking-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
            onClick={(e) => {
              e.preventDefault();
              setShowFeed(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            zeeked
          </a>
          
          {/* Country pill */}
          {location && (
            <button
              onClick={() => setShowLanguageSelector(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1C] border border-[rgba(245,245,247,0.08)] text-xs text-[#B8B8BD] hover:text-[#F5F5F7] transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span className="font-mono uppercase">{location.country}</span>
            </button>
          )}
        </div>
        
        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(true)}
            className="p-2.5 rounded-full bg-[#1A1A1C] border border-[rgba(245,245,247,0.08)] text-[#F5F5F7] hover:bg-[#2A2A2C] transition-colors"
            aria-label={t('nav.search')}
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowMenu(true)}
            className="p-2.5 rounded-full bg-[#1A1A1C] border border-[rgba(245,245,247,0.08)] text-[#F5F5F7] hover:bg-[#2A2A2C] transition-colors"
            aria-label={t('nav.menu')}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative">
        {!showFeed ? (
          <>
            {/* Landing page sections */}
            <HeroSection onExplore={handleExplore} t={t} />
            <TrendingSection t={t} />
            <CultureSection t={t} />
            <SportsSection t={t} />
            <BusinessSection t={t} />
            <EntertainmentSection t={t} />
            <TechSection t={t} />
            <ScienceSection t={t} />
            <HealthSection t={t} />
            <ViralSection t={t} />
            <ClosingSection onExplore={handleExplore} t={t} />
          </>
        ) : (
          <div id="content-feed" className="pt-20">
            <ContentFeed 
              items={items}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              categories={CATEGORIES}
              t={t}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        languages={SUPPORTED_LANGUAGES}
        currentLanguage={currentLanguage}
        onSelect={setLanguage}
      />
      
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        t={t}
      />
      
      <MobileMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        categories={CATEGORIES}
        t={t}
      />
    </div>
  );
}

export default App;
