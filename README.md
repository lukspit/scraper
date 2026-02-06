# AI Pulse Dashboard

Dashboard interativo e premium para acompanhamento de notícias de IA em tempo real.

## 🚀 Features

- **Hero Section Premium** com saudação personalizada e estatísticas
- **Cards de Artigos** com:
  - Imagens dinâmicas (gradientes por fonte)
  - Hover effects com glow Neon Lime
  - Badges "NEW" para artigos recentes
  - Tempo de leitura estimado
  - Sistema de salvamento
- **Search Bar** com busca em tempo real
- **Toast Notifications** para feedback visual
- **Scroll Progress Bar**
- **View Toggle** (Grid/List)
- **Glowing Effect** ao passar mouse nos cards

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Framer Motion** (animações)
- **Supabase JS Client**
- **Lucide React** (ícones)

### Backend
- **Python 3**
- **Supabase** (PostgreSQL)
- **BeautifulSoup4** (scraping)
- **Schedule** (automação)

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/lukspit/scraper.git
cd scraper
```

### 2. Configure o Backend

```bash
# Instale as dependências Python
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

### 3. Configure o Frontend

```bash
cd dashboard-agente
npm install
```

### 4. Configure o Supabase

Crie um projeto no [Supabase](https://supabase.com) e execute a migration:

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  summary TEXT,
  is_saved BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_source ON articles(source);
CREATE INDEX idx_articles_is_saved ON articles(is_saved);
```

## 🎯 Como Usar

### Rodar o Dashboard (Frontend)

```bash
cd dashboard-agente
npm run dev
```

Acesse: **http://localhost:5173**

### Rodar o Scraper (Backend)

#### Execução única:
```bash
python3 tools/scraper_engine.py
```

#### Execução automática (24h):
```bash
python3 tools/scheduler.py
```

## 🎨 Design

- **Paleta de Cores**: Neon Lime (#BFF549) + Black (#000000)
- **Fonte**: Inter (Google Fonts)
- **Estilo**: Glassmorphism + Dark Mode
- **Inspiração**: FitSpark Dashboard

## 📁 Estrutura do Projeto

```
scraper/
├── dashboard-agente/          # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── lib/              # Supabase client
│   │   ├── App.jsx           # App principal
│   │   └── index.css         # Estilos globais
│   └── package.json
├── tools/                     # Backend Python
│   ├── scraper_engine.py     # Engine de scraping
│   ├── db_manager.py         # Gerenciador Supabase
│   ├── scheduler.py          # Automação 24h
│   └── verify_supabase.py    # Teste de conexão
├── architecture/              # Documentação técnica
│   ├── SCRAPER_SOP.md
│   └── DB_SOP.md
├── gemini.md                 # Project Constitution
└── task_plan.md              # Plano de tarefas

```

## 🔧 Configuração

### Variáveis de Ambiente

**Backend (.env)**:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Frontend (dashboard-agente/.env)**:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## 📝 Fontes de Dados

- **Hacker News** (Show HN)
- **Ben's Bites** (Newsletter)
- **AI Rundown** (Newsletter)
- **Reddit** (r/artificial, r/MachineLearning)

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro.

## 📄 Licença

MIT

## 🙏 Créditos

- Design inspirado em [FitSpark](https://21st.dev)
- Glowing effect da [Aceternity UI](https://21st.dev/community/components/aceternity/glowing-effect/default)
- Construído com [B.L.A.S.T. Protocol](https://github.com/lukspit/scraper)
