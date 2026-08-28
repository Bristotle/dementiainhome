// Required-Dossier-Data Check
// Shared by the single-page generator and the batch backfill runner so both
// apply exactly the same rule: if a template's design_block asks for a dossier
// field the city genuinely has no verified data for, skip generation entirely
// rather than let the model fill the gap from its own training knowledge.
// (This is the Philadelphia/Medicaid failure mode - hallucinated state legal
// and benefits content that reads as authoritative and cites unrelated sources.)

import type { CityDossierForGate } from "./citation-gate"

export function checkRequiredDataPresent(
  dossierFields: string[],
  dossier: CityDossierForGate,
): string[] {
  const missing: string[] = []
  const fields = dossierFields || []
  if (fields.includes("medicaid_waiver") && !dossier.medicaid_waiver) missing.push("medicaid_waiver")
  if (fields.includes("local_resources") && (!dossier.local_resources || dossier.local_resources.length === 0)) missing.push("local_resources")
  if (fields.includes("demographics") && !dossier.demographics) missing.push("demographics")
  if (fields.includes("experts") && (!dossier.experts || dossier.experts.length === 0)) missing.push("experts")
  if (fields.includes("clinics") && (!dossier.clinics || dossier.clinics.length === 0)) missing.push("clinics")
  return missing
}
