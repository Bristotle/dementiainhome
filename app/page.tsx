import { getAllCities } from "@/lib/db-cities"
import { getFeaturedGuides } from "@/lib/db-pages"
import HomeView from "@/components/HomeView"

// The homepage view is a client component (carousel, dropdowns, search modal),
// so the city list is fetched here on the server and passed down. It used to
// read a hardcoded five-city array while the database had twenty, which left
// fifteen city hubs with no internal link from the homepage or footer.
export const revalidate = 3600

export default async function HomePage() {
  const [cities, featuredGuides] = await Promise.all([getAllCities(), getFeaturedGuides(12)])
  return <HomeView cities={cities} featuredGuides={featuredGuides} />
}
