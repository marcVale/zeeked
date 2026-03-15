import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Flame } from 'lucide-react';

interface ViralSectionProps {
  t: (key: string) => string;
}

const ViralSection = ({ t }: ViralSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } });
      scrollTl.fromTo(imageRef.current, { x: '18vw', scale: 1.12, opacity: 0.6 }, { x: 0, scale: 1, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(barRef.current, { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(headlineRef.current, { x: '-40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo([subheadlineRef.current, ctaRef.current], { y: '6vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none', stagger: 0.02 }, 0.05);
      scrollTl.fromTo(imageRef.current, { x: 0, scale: 1, opacity: 1 }, { x: '-12vw', scale: 1.05, opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(barRef.current, { x: 0, opacity: 1 }, { x: '-40vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo([subheadlineRef.current, ctaRef.current], { y: 0, opacity: 1 }, { y: '-3vh', opacity: 0, ease: 'power2.in', stagger: 0.02 }, 0.72);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-[100]" style={{ background: '#0B0B0D' }}>
      <div ref={imageRef} className="absolute inset-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80" alt="People with phones" className="w-full h-full object-cover" style={{ filter: 'saturate(0.6) contrast(1.1)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,11,13,0.85) 0%, rgba(11,11,13,0.4) 55%, rgba(11,11,13,0.6) 100%)' }} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-[7vw]">
        <h2 ref={headlineRef} className="heading-display text-[#F5F5F7] mb-6" style={{ fontSize: 'clamp(72px, 10vw, 160px)' }}>{t('section.viral')}</h2>
        <p ref={subheadlineRef} className="text-[#B8B8BD] text-xl max-w-md mb-8" style={{ lineHeight: 1.6 }}>{t('section.viral.subtitle')}</p>
        <div ref={ctaRef} className="flex items-center gap-6">
          <button className="group flex items-center gap-2 px-6 py-3 bg-[#D7FF00] text-[#0B0B0D] font-semibold rounded-full hover:bg-[#e0ff33] transition-colors">{t('cta.explore')}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
          <button className="group flex items-center gap-2 text-[#F5F5F7] font-medium hover:text-[#D7FF00] transition-colors"><Flame className="w
