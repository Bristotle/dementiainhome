import { City } from "./types";
export const MONTH1_CITIES: City[] = [
  { id:"new-york-ny", name:"New York", slug:"new-york-ny", state:"New York", state_abbrev:"NY", population:8336817, lat:40.7128, lng:-74.0060, hourly_rate_low:28, hourly_rate_high:42, meta_description:"Find vetted in-home dementia caregivers in New York City. Free 72-hour matching, transparent pricing from $28-$42/hr." },
  { id:"los-angeles-ca", name:"Los Angeles", slug:"los-angeles-ca", state:"California", state_abbrev:"CA", population:3979576, lat:34.0522, lng:-118.2437, hourly_rate_low:27, hourly_rate_high:40, meta_description:"Find vetted in-home dementia caregivers in Los Angeles. Free 72-hour matching, transparent pricing from $27-$40/hr." },
  { id:"chicago-il", name:"Chicago", slug:"chicago-il", state:"Illinois", state_abbrev:"IL", population:2693976, lat:41.8781, lng:-87.6298, hourly_rate_low:24, hourly_rate_high:36, meta_description:"Find vetted in-home dementia caregivers in Chicago. Free 72-hour matching, transparent pricing from $24-$36/hr." },
  { id:"houston-tx", name:"Houston", slug:"houston-tx", state:"Texas", state_abbrev:"TX", population:2304580, lat:29.7604, lng:-95.3698, hourly_rate_low:22, hourly_rate_high:34, meta_description:"Find vetted in-home dementia caregivers in Houston. Free 72-hour matching, transparent pricing from $22-$34/hr." },
  { id:"phoenix-az", name:"Phoenix", slug:"phoenix-az", state:"Arizona", state_abbrev:"AZ", population:1608139, lat:33.4484, lng:-112.0740, hourly_rate_low:22, hourly_rate_high:33, meta_description:"Find vetted in-home dementia caregivers in Phoenix. Free 72-hour matching, transparent pricing from $22-$33/hr." },
];
export function getCityBySlug(slug: string): City | undefined { return MONTH1_CITIES.find((c) => c.slug === slug); }
export function getAllSlugs(): string[] { return MONTH1_CITIES.map((c) => c.slug); }
