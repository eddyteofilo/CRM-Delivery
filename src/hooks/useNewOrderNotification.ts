import { useEffect, useRef } from 'react';
import { Order } from '@/types';

function playNotificationSound() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = ctx.currentTime;

  // Two-tone chime
  [660, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.4);
  });
}

export function useNewOrderNotification(orders: Order[]) {
  const prevCount = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevCount.current) {
      playNotificationSound();
    }
    prevCount.current = orders.length;
  }, [orders.length]);
}
