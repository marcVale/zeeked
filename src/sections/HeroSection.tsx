import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  t: (key: string) => string;
}

const HeroSection = ({ onExplore, t }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(imageRef.current, { opacity: 0, x: '-6vw' }, { opacity: 1, x: 0, duration: 0.6 }, 0);
      tl.fromTo(barRef.current, { scaleX: 0, y: '2vh' }, { scaleX: 1, y: 0, duration: 0.6, transformOrigin: 'left center' }, 0.15);
      const headlineLines = headlineRef.current?.querySelectorAll('.headline-line');
      if (headlineLines) {
        tl.fromTo(headlineLines, { y: '4vh', opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 0.35);
      }
      tl.fromTo([subheadlineRef.current, ctaRef.current], { y: '2vh', opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, 0.65);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([imageRef.current, barRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current], { opacity: 1, x: 0, y: 0, scaleX: 1 });
          },
        },
      });
      scrollTl.fromTo(barRef.current, { x: 0, opacity: 1 }, { x: '-60vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(subheadlineRef.current, { x: 0, opacity: 1 }, { x: '12vw', opacity: 0, ease: 'power2.in' }, 0.72);
      scrollTl.fromTo(ctaRef.current, { x: 0, opacity: 1 }, { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.74);
      scrollTl.fromTo(imageRef.current, { x: 0, scale: 1, opacity: 1 }, { x: '-20vw', scale: 1.06, opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-10" style={{ background: '#0B0B0D' }}>
      <div ref={imageRef} className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80" alt="Nightlife" className="w-full h-full object-cover" style={{ filter: 'saturate(0.6) contrast(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0B0D]/50" />
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center px-[6vw]">
        <div ref={headlineRef} className="mb-8">
          <h1 className="heading-display text-[#F5F5F77]" style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}>
            <span className="headline-line block">What the</span>
            <span className="headline-line block">world is</span>
            <span className="headline-line block">clicking.</span>
          </h1>
        </div>
        <p ref={subheadlineRef} className="text-[#B8B8BD] text-lg max-w-md mb-8" style={{ lineHeight: 1.6 }}>{t('hero.subtitle')}</p>
        <button ref={ctaRef} onClick={onExplore} className="group flex items-center gap-2 text-[#F5F5F7] font-medium hover:text-[#D7FF00] transition-colors w-fit">
          <span className="relative">{t('hero.cta')}<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D7FF00]" /></span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div ref={barRef} className="absolute left-0 top-[62vh] w-full h-[10vh] neon-bar" style={{ transformOrigin: 'left center' }} />
    </section>
  );
};

export default HeroSection;
