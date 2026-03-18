import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNewOrderNotification } from '@/hooks/useNewOrderNotification';

export default function AdminDashboard() {
  const { orders } = useApp();
  useNewOrderNotification(orders);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    return { todayCount: todayOrders.length, revenue, pending, delivered };
  }, [orders]);

  const statCards = [
    { label: 'Pedidos Hoje', value: stats.todayCount, icon: ShoppingBag, color: 'text-primary' },
    { label: 'Faturamento', value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: 'text-success' },
    { label: 'Em Andamento', value: stats.pending, icon: Clock, color: 'text-secondary' },
    { label: 'Entregues', value: stats.delivered, icon: CheckCircle, color: 'text-success' },
  ];

  const recentOrders = orders.slice(0, 5);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      received: 'bg-primary/10 text-primary',
      preparing: 'bg-secondary/10 text-secondary',
      delivering: 'bg-warning/10 text-warning',
      delivered: 'bg-success/10 text-success',
    };
    const labels: Record<string, string> = {
      received: 'Recebido',
      preparing: 'Preparando',
      delivering: 'Entregando',
      delivered: 'Entregue',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral da sua pizzaria</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-xl border p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border shadow-card">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Pedidos Recentes</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{order.number} - {order.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.map(i => `${i.quantity}x ${i.halfFlavor ? `½ ${i.pizza.name} • ½ ${i.halfFlavor}` : i.pizza.name}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  {statusBadge(order.status)}
                  <p className="text-sm font-medium text-foreground mt-1">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">Nenhum pedido ainda</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
