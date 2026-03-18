import { Check, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { OrderStatus } from '@/types';

const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'received', label: 'Pedido recebido', icon: Clock },
  { status: 'preparing', label: 'Em preparo', icon: ChefHat },
  { status: 'delivering', label: 'Saiu para entrega', icon: Truck },
  { status: 'delivered', label: 'Entregue', icon: Package },
];

const statusOrder: OrderStatus[] = ['received', 'preparing', 'delivering', 'delivered'];

export default function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex items-start gap-4">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                isCompleted ? 'bg-success text-success-foreground' :
                isCurrent ? 'bg-primary text-primary-foreground animate-pulse-soft' :
                'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-0.5 h-10 ${idx < currentIdx ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
            {/* Label */}
            <div className="pt-2">
              <p className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
