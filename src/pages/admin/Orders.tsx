import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { OrderStatus } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNewOrderNotification } from '@/hooks/useNewOrderNotification';
import { Bike, Map as MapIcon } from 'lucide-react';
import DeliveryMap from '@/components/common/DeliveryMap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusFlow: OrderStatus[] = ['received', 'preparing', 'delivering', 'delivered'];
const statusLabels: Record<string, string> = {
  received: 'Recebido', preparing: 'Preparando', delivering: 'Entregando', delivered: 'Entregue',
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, drivers, assignDriver } = useApp();
  useNewOrderNotification(orders);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const availableDrivers = drivers.filter(d => d.available);

  const advanceStatus = (orderId: string, current: OrderStatus) => {
    const idx = statusFlow.indexOf(current);
    if (idx < statusFlow.length - 1) {
      updateOrderStatus(orderId, statusFlow[idx + 1]);
      toast.success(`Status atualizado para: ${statusLabels[statusFlow[idx + 1]]}`);
    }
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    assignDriver(orderId, driverId);
    const driver = drivers.find(d => d.id === driverId);
    toast.success(`Entregador ${driver?.name} atribuído!`);
  };

  const statusStyles: Record<string, string> = {
    received: 'bg-primary/10 text-primary',
    preparing: 'bg-secondary/10 text-secondary',
    delivering: 'bg-warning/10 text-warning',
    delivered: 'bg-success/10 text-success',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Gestão de Pedidos</h1>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', ...statusFlow].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === s ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s === 'all' ? 'Todos' : statusLabels[s]}
              {s !== 'all' && ` (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(order => {
            const assignedDriver = drivers.find(d => d.id === order.driverId);
            return (
              <div key={order.id} className="bg-card rounded-xl border p-4 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{order.number}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      {order.deliveryType === 'delivery' && (
                        <span className="text-xs text-muted-foreground">🛵 Entrega</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName} • {order.customerPhone}</p>
                    {order.address && <p className="text-xs text-muted-foreground mt-0.5">📍 {order.address}</p>}
                    {order.distanceKm && (
                      <p className="text-xs text-muted-foreground">📏 {order.distanceKm.toFixed(1).replace('.', ',')} km • Taxa: R$ {(order.deliveryFee || 0).toFixed(2).replace('.', ',')}</p>
                    )}
                  </div>
                  <span className="font-bold text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  {order.items.map(i => {
                    const half = i.halfFlavor ? ` / ${i.halfFlavor}` : '';
                    return `${i.quantity}x ${i.pizza.name}${half} (${i.size.name})`;
                  }).join(' • ')}
                </div>

                {/* Driver assignment for delivery orders */}
                {order.deliveryType === 'delivery' && order.status !== 'delivered' && (
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Bike className="h-4 w-4 text-muted-foreground" />
                      {assignedDriver ? (
                        <span className="text-sm text-foreground font-medium">
                          {assignedDriver.vehicleType === 'moto' ? '🏍️' : '🚗'} {assignedDriver.name}
                        </span>
                      ) : (
                        <select
                          onChange={e => e.target.value && handleAssignDriver(order.id, e.target.value)}
                          className="text-sm px-3 py-1.5 rounded-lg bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          defaultValue=""
                        >
                          <option value="" disabled>Atribuir entregador...</option>
                          {availableDrivers.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.vehicleType === 'moto' ? '🏍️' : '🚗'} {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {order.status === 'delivering' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                            <MapIcon className="h-3.5 w-3.5" /> Ver Mapa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] p-1 overflow-hidden rounded-3xl border-none">
                          <DialogHeader className="p-4 bg-background">
                            <DialogTitle className="flex items-center gap-2">
                              Rastreio em Tempo Real - {order.number}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="p-2 bg-muted/30">
                            <DeliveryMap 
                              orderNumber={order.number} 
                              customerAddress={order.address || ''} 
                              status={order.status} 
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(order.createdAt).toLocaleString('pt-BR')}</span>
                  {order.status !== 'delivered' && (
                    <Button
                      size="sm"
                      onClick={() => advanceStatus(order.id, order.status)}
                      className="gradient-primary text-primary-foreground rounded-lg h-8"
                    >
                      Avançar → {statusLabels[statusFlow[statusFlow.indexOf(order.status) + 1]]}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">Nenhum pedido encontrado</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
