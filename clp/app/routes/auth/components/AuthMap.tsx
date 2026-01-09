import React from "react"

const regions = [
  // North America
  {
    id: "us-east",
    label: "US East Coast",
    description: "Primary data center serving Eastern United States.",
    top: "38%",
    left: "25%",
  },
  {
    id: "us-west",
    label: "US West Coast",
    description: "Low latency edge locations in California & Washington.",
    top: "40%",
    left: "18%",
  },
  {
    id: "us-central",
    label: "US Central",
    description: "Midwest region with high availability clusters.",
    top: "42%",
    left: "22%",
  },
  {
    id: "canada",
    label: "Canada",
    description: "Toronto & Montreal data centers for Canadian users.",
    top: "28%",
    left: "24%",
  },
  {
    id: "mexico",
    label: "Mexico",
    description: "Mexico City edge location for LATAM connectivity.",
    top: "48%",
    left: "20%",
  },
  // South America
  {
    id: "brazil",
    label: "Brazil",
    description: "São Paulo data center serving South America.",
    top: "62%",
    left: "35%",
  },
  {
    id: "argentina",
    label: "Argentina",
    description: "Buenos Aires edge location for Southern Cone.",
    top: "70%",
    left: "32%",
  },
  {
    id: "chile",
    label: "Chile",
    description: "Santiago presence for Pacific South America.",
    top: "68%",
    left: "28%",
  },
  // Europe
  {
    id: "uk",
    label: "United Kingdom",
    description: "London data center with EU connectivity.",
    top: "32%",
    left: "48%",
  },
  {
    id: "germany",
    label: "Germany",
    description: "Frankfurt hub serving Central Europe.",
    top: "36%",
    left: "52%",
  },
  {
    id: "france",
    label: "France",
    description: "Paris edge location for Western Europe.",
    top: "38%",
    left: "50%",
  },
  {
    id: "spain",
    label: "Spain",
    description: "Madrid data center for Iberian Peninsula.",
    top: "42%",
    left: "48%",
  },
  {
    id: "italy",
    label: "Italy",
    description: "Milan presence serving Southern Europe.",
    top: "40%",
    left: "54%",
  },
  {
    id: "netherlands",
    label: "Netherlands",
    description: "Amsterdam hub with excellent EU connectivity.",
    top: "34%",
    left: "51%",
  },
  {
    id: "sweden",
    label: "Sweden",
    description: "Stockholm data center for Nordic region.",
    top: "24%",
    left: "54%",
  },
  {
    id: "poland",
    label: "Poland",
    description: "Warsaw edge location for Eastern Europe.",
    top: "34%",
    left: "56%",
  },
  // Middle East
  {
    id: "uae",
    label: "United Arab Emirates",
    description: "Dubai data center serving Middle East & South Asia.",
    top: "50%",
    left: "62%",
  },
  {
    id: "israel",
    label: "Israel",
    description: "Tel Aviv edge location for Middle East connectivity.",
    top: "44%",
    left: "58%",
  },
  {
    id: "saudi-arabia",
    label: "Saudi Arabia",
    description: "Riyadh presence for Gulf region.",
    top: "48%",
    left: "60%",
  },
  // Asia
  {
    id: "india",
    label: "India",
    description: "Mumbai & Bangalore data centers serving South Asia.",
    top: "52%",
    left: "68%",
  },
  {
    id: "singapore",
    label: "Singapore",
    description: "Regional hub for Southeast Asia.",
    top: "58%",
    left: "76%",
  },
  {
    id: "japan",
    label: "Japan",
    description: "Tokyo data center with low latency to Asia-Pacific.",
    top: "42%",
    left: "82%",
  },
  {
    id: "south-korea",
    label: "South Korea",
    description: "Seoul edge location for Northeast Asia.",
    top: "40%",
    left: "80%",
  },
  {
    id: "china",
    label: "China",
    description: "Shanghai & Beijing presence for Greater China.",
    top: "38%",
    left: "78%",
  },
  {
    id: "hong-kong",
    label: "Hong Kong",
    description: "Regional gateway for Asia-Pacific connectivity.",
    top: "46%",
    left: "80%",
  },
  {
    id: "thailand",
    label: "Thailand",
    description: "Bangkok edge location for Southeast Asia.",
    top: "56%",
    left: "74%",
  },
  {
    id: "indonesia",
    label: "Indonesia",
    description: "Jakarta data center serving Southeast Asia.",
    top: "62%",
    left: "78%",
  },
  {
    id: "philippines",
    label: "Philippines",
    description: "Manila presence for Southeast Asian markets.",
    top: "54%",
    left: "82%",
  },
  // Africa
  {
    id: "south-africa",
    label: "South Africa",
    description: "Johannesburg data center serving Southern Africa.",
    top: "78%",
    left: "58%",
  },
  {
    id: "kenya",
    label: "Kenya",
    description: "Nairobi edge location for East Africa.",
    top: "60%",
    left: "62%",
  },
  {
    id: "nigeria",
    label: "Nigeria",
    description: "Lagos presence for West Africa.",
    top: "54%",
    left: "52%",
  },
  {
    id: "egypt",
    label: "Egypt",
    description: "Cairo data center serving North Africa & Middle East.",
    top: "46%",
    left: "58%",
  },
  {
    id: "morocco",
    label: "Morocco",
    description: "Casablanca edge location for North Africa.",
    top: "44%",
    left: "50%",
  },
  // Oceania
  {
    id: "australia",
    label: "Australia",
    description: "Sydney & Melbourne data centers for Oceania.",
    top: "76%",
    left: "84%",
  },
  {
    id: "new-zealand",
    label: "New Zealand",
    description: "Auckland edge location for Pacific region.",
    top: "82%",
    left: "88%",
  },
]

const AuthMap: React.FC = () => {
  return (
    <div className="md:relative absolute h-full w-full z-[-1] opacity-[.3]">
      {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary)/15%,transparent_60%)]" /> */}

      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="relative w-[90%] max-w-[820px] aspect-[16/9]">
          <img
            src="/map.svg"
            alt="Global presence map"
            className="h-full w-full object-contain opacity-70"
            draggable={false}
          />

          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className="auth-map-dot group absolute"
              style={{ top: region.top, left: region.left }}
            >
              <span className="auth-map-dot-core" />
              <span className="auth-map-dot-pulse" />

              <div className="auth-map-tooltip">
                <p className="auth-map-tooltip-title">{region.label}</p>
                <p className="auth-map-tooltip-body">{region.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  )
}

export default AuthMap

