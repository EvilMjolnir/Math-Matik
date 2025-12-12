import React from 'react';
import { 
  Footprints, Sword, Search, FlaskConical, 
  Heart, Shield, Star, Coins, Flame, Skull, 
  Zap, Crown, Map, Settings
} from 'lucide-react';

interface MarkdownLiteProps {
  content: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  'footprints': Footprints,
  'sword': Sword,
  'search': Search,
  'flask': FlaskConical,
  'heart': Heart,
  'shield': Shield,
  'star': Star,
  'coins': Coins,
  'flame': Flame,
  'skull': Skull,
  'zap': Zap,
  'crown': Crown,
  'map': Map,
  'settings': Settings
};

export const MarkdownLite: React.FC<MarkdownLiteProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  const parseInline = (text: string) => {
    // 1. Split by Icon syntax [icon:name]
    const iconParts = text.split(/(\[icon:[a-z]+\])/g);
    
    return iconParts.map((part, i) => {
      // Handle Icon
      if (part.startsWith('[icon:') && part.endsWith(']')) {
        const iconName = part.slice(6, -1);
        const IconComponent = ICON_MAP[iconName];
        if (IconComponent) {
          return <IconComponent key={i} className="w-5 h-5 inline-block mx-1 -mt-1 text-amber-600" />;
        }
        return null;
      }

      // Handle Bold **text** within the remaining parts
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((subPart, j) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <strong key={`${i}-${j}`} className="font-bold text-amber-800">{subPart.slice(2, -2)}</strong>;
        }
        return <span key={`${i}-${j}`}>{subPart}</span>;
      });
    });
  };

  return (
    <div className="space-y-2 font-serif text-parchment-900">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        
        // Header 3 (### Title)
        if (trimmed.startsWith('### ')) {
            return (
                <h3 key={i} className="text-xl font-bold text-amber-900 mt-6 mb-3 border-b-2 border-parchment-400 pb-1 flex items-center">
                    {parseInline(trimmed.slice(4))}
                </h3>
            );
        }

        // Header 2 (## Title)
        if (trimmed.startsWith('## ')) {
            return (
                <h2 key={i} className="text-2xl font-bold text-parchment-900 mt-8 mb-4 border-b-2 border-amber-600 pb-2">
                    {parseInline(trimmed.slice(3))}
                </h2>
            );
        }

        // List Item (- Item)
        if (trimmed.startsWith('- ')) {
            return (
                <div key={i} className="flex items-start ml-4 mb-2">
                    <span className="mr-2 text-amber-600 mt-1.5 text-[10px]">●</span>
                    <span className="flex-1 leading-relaxed text-parchment-800">{parseInline(trimmed.slice(2))}</span>
                </div>
            );
        }

        // Empty line (Paragraph break)
        if (trimmed === '') {
            return <div key={i} className="h-2" />;
        }

        // Standard Paragraph
        return <p key={i} className="leading-relaxed text-parchment-800">{parseInline(line)}</p>;
      })}
    </div>
  );
};
