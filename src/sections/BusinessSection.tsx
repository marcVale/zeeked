import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, ArrowRight, DollarSign, BarChart3, Briefcase } from 'lucide-react';
import { useContent } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function BusinessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { content, loading } = useContent({ category: 'business', limit: 5 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      const header = section.querySelector('.business-header');
      const featured = section.querySelector('.business-featured');
      const cards = section.querySelectorAll('.business-card');

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

      if (featured) {
        const st = ScrollTrigger.create({
          trigger: featured,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(featured,
              { opacity: 0, x: -40 },
              { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
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
              { opacity: 0, x: 40 },
              { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' }
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
    <section ref={sectionRef} id="business" className="relative py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="business-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 opacity-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D7FF00]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#D7FF00]" />
              </div>
              <span className="text-[#D7FF00] font-medium tracking-wider text-sm uppercase">Business</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F5F7] mb-4">Markets & Money</h2>
            <p className="text-lg text-[#A3A3A3] max-w-xl">Financial news, market updates, and business insights</p>
          </div>
          <button className="group flex items-center gap-2 text-[#F5F5F7] font-medium hover:text-[#D7FF00] transition-colors">
            More in Business <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <div className="business-featured bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] h-96 animate-pulse" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="business-card bg-[#141414] rounded-xl overflow-hidden border border-[#1F1F1F] h-24 animate-pulse" />
                ))}
              </div>
            </>
          ) : (
            <>
              {content[0] && (
                <article className="business-featured group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] hover:border-[#D7FF00]/30 transition-all duration-300 opacity-0">
                  <div className="relative h-64 overflow-hidden">
                    <img src={content[0].image} alt={content[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-[#D7FF00] uppercase tracking-wider">{content[0].category}</span>
                    <h3 className="text-2xl font-bold text-[#F5F5F7] mt-2 mb-3 line-clamp-2 group-hover:text-[#D7FF00] transition-colors">{content[0].title}</h3>
                    <p className="text-sm text-[#A3A3A3] line-clamp-2">{content[0].excerpt}</p>
                  </div>
                </article>
              )}
              <div className="space-y-4">
                {content.slice(1, 5).map((item) => (
                  <article key={item.id} className="business-card group flex gap-4 p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#D7FF00]/30 transition-all duration-300 opacity-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-[#D7FF00] uppercase">{item.category}</span>
                      <h4 className="text-base font-semibold text-[#F5F5F7] mt-1 line-clamp-2 group-hover:text-[#D7FF00] transition-colors">{item.title}</h4>
                      <span className="text-xs text-[#525252] mt-2 block">{item.source}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
