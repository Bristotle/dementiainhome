import type { LocalClinic, LocalExpert, LocalHospital } from "@/lib/db-cities"

// Real named local providers on the guide pages about them.
//
// The database holds 1,000 clinicians from the federal NPI registry, 359 home
// health agencies from Medicare's own provider records, and 156 hospitals with a
// memory unit, each verified in August with a telephone number or an NPI and a
// source URL. Until now none of it reached a guide page: the city hub got these
// tables in September and the 980 guides beneath it got nothing.
//
// The ranking data says this is the gap worth closing. A Tucson page sits at
// position ten for "neurologist for dementia near me" with no neurologist named
// on it, and Baltimore at eleven for "geriatric care managers near me". A query
// ending in "near me" wants names and telephone numbers.
//
// Each block says where the data came from and states that we have no
// relationship with anyone listed, which is the same standard the city hub and
// the generated pages are held to.

const note = "text-slate-600 mb-6 max-w-2xl"
const h2 = "text-2xl font-bold text-slate-900 mb-2"
const heading = { fontFamily: "var(--font-fraunces)" } as const

export function ExpertList({ experts, cityName, label }: { experts: LocalExpert[]; cityName: string; label: string }) {
  if (experts.length === 0) return null
  return (
    <>
      <h2 className={h2} style={heading}>{label} practising in {cityName}</h2>
      <p className={note}>
        Listed in the federal NPI registry with this specialty. This is public reference
        information: none of these clinicians is affiliated with us or endorses this service.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
        {experts.map((e) => (
          <li key={`${e.name}-${e.npi_number ?? ""}`} className="text-sm">
            <a href={e.profile_url ?? e.source_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
              {e.name}
            </a>
            {e.npi_number && <span className="block text-xs text-slate-500">NPI {e.npi_number}</span>}
          </li>
        ))}
      </ul>
    </>
  )
}

export function HospitalTable({ hospitals, cityName }: { hospitals: LocalHospital[]; cityName: string }) {
  if (hospitals.length === 0) return null
  return (
    <>
      <h2 className={h2} style={heading}>Hospitals in {cityName} to contact about a memory evaluation</h2>
      <p className={note}>
        From Medicare&apos;s published hospital records. Telephone the hospital and ask for the
        memory or geriatric assessment service, since not every unit takes direct referrals.
      </p>
      <div className="overflow-x-auto border border-slate-200 rounded-xl mb-10">
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Hospital</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Address</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Telephone</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hsp) => (
              <tr key={hsp.name} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-900">{hsp.name}</td>
                <td className="px-4 py-3 text-slate-600">{hsp.address ?? "—"}</td>
                <td className="px-4 py-3">
                  {hsp.phone ? <a href={`tel:${hsp.phone.replace(/[^0-9+]/g, "")}`} className="font-medium hover:underline">{hsp.phone}</a> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function AgencyTable({ clinics, cityName }: { clinics: LocalClinic[]; cityName: string }) {
  if (clinics.length === 0) return null
  return (
    <>
      <h2 className={h2} style={heading}>Home health agencies serving {cityName}</h2>
      <p className={note}>
        From Medicare&apos;s own provider records, with the quality rating Medicare publishes.
        We do not rank these and we have no relationship with any of them.
      </p>
      <div className="overflow-x-auto border border-slate-200 rounded-xl mb-10">
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Provider</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Medicare rating</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Telephone</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((c) => (
              <tr key={c.name} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.rating != null ? `${c.rating} of 5` : "not rated"}</td>
                <td className="px-4 py-3">
                  {c.phone ? <a href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`} className="font-medium hover:underline">{c.phone}</a> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
