import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nameLocal: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nameLocal: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nameLocal: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nameLocal: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nameLocal: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nameLocal: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nameLocal: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nameLocal: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nameLocal: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nameLocal: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nameLocal: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nameLocal: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nameLocal: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nameLocal: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nameLocal: 'Polski', flag: '🇵🇱' },
];

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr',
  DE: 'de', AT: 'de',
  IT: 'it',
  PT: 'pt', BR: 'pt',
  RU: 'ru',
  JP: 'ja',
  KR: 'ko',
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
  SA: 'ar', AE: 'ar', EG: 'ar',
  IN: 'hi',
  TR: 'tr',
  NL: 'nl',
  PL: 'pl',
};

const translations: Record<string, Record<string, string>> = {
  en: {
    'site.name': 'zeeked',
    'site.tagline': 'What the world is clicking.',
    'nav.search': 'Search',
    'nav.menu': 'Menu',
    'nav.categories': 'Categories',
    'nav.trending': 'Trending',
    'nav.country': 'Country',
    'nav.language': 'Language',
    'hero.title': 'What the world is clicking.',
    'hero.subtitle': 'Trending topics, viral stories, and what\'s next—curated for you.',
    'hero.cta': 'Start exploring',
    'section.trending': 'Trending',
    'section.trending.subtitle': 'The stories gaining momentum right now.',
    'section.culture': 'Culture',
    'section.culture.subtitle': 'Music, art, and the moments shaping taste.',
    'section.sports': 'Sports',
    'section.sports.subtitle': 'Highlights, comebacks, and what\'s happening now.',
    'section.business': 'Business',
    'section.business.subtitle': 'Markets, moves, and what matters.',
    'section.entertainment': 'Entertainment',
    'section.entertainment.subtitle': 'The shows, stars, and stories people are talking about.',
    'section.tech': 'Tech',
    'section.tech.subtitle': 'The products and platforms changing how we live.',
    'section.science': 'Science',
    'section.science.subtitle': 'Discoveries, space, and the future.',
    'section.health': 'Health',
    'section.health.subtitle': 'Training, recovery, and everyday performance.',
    'section.viral': 'Viral',
    'section.viral.subtitle': 'What\'s spreading—and why.',
    'cta.explore': 'Explore',
    'cta.viewByCountry': 'View by country',
    'cta.seeAll': 'See all',
    'cta.loadMore': 'Load more',
    'footer.stayZeeked': 'Stay zeeked.',
    'footer.subtitle': 'Get the feed tailored to your country and interests.',
    'footer.exploreCategory': 'Explore by category',
    'footer.setCountry': 'Set your country',
    'footer.about': 'About',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    'search.placeholder': 'Search topics...',
    'search.results': 'Search results',
    'search.noResults': 'No results found',
    'content.readMore': 'Read more',
    'content.related': 'Related stories',
    'content.share': 'Share',
    'content.save': 'Save',
    'ad.label': 'Advertisement',
  },
  es: {
    'site.name': 'zeeked',
    'site.tagline': 'Lo que el mundo está clickeando.',
    'nav.search': 'Buscar',
    'nav.menu': 'Menú',
    'nav.categories': 'Categorías',
    'nav.trending': 'Tendencias',
    'nav.country': 'País',
    'nav.language': 'Idioma',
    'hero.title': 'Lo que el mundo está clickeando.',
    'hero.subtitle': 'Temas de tendencia, historias virales y lo que viene—curado para ti.',
    'hero.cta': 'Comenzar a explorar',
    'section.trending': 'Tendencias',
    'section.trending.subtitle': 'Las historias ganando impulso ahora mismo.',
    'section.culture': 'Cultura',
    'section.culture.subtitle': 'Música, arte y los momentos que definen el gusto.',
    'section.sports': 'Deportes',
    'section.sports.subtitle': 'Destacados, regresos y lo que está pasando ahora.',
    'section.business': 'Negocios',
    'section.business.subtitle': 'Mercados, movimientos y lo que importa.',
    'section.entertainment': 'Entretenimiento',
    'section.entertainment.subtitle': 'Los shows, estrellas e historias de las que todos hablan.',
    'section.tech': 'Tecnología',
    'section.tech.subtitle': 'Los productos y plataformas cambiando cómo vivimos.',
    'section.science': 'Ciencia',
    'section.science.subtitle': 'Descubrimientos, espacio y el futuro.',
    'section.health': 'Salud',
    'section.health.subtitle': 'Entrenamiento, recuperación y rendimiento diario.',
    'section.viral': 'Viral',
    'section.viral.subtitle': 'Lo que se está difundiendo—y por qué.',
    'cta.explore': 'Explorar',
    'cta.viewByCountry': 'Ver por país',
    'cta.seeAll': 'Ver todo',
    'cta.loadMore': 'Cargar más',
    'footer.stayZeeked': 'Mantente zeeked.',
    'footer.subtitle': 'Obtén contenido adaptado a tu país e intereses.',
    'footer.exploreCategory': 'Explorar por categoría',
    'footer.setCountry': 'Establecer tu país',
    'footer.about': 'Acerca de',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.contact': 'Contacto',
    'search.placeholder': 'Buscar temas...',
    'search.results': 'Resultados de búsqueda',
    'search.noResults': 'No se encontraron resultados',
    'content.readMore': 'Leer más',
    'content.related': 'Historias relacionadas',
    'content.share': 'Compartir',
    'content.save': 'Guardar',
    'ad.label': 'Publicidad',
  },
};

const getTranslation = (lang: string, key: string): string => {
  const langTranslations = translations[lang] || translations.en;
  return langTranslations[key] || translations.en[key] || key;
};

const STORAGE_KEY = 'zeeked_language';

interface UseI18nReturn {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: Language[];
  currentLanguage: Language;
  detectLanguage: (countryCode?: string) => string;
}

export const useI18n = (countryCode?: string): UseI18nReturn => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLanguageState(saved);
    } else {
      const detected = detectLanguage(countryCode);
      setLanguageState(detected);
    }
  }, [countryCode]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    const langData = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    document.documentElement.dir = langData?.rtl ? 'rtl' : 'ltr';
  }, []);

  const detectLanguage = useCallback((country?: string): string => {
    if (country) {
      const countryLang = COUNTRY_LANGUAGE_MAP[country.toUpperCase()];
      if (countryLang) return countryLang;
    }
    const browserLang = navigator.language?.split('-')[0] || 'en';
    return SUPPORTED_LANGUAGES.find(l => l.code === browserLang)?.code || 'en';
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(language, key);
  }, [language]);

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return {
    language,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
    currentLanguage,
    detectLanguage,
  };
};

export default useI18n;
