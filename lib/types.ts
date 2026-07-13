export type City = {
  id: string; name: string; slug: string; state: string; state_abbrev: string;
  population: number; lat: number; lng: number;
  hourly_rate_low: number; hourly_rate_high: number; meta_description?: string;
}
export type Lead = {
  id?: string; first_name: string; last_name: string; email: string;
  phone: string; city: string; state: string; message?: string; created_at?: string;
}
