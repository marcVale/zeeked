import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Atom, ArrowRight, Rocket, Microscope } from 'lucide-react';
import { useContent } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function ScienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { content, loading } = useContent({ category: 'science', limit: 4 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      const header = section.querySelector('.science-header');
      const cards = section.querySelectorAll('.science-card');

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
    }, section);

    return () => {
      triggers.forEach(st => st.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="science" className="relative py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="science-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 opacity-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D7FF00]/10 flex items-center justify-center">
                <Atom className="w-5 h-5 text-[#D7FF00]" />
              </div>
              <span className="text-[#D7FF00] font-medium tracking-wider text-sm uppercase">Science</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F5F7] mb-4">Discover & Explore</h2>
            <p className="text-lg text-[#A3A3A3] max-w-xl">Breakthroughs, research, and wonders of the natural world</p>
          </div>
          <button className="group flex items-center gap-2 text-[#F5F5F7] font-medium hover:text-[#D7FF00] transition-colors">
            More in Science <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="science-card bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] h-80 animate-pulse" />
            ))
          ) : (
            content.map((item) => (
              <article key={item.id} className="science-card group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] hover:border-[#D7FF00]/30 transition-all duration-300 opacity-0">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-[#D7FF00] uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-xl font-bold text-[#F5F5F7] mt-2 mb-3 line-clamp-2 group-hover:text-[#D7FF00] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[#A3A3A3] line-clamp-2">{item.excerpt}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
