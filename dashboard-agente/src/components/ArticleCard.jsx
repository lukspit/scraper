import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bookmark, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingCard } from './GlowingCard';
import { useToast } from './Toast';
import { ArticleImage } from './ArticleImage';

export function ArticleCard({ article, index = 0 }) {
    const [isSaved, setIsSaved] = useState(article.is_saved);
    const [isHovered, setIsHovered] = useState(false);
    const { addToast } = useToast();

    const toggleSave = async () => {
        const newStatus = !isSaved;
        setIsSaved(newStatus);

        const { error } = await supabase
            .from('articles')
            .update({ is_saved: newStatus })
            .eq('id', article.id);

        if (error) {
            console.error('Error updating save status:', error);
            setIsSaved(!newStatus);
            addToast('Erro ao salvar artigo', 'error');
        } else {
            addToast(
                newStatus ? 'Artigo salvo!' : 'Removido dos salvos',
                'success'
            );
        }
    };

    const cleanSource = (source) => {
        return source.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    };

    const isNew = () => {
        const publishedDate = new Date(article.published_at);
        const now = new Date();
        const hoursDiff = (now - publishedDate) / (1000 * 60 * 60);
        return hoursDiff < 6;
    };

    const getReadTime = () => {
        const words = (article.summary || '').split(' ').length;
        const minutes = Math.ceil(words / 200);
        return minutes < 1 ? '< 1 min' : `${minutes} min`;
    };

    return (
        <GlowingCard>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={`
          glass p-6 rounded-2xl flex flex-col gap-4 
          transition-all duration-300 cursor-pointer
          hover:glass-hover hover:-translate-y-1
          ${isHovered ? 'glow-primary' : ''}
        `}
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                            {cleanSource(article.source)}
                        </span>
                        {isNew() && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-black bg-primary px-2 py-1 rounded-full">
                                <Sparkles size={12} />
                                NEW
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">
                        {new Date(article.published_at).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold leading-tight hover:text-primary transition-colors line-clamp-2">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                </h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
                    {article.summary || "Sem resumo disponível."}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSave}
                            className={`
                flex items-center gap-2 text-sm font-medium transition-all
                ${isSaved ? 'text-primary' : 'text-gray-400 hover:text-white'}
              `}
                        >
                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                            {isSaved ? "Salvo" : "Salvar"}
                        </button>

                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={14} />
                            {getReadTime()}
                        </span>
                    </div>

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
                    >
                        Ler
                        <ExternalLink size={16} />
                    </a>
                </div>
            </motion.div>
        </GlowingCard>
    );
}
