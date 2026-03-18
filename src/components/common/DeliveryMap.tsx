import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Pizza, Bike, Navigation } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface DeliveryMapProps {
  orderNumber: string;
  customerAddress: string;
  status: 'preparing' | 'delivering' | 'delivered';
}

export default function DeliveryMap({ orderNumber, customerAddress, status }: DeliveryMapProps) {
  const { config } = useApp();
  const originAddress = config?.pizzeriaAddress || 'Centro';

  // Se tivermos a chave do Google Maps, usamos a Embed API para Rotas (Directions)
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY.length > 10) {
    const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(customerAddress)}&mode=driving`;
    
    return (
      <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden border shadow-inner">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
        {/* Status Overlay Float */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-end">
          <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm pointer-events-auto">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Destino</p>
            <p className="text-xs font-medium text-foreground max-w-[150px] truncate">{customerAddress}</p>
          </div>
          
          <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm text-right pointer-events-auto">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Status</p>
            <div className="flex items-center gap-1.5 justify-end">
              <span className={`h-2 w-2 rounded-full animate-pulse ${status === 'delivering' ? 'bg-primary' : 'bg-success'}`} />
              <p className="text-xs font-bold text-foreground">
                {status === 'delivering' ? 'Em Trânsito' : 'Entregue'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Mapa Simulado em SVG (Mantendo a UI original caso falte a Chave)
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} 
      />
      
      {/* Map Roads (Simplified SVG) */}
      <svg className="absolute inset-0 w-full h-full text-muted-foreground/30" viewBox="0 0 400 200">
        <path d="M0,100 Q100,80 200,100 T400,100" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 4" />
        <path d="M100,0 L100,200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
        <path d="M300,0 L300,200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      </svg>

      {/* Origin: Pizzeria */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg z-10">
          <Pizza className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold bg-background/80 px-1 rounded">Bella Napoli</span>
      </div>

      {/* Destination: Customer */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="bg-success text-success-foreground p-2 rounded-full shadow-lg z-10">
          <MapPin className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold bg-background/80 px-1 rounded max-w-[80px] truncate text-center">
          {customerAddress.split(',')[0]}
        </span>
      </div>

      {/* Animated Path & Driver Icon */}
      {status === 'delivering' && (
        <>
          {/* Animated Route Line */}
          <svg className="absolute inset-0 w-full h-full text-primary" viewBox="0 0 400 200">
            <motion.path 
              d="M50,100 L350,100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeDasharray="10 5"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </svg>

          {/* Moving Driver */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 z-20"
            initial={{ left: "15%" }}
            animate={{ left: "85%" }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          >
            <div className="bg-warning text-warning-foreground p-1.5 rounded-full shadow-md border-2 border-background animate-bounce-subtle">
              <Bike className="h-4 w-4" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
              <div className="flex items-center gap-1 whitespace-nowrap bg-background/90 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm border">
                <Navigation className="h-2 w-2 rotate-45 text-primary" />
                Rastreando {orderNumber}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Destino</p>
          <p className="text-xs font-medium text-foreground max-w-[150px] truncate">{customerAddress}</p>
        </div>
        
        <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm text-right">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Status</p>
          <div className="flex items-center gap-1.5 justify-end">
            <span className={`h-2 w-2 rounded-full animate-pulse ${status === 'delivering' ? 'bg-primary' : 'bg-success'}`} />
            <p className="text-xs font-bold text-foreground">
              {status === 'delivering' ? 'Em Trânsito' : 'Entregue'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
