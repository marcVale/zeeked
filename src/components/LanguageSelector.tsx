import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useI18n();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#141414] border border-[#1F1F1F] hover:border-[#525252] transition-colors text-sm"
      >
        <Globe className="w-4 h-4 text-[#A3A3A3]" />
        <span className="hidden sm:inline text-[#F5F5F7]">{currentLanguage.flag}</span>
        <span className="text-[#F5F5F7]">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-[#A3A3A3] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#141414] rounded-xl border border-[#1F1F1F] shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  language === lang.code
                    ? 'bg-[#D7FF00]/10 text-[#D7FF00]'
                    : 'text-[#F5F5F7] hover:bg-[#1F1F1F]'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-sm">{lang.name}</span>
                {language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
