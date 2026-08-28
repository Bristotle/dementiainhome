import Image from "next/image"
import { heroImageFor, heroAltFor } from "@/lib/hero-images"

// The hero image sits beside the headline rather than above it, so it never
// pushes the H1 and the lead-capture path below the fold. It is the largest
// element on the page, so it carries priority - without it Next lazy-loads the
// hero and Largest Contentful Paint waits for a late request.
export default function PageHero({ imageKey, placeName }: { imageKey: string; placeName: string }) {
  const image = heroImageFor(imageKey)
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
      <Image
        src={image.url}
        alt={heroAltFor(imageKey, placeName)}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 420px"
        className="object-cover"
      />
    </div>
  )
}
