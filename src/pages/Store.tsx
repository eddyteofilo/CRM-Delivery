import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import StoreHeader from '@/components/store/StoreHeader';
import PizzaCard from '@/components/store/PizzaCard';
import heroPizza from '@/assets/hero-pizza.jpg';

export default function Store() {
  const { pizzas, config } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = useMemo(() => {
    const cats = [...new Set(pizzas.filter(p => p.available).map(p => p.category))];
    return ['Todas', ...cats];
  }, [pizzas]);

  const filtered = useMemo(() => {
    return pizzas.filter(p => {
      if (!p.available) return false;
      if (activeCategory !== 'Todas' && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pizzas, activeCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      {/* Hero */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={heroPizza} alt="Pizza artesanal" className="w-full h-full object-cover" />
        {/* Camada de contraste reforçada para garantir leitura em qualquer imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10" /> {/* Filtro sutil de escurecimento geral */}
        
        <div className="absolute bottom-4 left-0 right-0 container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            {config.name}
          </motion.h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-medium text-foreground bg-background/40 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
              Tempo estimado: ~{config.avgPrepTime}min • Entrega: R$ {config.deliveryFee.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pizza..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pizza List */}
        <div className="space-y-3 pb-24">
          {filtered.map((pizza, idx) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <PizzaCard pizza={pizza} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Nenhuma pizza encontrada 😔</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
