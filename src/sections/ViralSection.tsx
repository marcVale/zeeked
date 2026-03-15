import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, TrendingUp, Share2, MessageCircle, Eye, ArrowRight } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { formatNumber } from '../utils/format';

gsap.registerPlugin(ScrollTrigger);

export default function ViralSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { content, loading } = useContent({ category: 'viral', limit: 6 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const header = section.querySelector('.viral-header');
      const cards = section.querySelectorAll('.viral-card');
      const cta = section.querySelector('.viral-cta');

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

      cards.forEach((card, i) => {
        const st = ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' }
            );
          },
          once: true
        });
        triggers.push(st);
      });

      if (cta) {
        const st = ScrollTrigger.create({
          trigger: cta,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(cta,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
          },
          once: true
        });
        triggers.push(st);
      }
    }, section);

    return () => {
      triggers.forEach(st => st.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="viral"
      className="relative py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #D7FF00 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="viral-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 opacity-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D7FF00] to-[#FF4D00] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <span className="text-[#D7FF00] font-medium tracking-wider text-sm uppercase">
                Going Viral
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F5F7] mb-4">
              Viral Now
            </h2>
            <p className="text-lg text-[#A3A3A3] max-w-xl">
              Content spreading like wildfire across the internet right now
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FF4D00]/10 rounded-full border border-[#FF4D00]/30">
              <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
              <span className="text-sm text-[#FF4D00] font-medium">Live updates</span>
            </div>
          </div>
        </div>

        {/* Viral Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="viral-card bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] h-80 animate-pulse" />
            ))
          ) : (
            content.map((item, index) => (
              <article
                key={item.id}
                className="viral-card group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] hover:border-[#FF4D00]/50 transition-all duration-300 opacity-0"
              >
                {/* Viral Rank */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-[#FFD700] text-[#0A0A0A]' :
                    index === 1 ? 'bg-[#C0C0C0] text-[#0A0A0A]' :
                    index === 2 ? 'bg-[#CD7F32] text-[#0A0A0A]' :
                    'bg-[#1F1F1F] text-[#F5F5F7]'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#FF4D00] rounded-full">
                      <TrendingUp className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">Hot</span>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#FF4D00] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[#525252]">•</span>
                    <span className="text-xs text-[#A3A3A3]">{item.source}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F5F7] mb-3 line-clamp-2 group-hover:text-[#FF4D00] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#A3A3A3] mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#1F1F1F]">
                    <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">{formatNumber(item.engagement?.views || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">{formatNumber(item.engagement?.shares || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{formatNumber(item.engagement?.comments || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF4D00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </article>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="viral-cta mt-12 text-center opacity-0">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] rounded-full font-semibold text-white hover:shadow-lg hover:shadow-[#FF4D00]/25 transition-all duration-300">
            <Flame className="w-5 h-5" />
            Explore All Viral Content
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
