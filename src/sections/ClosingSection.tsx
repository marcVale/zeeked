import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Globe, ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const content = section.querySelector('.closing-content');
      const stats = section.querySelectorAll('.closing-stat');
      const cta = section.querySelector('.closing-cta');

      if (content) {
        const st = ScrollTrigger.create({
          trigger: content,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(content,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
          },
          once: true
        });
        triggers.push(st);
      }

      stats.forEach((stat, i) => {
        const st = ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(stat,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.5, delay: i * 0.15, ease: 'back.out(1.7)' }
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
      className="relative py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D7FF00]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="closing-content text-center max-w-4xl mx-auto opacity-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D7FF00]/10 rounded-full border border-[#D7FF00]/30 mb-8">
            <Sparkles className="w-4 h-4 text-[#D7FF00]" />
            <span className="text-sm font-medium text-[#D7FF00]">Join the Movement</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F5F7] mb-6 leading-tight">
            Stay Ahead of the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF00] to-[#9AFF00]">
              Curve
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#A3A3A3] mb-12 max-w-2xl mx-auto">
            Join millions of readers who trust Zeeked to deliver the stories that matter, 
            curated from every corner of the globe.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 mb-12">
            <div className="closing-stat opacity-0">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#D7FF00]/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#D7FF00]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">50+</div>
              <div className="text-sm text-[#A3A3A3]">Countries</div>
            </div>

            <div className="closing-stat opacity-0">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#D7FF00]/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#D7FF00]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">10K+</div>
              <div className="text-sm text-[#A3A3A3]">Daily Stories</div>
            </div>

            <div className="closing-stat opacity-0">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#D7FF00]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#D7FF00]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-1">2M+</div>
              <div className="text-sm text-[#A3A3A3]">Readers</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="closing-cta flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
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
        </div>
      </div>
    </section>
  );
}
