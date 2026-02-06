import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { ArticleCard } from './components/ArticleCard';
import { StatCard } from './components/StatCard';
import { ToastProvider } from './components/Toast';
import { ScrollProgress } from './components/ScrollProgress';
import { ViewToggle } from './components/ViewToggle';
import { Newspaper, Bookmark, Zap, RefreshCw, TrendingUp, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

function AppContent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const fetchArticles = async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (filter === 'saved') {
      query = query.eq('is_saved', true);
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching articles:', error);
    else setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const filteredArticles = articles.filter(article => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query) ||
      (article.summary || '').toLowerCase().includes(query)
    );
  });

  const stats = {
    total: articles.length,
    saved: articles.filter(a => a.is_saved).length,
    sources: [...new Set(articles.map(a => a.source))].length,
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <ScrollProgress />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12 space-y-12">

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2">
              {getGreeting()}, <span className="text-gradient">Agente</span>
            </h1>
            <p className="text-xl text-gray-400">Seu resumo diário de IA está pronto</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Newspaper}
              label="Total de Artigos"
              value={stats.total}
              delay={0.1}
            />
            <StatCard
              icon={Bookmark}
              label="Salvos"
              value={stats.saved}
              delay={0.2}
            />
            <StatCard
              icon={TrendingUp}
              label="Fontes Ativas"
              value={stats.sources}
              delay={0.3}
            />
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-full bg-white/5 border border-white/10 
                         text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 
                         transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-semibold transition-all
                  ${filter === 'all'
                    ? 'bg-primary text-black shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white hover:bg-white/10'
                  }
                `}
              >
                Últimas
              </button>
              <button
                onClick={() => setFilter('saved')}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-semibold transition-all
                  ${filter === 'saved'
                    ? 'bg-primary text-black shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white hover:bg-white/10'
                  }
                `}
              >
                Salvos
              </button>
              <ViewToggle view={view} onViewChange={setView} />
              <button
                onClick={fetchArticles}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110"
                title="Atualizar"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <p className="text-sm text-gray-400">
              {filteredArticles.length} resultado{filteredArticles.length !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
          )}
        </motion.header>

        {/* Articles Grid */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-white/5 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32"
            >
              <Zap className="mx-auto mb-6 text-primary" size={64} />
              <h3 className="text-2xl font-bold mb-2">
                {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum artigo encontrado'}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Tente buscar com outros termos.'
                  : filter === 'saved'
                    ? 'Você ainda não salvou nenhum artigo.'
                    : 'Execute o scraper para buscar novos artigos.'}
              </p>
            </motion.div>
          ) : (
            <div className={`
              grid gap-6 
              ${view === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
              }
            `}>
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
