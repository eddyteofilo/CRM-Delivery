import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Phone, Clock, CheckCircle, Truck, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Order } from '@/types';
import DeliveryMap from '@/components/common/DeliveryMap';

const statusLabels: Record<string, string> = {
  received: 'Recebido',
  preparing: 'Em preparo',
  delivering: 'Em entrega',
  delivered: 'Entregue',
};

export default function DriverPanel() {
  const { orders, currentDriverId, drivers, driverLogout, updateOrderStatus, updateDriver } = useApp();
  const navigate = useNavigate();

  const driver = drivers.find(d => d.id === currentDriverId);
  if (!driver) {
    navigate('/entregador/login');
    return null;
  }

  const myDeliveries = orders.filter(o => o.driverId === currentDriverId && o.deliveryType === 'delivery');
  const activeDeliveries = myDeliveries.filter(o => o.status === 'delivering');
  const pendingDeliveries = myDeliveries.filter(o => o.status === 'preparing');
  const completedDeliveries = myDeliveries.filter(o => o.status === 'delivered');

  const handleDeliver = (order: Order) => {
    updateOrderStatus(order.id, 'delivered');
    toast.success(`Pedido ${order.number} entregue!`);
  };

  const handleLogout = () => {
    driverLogout();
    navigate('/entregador/login');
  };

  const toggleAvailability = () => {
    updateDriver(driver.id, { available: !driver.available });
    toast.success(driver.available ? 'Status: Indisponível' : 'Status: Disponível');
  };

  const DeliveryCard = ({ order, showAction }: { order: Order; showAction?: boolean }) => {
    const [showMap, setShowMap] = useState(false);

    return (
      <div className="bg-card rounded-xl border p-4 shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{order.number}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            order.status === 'delivering' ? 'bg-primary/10 text-primary' :
            order.status === 'delivered' ? 'bg-success/10 text-success' :
            'bg-muted text-muted-foreground'
          }`}>{statusLabels[order.status]}</span>
        </div>
        <p className="text-sm text-foreground font-medium">{order.customerName}</p>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{order.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{order.customerPhone}</span>
        </div>
        {order.distanceKm && (
          <p className="text-sm text-muted-foreground">📍 {order.distanceKm.toFixed(1).replace('.', ',')} km</p>
        )}

        {/* Expandable Map */}
        {order.status === 'delivering' && (
          <div className="pt-2 border-t mt-2">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="flex items-center justify-between w-full text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              <span className="flex items-center gap-1.5">
                <MapIcon className="h-3 w-3" /> {showMap ? 'Ocultar Mapa' : 'Ver Mapa de Rastreio'}
              </span>
              {showMap ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {showMap && (
              <div className="mt-3 rounded-lg overflow-hidden border">
                <DeliveryMap 
                  orderNumber={order.number} 
                  customerAddress={order.address || ''} 
                  status={order.status} 
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          {showAction && order.status === 'delivering' && (
            <Button onClick={() => handleDeliver(order)} size="sm" className="gap-2 gradient-primary text-primary-foreground rounded-lg">
              <CheckCircle className="h-4 w-4" /> Entregue
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{driver.vehicleType === 'moto' ? '🏍️' : '🚗'}</span>
            <div>
              <h1 className="font-bold text-foreground text-sm">{driver.name}</h1>
              <p className="text-xs text-muted-foreground">{driver.plate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAvailability}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                driver.available ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}
            >
              {driver.available ? '🟢 Online' : '🔴 Offline'}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-4 space-y-6 max-w-lg mx-auto">
        {/* Active */}
        {activeDeliveries.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Em Entrega ({activeDeliveries.length})
            </h2>
            <div className="space-y-3">
              {activeDeliveries.map(o => <DeliveryCard key={o.id} order={o} showAction />)}
            </div>
          </div>
        )}

        {/* Pending */}
        {pendingDeliveries.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-foreground" /> Aguardando Preparo ({pendingDeliveries.length})
            </h2>
            <div className="space-y-3">
              {pendingDeliveries.map(o => <DeliveryCard key={o.id} order={o} />)}
            </div>
          </div>
        )}

        {/* Completed */}
        {completedDeliveries.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" /> Entregues ({completedDeliveries.length})
            </h2>
            <div className="space-y-3">
              {completedDeliveries.map(o => <DeliveryCard key={o.id} order={o} />)}
            </div>
          </div>
        )}

        {myDeliveries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma entrega atribuída</p>
          </div>
        )}
      </div>
    </div>
  );
}
