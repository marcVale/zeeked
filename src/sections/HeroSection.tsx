import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, TrendingUp, Globe, Zap } from 'lucide-react';
import { useContent } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentTagline, setCurrentTagline] = useState(0);
  const taglines = ['Discover', 'Explore', 'Stay Ahead'];
  const { content: trendingContent } = useContent({ category: 'trending', limit: 3 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      const headline = section.querySelector('.hero-headline');
      const subheadline = section.querySelector('.hero-subheadline');
      const cta = section.querySelector('.hero-cta');
      const stats = section.querySelector('.hero-stats');
      const preview = section.querySelector('.hero-preview');

      const elements = [headline, subheadline, cta, stats, preview].filter(Boolean);
      
      elements.forEach((el, i) => {
        if (!el) return;
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(el,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out' }
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D7FF00]/10 via-[#0A0A0A] to-[#0A0A0A]" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="hero-headline opacity-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D7FF00]/10 rounded-full border border-[#D7FF00]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#D7FF00]" />
              <span className="text-sm font-medium text-[#D7FF00]">Global Trending Platform</span>
            </span>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F5F5F7] mb-6 leading-tight">
              {taglines[currentTagline]}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF00] to-[#9AFF00]">
                What's Next
              </span>
            </h1>
          </div>

          <p className="hero-subheadline text-lg sm:text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-10 opacity-0">
            Discover the stories shaping our world. Real-time trending content from 50+ countries, curated and delivered to you.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0">
            <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#D7FF00] rounded-full font-semibold text-[#0A0A0A] hover:bg-[#E0FF33] transition-all duration-300">
              <Zap className="w-5 h-5" />
              Start Exploring
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#141414] rounded-full font-semibold text-[#F5F5F7] border border-[#1F1F1F] hover:border-[#D7FF00]/50 hover:bg-[#1F1F1F] transition-all duration-300">
              <TrendingUp className="w-5 h-5" />
              View Trending
            </button>
          </div>

          <div className="hero-stats flex items-center justify-center gap-8 mb-16 opacity-0">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">50+</div>
              <div className="text-sm text-[#A3A3A3] flex items-center gap-1">
                <Globe className="w-4 h-4" /> Countries
              </div>
            </div>
            <div className="w-px h-12 bg-[#1F1F1F]" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">10K+</div>
              <div className="text-sm text-[#A3A3A3]">Daily Stories</div>
            </div>
            <div className="w-px h-12 bg-[#1F1F1F]" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">2M+</div>
              <div className="text-sm text-[#A3A3A3]">Readers</div>
            </div>
          </div>
        </div>

        {trendingContent.length > 0 && (
          <div className="hero-preview mt-12 opacity-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingContent.slice(0, 3).map((item, i) => (
                <div key={i} className="group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] hover:border-[#D7FF00]/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-[#D7FF00] uppercase">{item.category}</span>
                    <h3 className="text-sm font-semibold text-[#F5F5F7] mt-1 line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
