import type {
  Appointment,
  AppointmentStatus,
  Barber,
  Client,
  Commission,
  Product,
  Service,
  User,
} from '../types';

const API_BASE = '/api/v1';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const body: ApiResponse<T> = await response.json();

  if (!response.ok || body.status === 'error') {
    throw new Error(body.message ?? 'Error en la solicitud');
  }

  return body.data as T;
}

export async function login(email: string, password: string) {
  return request<{ user: User; accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getAppointments(token: string, status?: AppointmentStatus) {
  const query = status ? `?status=${status}` : '';
  return request<Appointment[]>(`/appointments${query}`, {}, token);
}

export async function createAppointment(
  token: string,
  payload: {
    clientId: string;
    barberId: string;
    appointmentDate: string;
    serviceIds: string[];
    notes?: string;
  }
) {
  return request<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function updateAppointmentStatus(
  token: string,
  id: string,
  status: AppointmentStatus
) {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);
}

export async function completeAppointment(token: string, id: string) {
  return request<{
    commission: { commissionAmount: number };
    payment: { amount: number };
  }>(`/appointments/${id}/complete`, { method: 'POST' }, token);
}

export async function getClients(token: string) {
  return request<Client[]>('/clients', {}, token);
}

export async function createClient(
  token: string,
  payload: { name: string; phone: string; email?: string }
) {
  return request<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function getServices() {
  return request<Service[]>('/services');
}

export async function getBarbers(token: string) {
  return request<Barber[]>('/barbers', {}, token);
}

export async function getCriticalInventory(token: string) {
  return request<Product[]>('/inventory/critical', {}, token);
}

export async function getBarberCommissions(token: string, barberId: string) {
  return request<Commission[]>(`/barbers/${barberId}/commissions`, {}, token);
}
