export interface PizzaSize {
  name: string;
  price: number;
}

export interface Additional {
  id: string;
  name: string;
  price: number;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: PizzaSize[];
  flavors: string[];
  additionals: Additional[];
  available: boolean;
  allowHalfHalf?: boolean;
}

export interface CartItem {
  id: string;
  pizza: Pizza;
  size: PizzaSize;
  quantity: number;
  selectedAdditionals: Additional[];
  halfFlavor?: string; // second flavor for half-and-half
  halfPizza?: Pizza; // the second pizza for half-and-half
  subtotal: number;
}

export type OrderStatus = 'received' | 'preparing' | 'delivering' | 'delivered';
export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'pix' | 'card';

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  vehicleType: 'moto' | 'carro';
  plate: string;
  pix: string;
  photoUrl?: string;
  cnhUrl?: string;
  available: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  number: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  address?: string;           // endereço completo montado automaticamente
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressCep?: string;
  distanceKm?: number;
  deliveryFee?: number;
  driverId?: string;
  driverLat?: number;
  driverLng?: number;
  driverLocationAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryFeeConfig {
  baseFeeKm: number; // free km included in base fee
  baseDeliveryFee: number; // base delivery fee
  extraKmRate: number; // R$ per km above baseFeeKm
}

export interface PizzeriaConfig {
  name: string;
  logo: string;
  phone?: string;
  openingHours: string;
  closingHours: string;
  deliveryFee: number;
  avgPrepTime: number;
  isOpen: boolean;
  deliveryFeeConfig: DeliveryFeeConfig;
  pizzeriaAddress: string; // endereço completo montado (para Maps)
  addressStreet?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressCep?: string;
  categories?: string[];
}
