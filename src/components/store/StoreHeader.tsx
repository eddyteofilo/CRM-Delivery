import { ShoppingCart, User, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function StoreHeader() {
  const { config, cart } = useApp();
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">{config.logo}</span>
          <span className="font-bold text-lg text-foreground">{config.name}</span>
        </Link>
        <div className="flex items-center gap-3">
          {config.isOpen ? (
            <Badge variant="default" className="bg-success text-success-foreground text-xs">Aberto</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">Fechado</Badge>
          )}
          
          <button
            onClick={() => navigate('/rastrear')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="Rastrear Pedido"
          >
            <Search className="h-6 w-6 text-foreground" />
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="Área Administrativa"
          >
            <User className="h-6 w-6 text-foreground" />
          </button>

          <button
            onClick={() => navigate('/carrinho')}
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-slide-up">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
