import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import StoreHeader from '@/components/store/StoreHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function TrackingSearch() {
  const [code, setCode] = useState('');
  const { getOrderByNumber } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const order = getOrderByNumber(code);
    if (order) {
      toast.success('Pedido encontrado!');
      navigate(`/pedido/${order.id}`);
    } else {
      toast.error('Pedido não encontrado. Verifique o código.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container py-12 max-w-lg mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border p-8 shadow-card text-center space-y-6"
        >
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
            <Search className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Rastrear Pedido</h1>
            <p className="text-sm text-muted-foreground">
              Insira o código do seu pedido (Ex: #001) para acompanhar o status da sua entrega em tempo real.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                #
              </span>
              <Input
                placeholder="001"
                value={code.replace('#', '')}
                onChange={(e) => setCode(e.target.value)}
                className="pl-8 h-14 text-lg font-bold rounded-2xl border-primary/20 focus:ring-primary/20"
              />
            </div>
            
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gradient-primary text-primary-foreground gap-2">
              Rastrear Agora <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <div className="pt-6 border-t">
            <div className="flex items-center gap-4 text-left p-4 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
              <MapPin className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Precisa de ajuda?</p>
                <p className="text-[10px] text-muted-foreground">O código do pedido está disponível no cupom impresso ou na tela de confirmação.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
