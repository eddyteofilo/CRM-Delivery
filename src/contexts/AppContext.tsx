import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Pizza, CartItem, Order, PizzeriaConfig, OrderStatus, DeliveryType, PaymentMethod, Driver } from '@/types';
import { defaultConfig } from '@/data/mockData';
import { supabase } from '@/lib/supabase';
import { AsaasService } from '@/lib/asaas';

interface AppContextType {
  config: PizzeriaConfig;
  updateConfig: (config: Partial<PizzeriaConfig>) => void;

  pizzas: Pizza[];
  addPizza: (pizza: Pizza) => void;
  updatePizza: (id: string, pizza: Partial<Pizza>) => void;
  deletePizza: (id: string) => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  orders: Order[];
  createOrder: (data: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp?: string;
    address?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressCep?: string;
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    distanceKm?: number;
  }) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driverId: string) => void;
  getOrder: (id: string) => Order | undefined;
  getOrderByNumber: (number: string) => Order | undefined;

  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  calculateDeliveryFee: (distanceKm: number) => number;

  isAdmin: boolean;
  isDemo: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;

  isDriver: boolean;
  currentDriverId: string | null;
  driverLogin: (phone: string) => boolean;
  driverLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Mappers DB (snake_case) <-> Frontend (camelCase) ---
const mapOrderFromDB = (db: any): Order => ({
  id: db.id,
  number: db.number,
  items: db.items,
  total: Number(db.total),
  status: db.status,
  deliveryType: db.delivery_type,
  paymentMethod: db.payment_method,
  customerName: db.customer_name,
  customerPhone: db.customer_phone,
  address: db.address || undefined,
  distanceKm: db.distance_km ? Number(db.distance_km) : undefined,
  deliveryFee: db.delivery_fee ? Number(db.delivery_fee) : undefined,
  driverId: db.driver_id || undefined,
  driverLat: db.driver_lat ? Number(db.driver_lat) : undefined,
  driverLng: db.driver_lng ? Number(db.driver_lng) : undefined,
  driverLocationAt: db.driver_location_at || undefined,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

const mapOrderToDB = (order: Order) => ({
  id: order.id,
  number: order.number,
  items: order.items,
  total: order.total,
  status: order.status,
  delivery_type: order.deliveryType,
  payment_method: order.paymentMethod,
  customer_name: order.customerName,
  customer_phone: order.customerPhone,
  address: order.address,
  distance_km: order.distanceKm,
  delivery_fee: order.deliveryFee,
  driver_id: order.driverId,
  driver_lat: order.driverLat,
  driver_lng: order.driverLng,
  driver_location_at: order.driverLocationAt,
  created_at: order.createdAt,
  updated_at: order.updatedAt,
});

const mapConfigFromDB = (db: any): PizzeriaConfig => ({
  name: db.name,
  logo: db.logo,
  openingHours: db.opening_hours,
  closingHours: db.closing_hours,
  deliveryFee: Number(db.delivery_fee),
  avgPrepTime: Number(db.avg_prep_time),
  isOpen: db.is_open,
  deliveryFeeConfig: db.delivery_fee_config,
  pizzeriaAddress: db.pizzeria_address,
  categories: db.categories || ['Tradicionais', 'Especiais', 'Doces', 'Bebidas'],
});

const mapConfigToDB = (config: Partial<PizzeriaConfig>) => ({
  ...(config.name !== undefined && { name: config.name }),
  ...(config.logo !== undefined && { logo: config.logo }),
  ...(config.openingHours !== undefined && { opening_hours: config.openingHours }),
  ...(config.closingHours !== undefined && { closing_hours: config.closingHours }),
  ...(config.deliveryFee !== undefined && { delivery_fee: config.deliveryFee }),
  ...(config.avgPrepTime !== undefined && { avg_prep_time: config.avgPrepTime }),
  ...(config.isOpen !== undefined && { is_open: config.isOpen }),
  ...(config.deliveryFeeConfig !== undefined && { delivery_fee_config: config.deliveryFeeConfig }),
  ...(config.pizzeriaAddress !== undefined && { pizzeria_address: config.pizzeriaAddress }),
  ...(config.categories !== undefined && { categories: config.categories }),
});

const mapDriverFromDB = (db: any): Driver => ({
  id: db.id,
  name: db.name,
  cpf: db.cpf,
  phone: db.phone,
  vehicleType: db.vehicle_type,
  plate: db.plate,
  pix: db.pix,
  photoUrl: db.photo_url || undefined,
  cnhUrl: db.cnh_url || undefined,
  available: db.available,
  createdAt: db.created_at,
});

const mapDriverToDB = (driver: Partial<Driver>) => ({
  ...(driver.id !== undefined && { id: driver.id }),
  ...(driver.name !== undefined && { name: driver.name }),
  ...(driver.cpf !== undefined && { cpf: driver.cpf }),
  ...(driver.phone !== undefined && { phone: driver.phone }),
  ...(driver.vehicleType !== undefined && { vehicle_type: driver.vehicleType }),
  ...(driver.plate !== undefined && { plate: driver.plate }),
  ...(driver.pix !== undefined && { pix: driver.pix }),
  ...(driver.photoUrl !== undefined && { photo_url: driver.photoUrl }),
  ...(driver.cnhUrl !== undefined && { cnh_url: driver.cnhUrl }),
  ...(driver.available !== undefined && { available: driver.available }),
  ...(driver.createdAt !== undefined && { created_at: driver.createdAt }),
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Sync States from Supabase
  const [config, setConfig] = useState<PizzeriaConfig>(defaultConfig);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // Local States for Browsing Session
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pizzeria_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('pizzeria_admin') === 'true');
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('pizzeria_is_demo') === 'true');
  const [isDriver, setIsDriver] = useState(() => localStorage.getItem('pizzeria_driver') === 'true');
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(() => localStorage.getItem('pizzeria_driver_id'));

  useEffect(() => { localStorage.setItem('pizzeria_cart', JSON.stringify(cart)); }, [cart]);

  // Supabase Loader & Realtime
  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: dbPizzas }, { data: dbOrders }, { data: dbDrivers }, { data: dbConfig }] = await Promise.all([
          supabase.from('pizzas').select('*').order('name'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('drivers').select('*'),
          supabase.from('pizzeria_config').select('*').single()
        ]);

        if (dbPizzas) setPizzas(dbPizzas as Pizza[]);
        if (dbOrders) setOrders(dbOrders.map(mapOrderFromDB));
        if (dbDrivers) setDrivers(dbDrivers.map(mapDriverFromDB));
        if (dbConfig) setConfig(mapConfigFromDB(dbConfig));
      } catch (err) {
        console.error('Erro ao buscar do Supabase', err);
      }
    };

    loadData();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => {
            const newOrder = mapOrderFromDB(payload.new);
            if (prev.find(o => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          });
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? mapOrderFromDB(payload.new) : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pizzas' }, payload => {
        if (payload.eventType === 'INSERT') {
          setPizzas(prev => {
            if (prev.find(p => p.id === payload.new.id)) return prev;
            return [...prev, payload.new as Pizza].sort((a,b) => a.name.localeCompare(b.name));
          });
        } else if (payload.eventType === 'UPDATE') {
          setPizzas(prev => prev.map(p => p.id === payload.new.id ? payload.new as Pizza : p));
        } else if (payload.eventType === 'DELETE') {
          setPizzas(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, payload => {
        if (payload.eventType === 'INSERT') {
          setDrivers(prev => {
            const drv = mapDriverFromDB(payload.new);
            if (prev.find(d => d.id === drv.id)) return prev;
            return [...prev, drv];
          });
        } else if (payload.eventType === 'UPDATE') {
          setDrivers(prev => prev.map(d => d.id === payload.new.id ? mapDriverFromDB(payload.new) : d));
        } else if (payload.eventType === 'DELETE') {
          setDrivers(prev => prev.filter(d => d.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pizzeria_config' }, payload => {
        setConfig(mapConfigFromDB(payload.new));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- ACTIONS --- (Optimistic UI + Background Sync)

  const updateConfig = useCallback((partial: Partial<PizzeriaConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
    if (!isDemo) {
      supabase.from('pizzeria_config').update(mapConfigToDB(partial)).eq('id', 1).then();
    }
  }, [isDemo]);

  const addPizza = useCallback((pizza: Pizza) => {
    setPizzas(prev => [...prev, pizza]);
    if (!isDemo) {
      supabase.from('pizzas').insert(pizza).then();
    }
  }, [isDemo]);

  const updatePizza = useCallback((id: string, partial: Partial<Pizza>) => {
    setPizzas(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
    if (!isDemo) {
      supabase.from('pizzas').update(partial).eq('id', id).then();
    }
  }, [isDemo]);

  const deletePizza = useCallback((id: string) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
    if (!isDemo) {
      supabase.from('pizzas').delete().eq('id', id).then();
    }
  }, [isDemo]);

  const addDriver = useCallback((driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
    if (!isDemo) {
      supabase.from('drivers').insert(mapDriverToDB(driver)).then();
    }
  }, [isDemo]);

  const updateDriver = useCallback((id: string, partial: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...partial } : d));
    if (!isDemo) {
      supabase.from('drivers').update(mapDriverToDB(partial)).eq('id', id).then();
    }
  }, [isDemo]);

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    if (!isDemo) {
      supabase.from('drivers').delete().eq('id', id).then();
    }
  }, [isDemo]);

  // Cart Operations
  const addToCart = useCallback((item: CartItem) => setCart(prev => [...prev, item]), []);
  const removeFromCart = useCallback((id: string) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateCartItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity, subtotal: (i.size.price + i.selectedAdditionals.reduce((sum, a) => sum + a.price, 0)) * quantity } : i));
    }
  }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const calculateDeliveryFee = useCallback((distanceKm: number): number => {
    const { baseFeeKm, baseDeliveryFee, extraKmRate } = config.deliveryFeeConfig;
    if (distanceKm <= baseFeeKm) return baseDeliveryFee;
    const extraKm = distanceKm - baseFeeKm;
    return baseDeliveryFee + (extraKm * extraKmRate);
  }, [config.deliveryFeeConfig]);

  const createOrder = useCallback((data: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp?: string;
    address?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressCep?: string;
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    distanceKm?: number;
  }): Order => {
    const orderNumber = `#${String(orders.length + 1).padStart(3, '0')}`;
    const deliveryFee = data.deliveryType === 'delivery' && data.distanceKm
      ? calculateDeliveryFee(data.distanceKm)
      : data.deliveryType === 'delivery'
        ? config.deliveryFee
        : 0;
    
    const total = cartTotal + deliveryFee;
    const order: Order = {
      id: `ord-${Date.now()}`,
      number: orderNumber,
      items: [...cart],
      total,
      status: 'received',
      deliveryType: data.deliveryType,
      paymentMethod: data.paymentMethod,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerWhatsapp: data.customerWhatsapp,
      address: data.address,
      addressStreet: data.addressStreet,
      addressNumber: data.addressNumber,
      addressComplement: data.addressComplement,
      addressNeighborhood: data.addressNeighborhood,
      addressCity: data.addressCity,
      addressCep: data.addressCep,
      distanceKm: data.distanceKm,
      deliveryFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Optistic UI Update
    setOrders(prev => [order, ...prev]);
    setCart([]);
    
    // Background Sync
    if (!isDemo) {
      supabase.from('orders').insert(mapOrderToDB(order)).then();
    }
    
    return order;
  }, [cart, cartTotal, config.deliveryFee, orders.length, calculateDeliveryFee, isDemo]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    if (!isDemo) {
      supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).then();
    }
  }, [isDemo]);

  const assignDriver = useCallback((orderId: string, driverId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, driverId, updatedAt: new Date().toISOString() } : o));
    if (!isDemo) {
      supabase.from('orders').update({ driver_id: driverId, updated_at: new Date().toISOString() }).eq('id', orderId).then();
    }
  }, [isDemo]);

  const getOrder = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  const getOrderByNumber = useCallback((number: string) => {
    const cleanNumber = number.trim().startsWith('#') ? number.trim() : `#${number.trim()}`;
    return orders.find(o => o.number === cleanNumber);
  }, [orders]);

  // Auth Operations
  const adminLogin = useCallback(async (email: string, password: string) => {
    if (!email || !password) return false;

    // Demo account override
    if (email.toLowerCase() === 'demo@pizzapratico.com') {
      setIsAdmin(true);
      setIsDemo(true);
      localStorage.setItem('pizzeria_admin', 'true');
      localStorage.setItem('pizzeria_is_demo', 'true');
      return true;
    }

    // Try Asaas subscription
    const hasActivePlan = await AsaasService.verifyActiveSubscription(email);
    if (hasActivePlan) {
      setIsAdmin(true);
      setIsDemo(false);
      localStorage.setItem('pizzeria_admin', 'true');
      localStorage.setItem('pizzeria_is_demo', 'false');
      return true;
    }

    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    setIsDemo(false);
    localStorage.removeItem('pizzeria_admin');
    localStorage.removeItem('pizzeria_is_demo');
  }, []);

  const driverLogin = useCallback((phone: string) => {
    const driver = drivers.find(d => d.phone === phone);
    if (driver) {
      setIsDriver(true);
      setCurrentDriverId(driver.id);
      localStorage.setItem('pizzeria_driver', 'true');
      localStorage.setItem('pizzeria_driver_id', driver.id);
      return true;
    }
    return false;
  }, [drivers]);

  const driverLogout = useCallback(() => {
    setIsDriver(false);
    setCurrentDriverId(null);
    localStorage.removeItem('pizzeria_driver');
    localStorage.removeItem('pizzeria_driver_id');
  }, []);

  return (
    <AppContext.Provider value={{
      config, updateConfig,
      pizzas, addPizza, updatePizza, deletePizza,
      cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, cartTotal,
      orders, createOrder, updateOrderStatus, assignDriver, getOrder, getOrderByNumber,
      drivers, addDriver, updateDriver, deleteDriver,
      calculateDeliveryFee,
      isAdmin, isDemo, adminLogin, adminLogout,
      isDriver, currentDriverId, driverLogin, driverLogout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
