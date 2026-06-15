export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

export interface Service {
  id: string;
  name: string;
  price: string | number;
  durationMinutes: number;
}

export interface Barber {
  id: string;
  name: string;
  commissionPercentage: string | number;
  user: { email: string; status: string; role: string };
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'cancelled'
  | 'no_show'
  | 'completed';

export interface Appointment {
  id: string;
  appointmentDate: string;
  status: AppointmentStatus;
  notes?: string | null;
  client: Client;
  barber: Barber;
  services: Array<{ id: string; priceApplied: string | number; service: Service }>;
  payment?: { amount: string | number; status: string } | null;
  commission?: { commissionAmount: string | number; commissionRate: string | number } | null;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  criticalLimit: number;
  price: string | number;
}

export interface Commission {
  id: string;
  commissionAmount: string | number;
  commissionRate: string | number;
  serviceAmount: string | number;
  calculatedAt: string;
  appointment: {
    client: Client;
    services: Array<{ service: Service }>;
  };
}

export type ViewId = 'dashboard' | 'appointments' | 'clients' | 'inventory' | 'commissions';
