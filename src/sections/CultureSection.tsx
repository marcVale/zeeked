import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Music } from 'lucide-react';

interface CultureSectionProps {
  t: (key: string) => string;
}

const CultureSection = ({ t }: CultureSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topImageRef = useRef<HTMLDivElement>(null);
  const bottomImageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } });
      scrollTl.fromTo(topImageRef.current, { y: '-60vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(bottomImageRef.current, { y: '60vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(barRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'none', transformOrigin: 'left center' }, 0.05);
      scrollTl.fromTo(headlineRef.current, { x: '40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05);
      scrollTl.fromTo(topImageRef.current, { y: 0, opacity: 1 }, { y: '-18vh', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(bottomImageRef.current, { y: 0, opacity: 1 }, { y: '18vh', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(barRef.current, { x: 0, opacity: 1 }, { x: '20vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '12vw', opacity: 0, ease: 'power2.in' }, 0.72);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-30" style={{ background: '#0B0B0D' }}>
      <div ref={topImageRef} className="absolute left-[7vw] top-[10vh] w-[86vw] h-[44vh] rounded-[18px] overflow-hidden" style={{ boxShadow: '0 28px 90px rgba(0,0,0,0.55)' }}>
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80" alt="Concert crowd" className="w-full h-full object-cover" style={{ filter: 'saturate(0.6) contrast(1.1)' }} />
      </div>
      <div ref={bottomImageRef} className="absolute left-[7vw] top-[60vh] w-[34vw] h-[30vh] rounded-[14px] overflow-hidden" style={{ boxShadow: '0 28px 90px rgba(0,0,0,0.55)' }}>
        <img src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&q=80" alt="DJ" className="w-full h-full object-cover" style={{ filter: 'saturate(0.6) contrast(1.1)' }} />
      </div>
      <div ref={headlineRef} className="absolute left-[46vw] top-[60vh] w-[47vw] h-[30vh] flex flex-col justify-center">
        <h2 className="heading-display text-[#F5F5F7] mb-4" style={{ fontSize: 'clamp(48px, 6vw, 100px)' }}>{t('section.culture')}</h2>
        <p className="text-[#B8B8BD] text-lg max-w-sm mb-6" style={{ lineHeight: 1.6 }}>{t('section.culture.subtitle')}</p>
        <div className="flex items-center gap-4">
          <button className="group flex items-center gap-2 px-5 py-2.5 bg-[#D7FF00] text-[#0B0B0D] font-semibold rounded-full hover:bg-[#e0ff33] transition-colors text-sm">{t('cta.explore')}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
          <button className="group flex items-center gap-2 text-[#F5F5F7] font-medium hover:text-[#D7FF00] transition-colors text-sm"><Music className="w-4 h-4" />Latest in music</button>
        </div>
      </div>
      <div ref={barRef} className="absolute left-[44vw] top-[72vh] w-[49vw] h-[8vh] neon-bar rounded-full" style={{ transformOrigin: 'left center' }} />
    </section>
  );
};

export default CultureSection;
