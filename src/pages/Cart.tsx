import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import StoreHeader from '@/components/store/StoreHeader';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, config } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">Adicione pizzas deliciosas ao seu pedido!</p>
          <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground rounded-xl h-12 px-8">
            Ver Cardápio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container py-6 space-y-4 max-w-lg mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar ao cardápio
        </button>

        <h1 className="text-2xl font-bold text-foreground">Seu Carrinho</h1>

        <div className="space-y-3">
          {cart.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card rounded-xl border p-4 shadow-card"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.halfFlavor ? `½ ${item.pizza.name} • ½ ${item.halfFlavor}` : item.pizza.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.size.name}</p>
                  {item.selectedAdditionals.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + {item.selectedAdditionals.map(a => a.name).join(', ')}
                    </p>
                  )}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="p-1.5 rounded hover:bg-background transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="p-1.5 rounded hover:bg-background transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-bold text-primary text-lg">
                  R$ {item.subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border p-4 shadow-card space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>R$ {config.deliveryFee.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-foreground text-lg">
            <span>Total</span>
            <span>R$ {(cartTotal + config.deliveryFee).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <Button
          onClick={() => navigate('/checkout')}
          className="w-full gradient-primary text-primary-foreground h-14 rounded-xl text-lg font-bold shadow-lg"
        >
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
}
