import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', id: 'fr-FR' },
    // { code: 'en', name: 'English (UK)', flag: '🇬🇧', id: 'en-GB' },
    { code: 'en', name: 'English', flag: '🇺🇸', id: 'en-US' },
    // { code: 'es', name: 'Español', flag: '🇪🇸', id: 'es-ES' },
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪', id: 'de-DE' },
    // { code: 'it', name: 'Italiano', flag: '🇮🇹', id: 'it-IT' },
    // { code: 'pt', name: 'Português', flag: '🇵🇹', id: 'pt-PT' },
    // { code: 'ru', name: 'Русский', flag: '🇷🇺', id: 'ru-RU' },
    // { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', id: 'hi-IN' },
    // { code: 'zh', name: '中文 (简体)', flag: '🇨🇳', id: 'zh-CN' },
    // { code: 'ja', name: '日本語', flag: '🇯🇵', id: 'ja-JP' },
    // { code: 'ar', name: 'العربية', flag: '🇸🇦', id: 'ar-SA' },
];

export default function AutoLanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [isTranslating, setIsTranslating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only auto-translate if we're on a fresh page load with saved non-French language
        const savedLangId = localStorage.getItem('selectedLanguage');
        const isFirstLoad = sessionStorage.getItem('hasTranslated') !== 'true';

        if (savedLangId && isFirstLoad) {
            const lang = languages.find(l => l.id === savedLangId);
            if (lang && lang.code !== 'fr') {
                sessionStorage.setItem('hasTranslated', 'true');
                translatePage(lang.code);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const translatePage = async (targetLang: string) => {
        if (targetLang === 'fr') {
            // Reload page to show original French content
            window.location.reload();
            return;
        }

        setIsTranslating(true);

        try {
            // Store original text content before translation
            const textNodes = getTextNodes(document.body);
            const textsToTranslate: string[] = [];
            const nodeMap = new Map<number, Text>();

            textNodes.forEach((node, index) => {
                const text = node.textContent?.trim();
                if (text && text.length > 0) {
                    textsToTranslate.push(text);
                    nodeMap.set(index, node);
                }
            });

            // Translate in batches
            const batchSize = 50;
            for (let i = 0; i < textsToTranslate.length; i += batchSize) {
                const batch = textsToTranslate.slice(i, i + batchSize);
                const translations = await translateBatch(batch, targetLang);

                // Apply translations to text nodes
                translations.forEach((translation, idx) => {
                    const nodeIndex = i + idx;
                    const node = nodeMap.get(nodeIndex);
                    if (node && translation) {
                        node.textContent = translation;
                    }
                });
            }
        } catch (error) {
            console.error('Translation error:', error);
            alert('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const translateBatch = async (texts: string[], targetLang: string): Promise<string[]> => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

            if (!apiKey) {
                console.error('Google Translate API key not found');
                return texts;
            }

            // Convert en-US to en for Google Translate API
            const googleLangCode = targetLang === 'en-US' ? 'en' : targetLang;

            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: texts,
                        source: 'fr',
                        target: googleLangCode, // Use the converted code
                        format: 'text'
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Translation request failed');
            }

            const data = await response.json();
            return data.data.translations.map((t: any) => t.translatedText);

        } catch (error) {
            console.error('Google Translation error:', error);
            return texts;
        }
    };

    const getTextNodes = (element: Node): Text[] => {
        const textNodes: Text[] = [];

        const walk = (node: Node) => {
            // Skip script, style, and input elements
            if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
                return;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text && text.length > 0) {
                    textNodes.push(node as Text);
                }
            } else {
                node.childNodes.forEach(walk);
            }
        };

        walk(element);
        return textNodes;
    };

    const handleLanguageChange = async (language: typeof languages[0]) => {
        // Update state FIRST before translation
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language.id);
        setIsOpen(false);

        // Small delay to ensure state update completes
        await new Promise(resolve => setTimeout(resolve, 50));

        // Then translate
        await translatePage(language.code);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isTranslating}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300 px-3 py-2 disabled:opacity-50"
                aria-label="Select language"
                title={isTranslating ? 'Translating...' : 'Change language'}
            >
                <span className="text-xl">{selectedLanguage.flag}</span>
                <Globe size={18} className={isTranslating ? 'animate-spin' : ''} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 max-h-80 overflow-y-auto">
                    {languages.map((language) => (
                        <button
                            key={language.id}
                            onClick={() => handleLanguageChange(language)}
                            disabled={isTranslating}
                            className={`w-full text-left px-4 py-2 flex items-center space-x-3 transition-colors disabled:opacity-50 ${selectedLanguage.id === language.id // Compare by ID
                                ? 'bg-blue-50 text-[#050E3C] font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                            {selectedLanguage.id === language.id && (
                                <span className="ml-auto text-blue-600">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {isTranslating && (
                <div className="absolute right-0 top-full mt-1 bg-blue-600 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap">
                    Translating...
                </div>
            )}
        </div>
    );
}