import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Pizza, Bike, Navigation, ExternalLink } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface DeliveryMapProps {
  orderNumber: string;
  customerAddress: string;
  status: 'preparing' | 'delivering' | 'delivered';
  driverLat?: number;
  driverLng?: number;
}

export default function DeliveryMap({ 
  orderNumber, 
  customerAddress, 
  status,
  driverLat,
  driverLng
}: DeliveryMapProps) {
  const { config } = useApp();
  const originAddress = config?.pizzeriaAddress || '';

  // Endereço do destino com contexto Brasil para melhor geocoding
  const dest = customerAddress.toLowerCase().includes('brasil')
    ? customerAddress
    : `${customerAddress}, Brasil`;

  const origin = originAddress.toLowerCase().includes('brasil')
    ? originAddress
    : originAddress ? `${originAddress}, Brasil` : '';

  // URL para abrir a rota completa no Google Maps (nova aba)
  const openInMapsUrl = origin
    ? `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(dest)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(dest)}`;

  // Embed: modo "directions" se tivermos GPS do entregador, senão modo "place"
  let embedUrl = null;
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY.length > 10) {
    if (driverLat && driverLng && status === 'delivering') {
      embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}&origin=${driverLat},${driverLng}&destination=${encodeURIComponent(dest)}&mode=driving&language=pt-BR&region=BR`;
    } else {
      embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(dest)}&language=pt-BR&region=BR`;
    }
  }

  return (
    <div className="space-y-2">
      {/* Botão de rota completa */}
      <a
        href={openInMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        <span className="flex-1">Ver Rota Completa no Google Maps</span>
        {origin && <span className="text-xs text-primary-foreground/70 truncate max-w-[120px]">{originAddress.split(',')[0]} → destino</span>}
      </a>

      {/* Mapa embarcado */}
      <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden border shadow-inner">
        {embedUrl ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl}
            title={`Mapa - ${customerAddress}`}
          />
        ) : (
          /* Fallback SVG */
          <>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
            />
            <svg className="absolute inset-0 w-full h-full text-muted-foreground/30" viewBox="0 0 400 200">
              <path d="M0,100 Q100,80 200,100 T400,100" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 4" />
              <path d="M100,0 L100,200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
              <path d="M300,0 L300,200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
            </svg>
            <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg z-10">
                <Pizza className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold bg-background/80 px-1 rounded">{config?.name || 'Pizzaria'}</span>
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="bg-success text-success-foreground p-2 rounded-full shadow-lg z-10">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold bg-background/80 px-1 rounded max-w-[80px] truncate text-center">
                {customerAddress.split(',')[0]}
              </span>
            </div>
          </>
        )}

        {/* Animated driver (status overlay on top of map) */}
        {status === 'delivering' && embedUrl && (
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <motion.div
              className="absolute bottom-12 z-20"
              initial={{ left: '10%' }}
              animate={{ left: '85%' }}
              transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
            >
              <div className="bg-warning text-warning-foreground p-1.5 rounded-full shadow-md border-2 border-background">
                <Bike className="h-4 w-4" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
                <div className="flex items-center gap-1 whitespace-nowrap bg-background/90 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm border">
                  <Navigation className="h-2 w-2 rotate-45 text-primary" />
                  Rastreando {orderNumber}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Destino</p>
            <p className="text-xs font-medium text-foreground max-w-[150px] truncate">{customerAddress.split(',')[0]}</p>
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
    </div>
  );
}
