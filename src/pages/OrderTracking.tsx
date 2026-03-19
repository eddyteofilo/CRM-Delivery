import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ArrowLeft, Share2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import StoreHeader from '@/components/store/StoreHeader';
import OrderTimeline from '@/components/store/OrderTimeline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LiveTrackingMap from '@/components/common/LiveTrackingMap';


export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = useState(getOrder(id || ''));

  // Polling for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getOrder(id || '');
      if (updated) setOrder(updated);
    }, 3000);
    return () => clearInterval(interval);
  }, [id, getOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground text-lg">Pedido não encontrado</p>
          <Button onClick={() => navigate('/')} className="mt-4">Voltar</Button>
        </div>
      </div>
    );
  }

  const shareLink = `${window.location.origin}/pedido/${order.id}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copiado!');
  };

  const statusLabels = {
    received: 'Pedido Recebido',
    preparing: 'Em Preparo',
    delivering: 'Saiu para Entrega',
    delivered: 'Entregue!',
  };

  const paymentLabels = { pix: 'Pix', cash: 'Dinheiro', card: 'Cartão' };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container py-6 max-w-lg mx-auto space-y-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar ao cardápio
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Order Header */}
          <div className="bg-card rounded-xl border p-6 shadow-card text-center mb-4">
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
              order.status === 'delivered' ? 'bg-success/10 text-success' :
              order.status === 'delivering' ? 'bg-secondary/10 text-secondary' :
              'bg-primary/10 text-primary'
            }`}>
              {statusLabels[order.status]}
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pedido {order.number}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
            <button
              onClick={handleShare}
              className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Share2 className="h-4 w-4" /> Compartilhar rastreio
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl border p-6 shadow-card mb-4 text-left">
            <h2 className="font-semibold text-foreground mb-4">Acompanhamento</h2>
            <OrderTimeline currentStatus={order.status} />

            {order.deliveryType === 'delivery' && (order.status === 'preparing' || order.status === 'delivering' || order.status === 'delivered') && order.address && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  🗺️ Rastreio em Tempo Real
                  {order.status === 'delivering' && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold animate-pulse">AO VIVO</span>
                  )}
                </h3>
                <LiveTrackingMap
                  orderId={order.id}
                  orderNumber={order.number}
                  customerAddress={order.address}
                  pizzeriaAddress={config.pizzeriaAddress || ''}
                  distanceKm={order.distanceKm}
                  status={order.status as 'preparing' | 'delivering' | 'delivered'}
                  createdAt={order.createdAt}
                  avgPrepTime={config.avgPrepTime || 30}
                />
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-xl border p-6 shadow-card space-y-3">
            <h2 className="font-semibold text-foreground">Detalhes</h2>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.quantity}x {item.halfFlavor ? `½ ${item.pizza.name} • ½ ${item.halfFlavor}` : item.pizza.name} ({item.size.name})
                </span>
                <span className="text-muted-foreground">R$ {item.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}</span>
                <span>{order.deliveryType === 'delivery' ? `R$ ${(order.total - order.items.reduce((s, i) => s + i.subtotal, 0)).toFixed(2).replace('.', ',')}` : 'Grátis'}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground mt-1">
                <span>Total</span>
                <span className="text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <div className="border-t pt-2 text-sm text-muted-foreground space-y-1">
              <p>Pagamento: {paymentLabels[order.paymentMethod]}</p>
              <p>Cliente: {order.customerName}</p>
              {order.address && <p>Endereço: {order.address}</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
