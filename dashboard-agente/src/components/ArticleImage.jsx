import React from 'react';
import { Newspaper, Zap, MessageCircle } from 'lucide-react';

export function ArticleImage({ article }) {
    // Generate consistent color from title hash
    const getGradientFromTitle = (title) => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue1 = Math.abs(hash % 360);
        const hue2 = (hue1 + 60) % 360;

        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 30%) 100%)`;
    };

    // Source-specific colors and icons
    const sourceConfig = {
        'hacker_news': {
            gradient: 'linear-gradient(135deg, #ff6600 0%, #cc5200 100%)',
            icon: MessageCircle,
            color: '#ff6600'
        },
        'bens_bites': {
            gradient: 'linear-gradient(135deg, #BFF549 0%, #8BC34A 100%)',
            icon: Zap,
            color: '#BFF549'
        },
        'ai_rundown': {
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            icon: Newspaper,
            color: '#60a5fa'
        },
        'reddit': {
            gradient: 'linear-gradient(135deg, #ff4500 0%, #cc3700 100%)',
            icon: MessageCircle,
            color: '#ff4500'
        }
    };

    const config = sourceConfig[article.source] || {
        gradient: getGradientFromTitle(article.title),
        icon: Newspaper,
        color: '#BFF549'
    };

    const Icon = config.icon;

    // If article has real image, use it
    if (article.image_url) {
        return (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/20">
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div
                    className="hidden w-full h-full items-center justify-center"
                    style={{ background: config.gradient }}
                >
                    <Icon size={48} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                </div>
            </div>
        );
    }

    // Gradient placeholder
    return (
        <div
            className="relative w-full h-48 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: config.gradient }}
        >
            <Icon size={48} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                }}
            />
        </div>
    );
}
