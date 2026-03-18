import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, CreditCard, QrCode, Banknote, Navigation } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { DeliveryType, PaymentMethod } from '@/types';
import StoreHeader from '@/components/store/StoreHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Checkout() {
  const { cart, cartTotal, config, createOrder, calculateDeliveryFee } = useApp();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);

  if (cart.length === 0) {
    navigate('/carrinho');
    return null;
  }

  // Simulate distance calculation (MVP - replace with Google Maps API)
  const simulateDistance = () => {
    if (!address.trim()) {
      toast.error('Informe o endereço para calcular a distância');
      return;
    }
    setCalculatingDistance(true);
    // Simulated: generate random distance 1-15km based on address length seed
    setTimeout(() => {
      const seed = address.length % 10;
      const km = Math.round((2 + seed * 1.3) * 10) / 10;
      setDistanceKm(km);
      setCalculatingDistance(false);
      toast.success(`Distância estimada: ${km.toFixed(1).replace('.', ',')} km`);
    }, 1200);
  };

  const deliveryFee = deliveryType === 'delivery'
    ? distanceKm !== null
      ? calculateDeliveryFee(distanceKm)
      : config.deliveryFee
    : 0;

  const total = cartTotal + deliveryFee;

  const { baseFeeKm, baseDeliveryFee, extraKmRate } = config.deliveryFeeConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      toast.error('Informe o endereço de entrega');
      return;
    }
    const order = createOrder({
      customerName,
      customerPhone,
      address: deliveryType === 'delivery' ? address : undefined,
      deliveryType,
      paymentMethod,
      distanceKm: distanceKm ?? undefined,
    });
    navigate(`/pedido/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <form onSubmit={handleSubmit} className="container py-6 space-y-6 max-w-lg mx-auto">
        <button type="button" onClick={() => navigate('/carrinho')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>

        {/* Personal Info */}
        <div className="bg-card rounded-xl border p-4 space-y-3 shadow-card">
          <h2 className="font-semibold text-foreground">Seus Dados</h2>
          <input
            type="text"
            placeholder="Seu nome *"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            required
          />
          <input
            type="tel"
            placeholder="WhatsApp *"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Delivery Type */}
        <div className="bg-card rounded-xl border p-4 space-y-3 shadow-card">
          <h2 className="font-semibold text-foreground">Tipo de Entrega</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setDeliveryType('delivery'); setDistanceKm(null); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                deliveryType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <MapPin className={`h-6 w-6 ${deliveryType === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${deliveryType === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`}>Entrega</span>
            </button>
            <button
              type="button"
              onClick={() => { setDeliveryType('pickup'); setDistanceKm(null); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                deliveryType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <Store className={`h-6 w-6 ${deliveryType === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${deliveryType === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`}>Retirada</span>
            </button>
          </div>
          {deliveryType === 'delivery' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Endereço completo *"
                value={address}
                onChange={e => { setAddress(e.target.value); setDistanceKm(null); }}
                className="w-full px-4 py-3 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                required
              />
              <button
                type="button"
                onClick={simulateDistance}
                disabled={calculatingDistance}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                <Navigation className="h-4 w-4" />
                {calculatingDistance ? 'Calculando...' : 'Calcular distância'}
              </button>
              {distanceKm !== null && (
                <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                  <p className="text-foreground font-medium">📍 Distância: {distanceKm.toFixed(1).replace('.', ',')} km</p>
                  {distanceKm > baseFeeKm && (
                    <p className="text-muted-foreground">
                      Até {baseFeeKm} km: R$ {baseDeliveryFee.toFixed(2).replace('.', ',')} +
                      {(distanceKm - baseFeeKm).toFixed(1).replace('.', ',')} km × R$ {extraKmRate.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                  <p className="text-primary font-bold">Taxa de entrega: R$ {deliveryFee.toFixed(2).replace('.', ',')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-card rounded-xl border p-4 space-y-3 shadow-card">
          <h2 className="font-semibold text-foreground">Pagamento</h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { method: 'pix' as PaymentMethod, icon: QrCode, label: 'Pix' },
              { method: 'cash' as PaymentMethod, icon: Banknote, label: 'Dinheiro' },
              { method: 'card' as PaymentMethod, icon: CreditCard, label: 'Cartão' },
            ]).map(({ method, icon: Icon, label }) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                  paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                }`}
              >
                <Icon className={`h-5 w-5 ${paymentMethod === method ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${paymentMethod === method ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-card rounded-xl border p-4 shadow-card">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
            <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Entrega{distanceKm !== null ? ` (${distanceKm.toFixed(1).replace('.', ',')} km)` : ''}</span>
              <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-foreground text-lg">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground h-14 rounded-xl text-lg font-bold shadow-lg">
          Confirmar Pedido
        </Button>
      </form>
    </div>
  );
}
