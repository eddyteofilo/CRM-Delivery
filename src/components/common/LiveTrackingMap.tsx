import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bike, Clock, Navigation, ExternalLink, CheckCircle, Pizza } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface LiveTrackingMapProps {
  orderId: string;
  orderNumber: string;
  customerAddress: string;
  pizzeriaAddress: string;
  distanceKm?: number;
  status: 'preparing' | 'delivering' | 'delivered';
  createdAt: string;
  avgPrepTime: number; // minutes
}

function getEtaText(etaMinutes: number): string {
  if (etaMinutes <= 0) return 'Chegando!';
  if (etaMinutes === 1) return '1 minuto';
  return `${etaMinutes} minutos`;
}

export default function LiveTrackingMap({
  orderId,
  orderNumber,
  customerAddress,
  pizzeriaAddress,
  distanceKm,
  status,
  createdAt,
  avgPrepTime,
}: LiveTrackingMapProps) {
  const [driverLat, setDriverLat] = useState<number | null>(null);
  const [driverLng, setDriverLng] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [driverLastSeen, setDriverLastSeen] = useState<string | null>(null);

  // Calculate ETA based on order creation time + prep time + delivery estimate
  useEffect(() => {
    const update = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsedMin = (now - created) / 60000;

      if (status === 'preparing') {
        const remaining = Math.max(0, Math.ceil(avgPrepTime - elapsedMin));
        // Add delivery time estimate (~3 min/km)
        const deliveryMin = distanceKm ? Math.ceil(distanceKm * 3) : 20;
        setEtaMinutes(remaining + deliveryMin);
      } else if (status === 'delivering') {
        // If we have driver GPS, calculate more precisely
        // Otherwise use elapsed time since "delivering" was set
        const deliveryMin = distanceKm ? Math.ceil(distanceKm * 3) : 20;
        const deliveryElapsed = Math.max(0, elapsedMin - avgPrepTime);
        const remaining = Math.max(0, Math.ceil(deliveryMin - deliveryElapsed));
        setEtaMinutes(remaining);
      } else {
        setEtaMinutes(0);
      }
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [status, createdAt, avgPrepTime, distanceKm]);

  // Subscribe to real-time driver location updates
  useEffect(() => {
    // Fetch current location first
    supabase
      .from('orders')
      .select('driver_lat, driver_lng, driver_location_at')
      .eq('id', orderId)
      .single()
      .then(({ data }) => {
        if (data?.driver_lat) {
          setDriverLat(data.driver_lat);
          setDriverLng(data.driver_lng);
          setDriverLastSeen(data.driver_location_at);
        }
      });

    // Real-time subscription
    const channel = supabase
      .channel(`order-location-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          if (payload.new.driver_lat) {
            setDriverLat(payload.new.driver_lat);
            setDriverLng(payload.new.driver_lng);
            setDriverLastSeen(payload.new.driver_location_at);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  // Build map embed URL with driver marker if available, or just destination
  const dest = customerAddress.toLowerCase().includes('brasil')
    ? customerAddress
    : `${customerAddress}, Brasil`;

  const origin = pizzeriaAddress.toLowerCase().includes('brasil')
    ? pizzeriaAddress
    : pizzeriaAddress ? `${pizzeriaAddress}, Brasil` : '';

  // If we have driver GPS, show driver position; otherwise show destination
  let embedUrl: string | null = null;
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY.length > 10) {
    if (driverLat && driverLng && status === 'delivering') {
      embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}&origin=${driverLat},${driverLng}&destination=${encodeURIComponent(dest)}&mode=driving&language=pt-BR&region=BR`;
    } else {
      embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(dest)}&language=pt-BR&region=BR`;
    }
  }

  // Link to open full navigation in Google Maps
  const openInMapsUrl = driverLat && driverLng
    ? `https://www.google.com/maps/dir/${driverLat},${driverLng}/${encodeURIComponent(dest)}`
    : origin
      ? `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(dest)}`
      : `https://www.google.com/maps/search/${encodeURIComponent(dest)}`;

  const hasLiveGPS = driverLat && driverLng && status === 'delivering';

  return (
    <div className="space-y-3">
      {/* ETA Card */}
      {status !== 'delivered' && etaMinutes !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="bg-primary text-primary-foreground rounded-full p-2 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {status === 'preparing' ? 'Tempo estimado total' : 'Chegando em aproximadamente'}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {etaMinutes === 0 ? '🎉 Chegando!' : `~${getEtaText(etaMinutes)}`}
            </p>
          </div>
          {hasLiveGPS && (
            <div className="flex flex-col items-center">
              <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse block" />
              <span className="text-[9px] text-green-600 font-bold mt-0.5">AO VIVO</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Delivered Banner */}
      {status === 'delivered' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-success/10 border border-success/30 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="h-8 w-8 text-success shrink-0" />
          <div>
            <p className="font-bold text-success text-lg">Pedido entregue!</p>
            <p className="text-xs text-muted-foreground">Bom apetite! 🍕</p>
          </div>
        </motion.div>
      )}

      {/* Driver status */}
      {status === 'delivering' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-card border rounded-lg">
          <Bike className="h-4 w-4 text-primary animate-bounce" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">
              Entregador a caminho
              {hasLiveGPS && <span className="ml-2 text-green-600">• GPS ativo</span>}
            </p>
            {driverLastSeen && (
              <p className="text-[10px] text-muted-foreground">
                Última localização: {new Date(driverLastSeen).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          {distanceKm && (
            <p className="text-xs font-bold text-primary">{distanceKm.toFixed(1)} km</p>
          )}
        </div>
      )}

      {/* Map */}
      <div className="relative w-full rounded-2xl overflow-hidden border shadow-inner bg-muted" style={{ aspectRatio: '4/3' }}>
        {embedUrl ? (
          <>
            <iframe
              key={embedUrl} // re-mount when URL changes (new GPS position)
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              title="Rastreio de entrega"
            />
            {/* Moving driver overlay animation (aesthetic) */}
            {status === 'delivering' && !hasLiveGPS && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                initial={{ left: '15%' }}
                animate={{ left: '80%' }}
                transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
              >
                <div className="bg-warning text-warning-foreground p-1.5 rounded-full shadow-md border-2 border-background">
                  <Bike className="h-4 w-4" />
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* No API key fallback */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-10 w-10 opacity-30" />
            <p className="text-sm">Mapa indisponível</p>
          </div>
        )}

        {/* Address badges */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none gap-2">
          <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm max-w-[55%]">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Destino</p>
            <p className="text-xs font-medium text-foreground truncate">{customerAddress.split(',')[0]}</p>
          </div>
          <div className="bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Status</p>
            <div className="flex items-center gap-1.5 justify-end">
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                status === 'delivering' ? 'bg-primary' :
                status === 'delivered' ? 'bg-success' : 'bg-yellow-500'
              }`} />
              <p className="text-xs font-bold text-foreground">
                {status === 'preparing' ? 'Preparando' :
                 status === 'delivering' ? 'Em Trânsito' : 'Entregue'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open in Google Maps button */}
      <a
        href={openInMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
      >
        <Navigation className="h-4 w-4 shrink-0" />
        <span className="flex-1">Abrir rota no Google Maps</span>
        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
      </a>
    </div>
  );
}
