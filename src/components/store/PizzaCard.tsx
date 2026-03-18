import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, PizzaSize, Additional, CartItem } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PizzaCardProps {
  pizza: Pizza;
}

export default function PizzaCard({ pizza }: PizzaCardProps) {
  const { addToCart, pizzas } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizza.sizes[0]);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isHalf, setIsHalf] = useState(false);
  const [halfPizza, setHalfPizza] = useState<Pizza | null>(null);

  const availablePizzas = pizzas.filter(p => p.available && p.id !== pizza.id && p.allowHalfHalf);

  const toggleAdditional = (add: Additional) => {
    setSelectedAdditionals(prev =>
      prev.find(a => a.id === add.id) ? prev.filter(a => a.id !== add.id) : [...prev, add]
    );
  };

  // For half-and-half, price is the higher of the two
  const basePrice = isHalf && halfPizza
    ? Math.max(
        pizza.sizes.find(s => s.name === selectedSize.name)?.price || selectedSize.price,
        halfPizza.sizes.find(s => s.name === selectedSize.name)?.price || 0
      )
    : selectedSize.price;

  const unitPrice = basePrice + selectedAdditionals.reduce((sum, a) => sum + a.price, 0);
  const subtotal = unitPrice * quantity;

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `${pizza.id}-${Date.now()}`,
      pizza,
      size: selectedSize,
      quantity,
      selectedAdditionals,
      halfFlavor: isHalf && halfPizza ? halfPizza.name : undefined,
      halfPizza: isHalf && halfPizza ? halfPizza : undefined,
      subtotal,
    };
    addToCart(item);
    const label = isHalf && halfPizza
      ? `${pizza.name} / ${halfPizza.name} adicionada ao carrinho!`
      : `${pizza.name} adicionada ao carrinho!`;
    toast.success(label);
    setExpanded(false);
    setSelectedSize(pizza.sizes[0]);
    setSelectedAdditionals([]);
    setQuantity(1);
    setIsHalf(false);
    setHalfPizza(null);
  };

  const pizzaEmojis: Record<string, string> = {
    'Tradicionais': '🍕',
    'Especiais': '⭐',
    'Doces': '🍫',
  };

  // Filter sizes available in both pizzas for half-and-half
  const availableSizes = isHalf && halfPizza
    ? pizza.sizes.filter(s => halfPizza.sizes.some(hs => hs.name === s.name))
    : pizza.sizes;

  return (
    <motion.div
      layout
      className="bg-card rounded-lg shadow-card overflow-hidden border border-border/50 hover:shadow-card-hover transition-shadow"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{pizzaEmojis[pizza.category] || '🍕'}</span>
              <h3 className="font-semibold text-foreground truncate">{pizza.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{pizza.description}</p>
            <p className="mt-2 font-bold text-primary text-lg">
              a partir de R$ {pizza.sizes[0].price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className={`h-5 w-5 text-primary transition-transform ${expanded ? 'rotate-45' : ''}`} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t pt-4">
              {/* Half-and-half toggle */}
              {pizza.allowHalfHalf && (
                <div>
                  <button
                    onClick={() => {
                      setIsHalf(!isHalf);
                      if (isHalf) setHalfPizza(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      isHalf
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-muted text-muted-foreground border-border hover:border-accent/50'
                    }`}
                  >
                    <Circle className="h-4 w-4" />
                    Meia a Meia
                  </button>
                </div>
              )}

              {/* Second flavor picker */}
              {isHalf && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Escolha o 2º sabor</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availablePizzas.length === 0 ? (
                      <p className="text-sm text-muted-foreground/80 italic p-3 bg-muted/50 rounded-lg w-full">
                        ⚠️ Nenhum outro sabor permite "Meio a Meio". Para misturar sabores, vá no Painel de Admin &gt; Produtos e marque a opção "Permitir Meio a Meio" nas outras pizzas também!
                      </p>
                    ) : (
                      availablePizzas.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setHalfPizza(p)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
                            halfPizza?.id === p.id
                              ? 'bg-accent text-accent-foreground border-accent'
                              : 'bg-muted text-muted-foreground border-border hover:border-accent/50'
                          }`}
                        >
                          {pizzaEmojis[p.category] || '🍕'} {p.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const displayPrice = isHalf && halfPizza
                      ? Math.max(
                          size.price,
                          halfPizza.sizes.find(s => s.name === size.name)?.price || 0
                        )
                      : size.price;
                    return (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedSize.name === size.name
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {size.name} - R$ {displayPrice.toFixed(2).replace('.', ',')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additionals */}
              {pizza.additionals.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Adicionais</p>
                  <div className="flex flex-wrap gap-2">
                    {pizza.additionals.map(add => (
                      <button
                        key={add.id}
                        onClick={() => toggleAdditional(add)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
                          selectedAdditionals.find(a => a.id === add.id)
                            ? 'bg-secondary text-secondary-foreground border-secondary'
                            : 'bg-muted text-muted-foreground border-border hover:border-secondary/50'
                        }`}
                      >
                        {add.name} +R$ {add.price.toFixed(2).replace('.', ',')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-md hover:bg-background transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-md hover:bg-background transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isHalf && !halfPizza}
                  className="gap-2 gradient-primary text-primary-foreground font-semibold px-6 h-12 rounded-xl shadow-md"
                >
                  <ShoppingCart className="h-4 w-4" />
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
