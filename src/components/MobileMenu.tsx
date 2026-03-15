import { useEffect } from 'react';
import { X, Home, TrendingUp, Globe, Zap, Settings, HelpCircle } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Home', href: '#' },
  { icon: TrendingUp, label: 'Trending', href: '#trending' },
  { icon: Globe, label: 'Categories', href: '#categories' },
  { icon: Zap, label: 'Viral', href: '#viral' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-[#141414] border-l border-[#1F1F1F] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#1F1F1F]">
          <span className="text-lg font-bold text-[#F5F5F7]">Menu</span>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1F1F1F] text-[#A3A3A3]">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 border-b border-[#1F1F1F]">
          <span className="text-xs text-[#525252] uppercase tracking-wider mb-2 block">Language</span>
          <LanguageSelector />
        </div>
        <nav className="p-4">
          <span className="text-xs text-[#525252] uppercase tracking-wider mb-2 block">Navigation</span>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a href={item.href} onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#F5F5F7] hover:bg-[#1F1F1F] transition-colors">
                    <Icon className="w-5 h-5 text-[#A3A3A3]" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#1F1F1F]">
          <span className="text-xs text-[#525252] uppercase tracking-wider mb-2 block">Categories</span>
          <div className="flex flex-wrap gap-2">
            {['Tech', 'Business', 'Sports', 'Entertainment', 'Science', 'Health'].map((cat) => (
              <a key={cat} href={`#${cat.toLowerCase()}`} onClick={onClose} className="px-3 py-1.5 bg-[#1F1F1F] rounded-full text-sm text-[#A3A3A3] hover:text-[#F5F5F7] hover:bg-[#2A2A2A] transition-colors">{cat}</a>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1F1F1F] bg-[#141414]">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#A3A3A3] hover:text-[#F5F5F7] hover:bg-[#1F1F1F] transition-colors">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
