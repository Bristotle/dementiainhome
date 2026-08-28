// Required-Dossier-Data Check
// Shared by the single-page generator and the batch backfill runner so both
// apply exactly the same rule: if a template's design_block asks for data the
// city has no verified source for, skip generation entirely rather than let
// the model fill the gap from its own training knowledge. (This is the
// Philadelphia/Medicaid failure mode - hallucinated state legal and benefits
// content that reads as authoritative and cites unrelated sources.)

import type { CityDossierForGate } from "./citation-gate"

export type TemplateDesignBlock = {
  dossier_fields?: string[]
  // Some templates need a particular KIND of local resource, not just any row.
  // A page about elder-law attorneys in Baltimore is not grounded by an
  // Alzheimer's Association chapter being on file - before this, one row of
  // any type unblocked all twelve local_resources templates equally.
  required_resource_types?: string[]
}

export function checkRequiredDataPresent(
  designBlock: TemplateDesignBlock | string[] | null | undefined,
  dossier: CityDossierForGate,
): string[] {
  // Accepts the raw dossier_fields array too, so existing callers that pass
  // just the field list keep working.
  const block: TemplateDesignBlock = Array.isArray(designBlock)
    ? { dossier_fields: designBlock }
    : (designBlock ?? {})
  const fields = block.dossier_fields ?? []
  const missing: string[] = []

  if (fields.includes("medicaid_waiver") && !dossier.medicaid_waiver) missing.push("medicaid_waiver")
  if (fields.includes("demographics") && !dossier.demographics) missing.push("demographics")
  if (fields.includes("experts") && (!dossier.experts || dossier.experts.length === 0)) missing.push("experts")
  if (fields.includes("clinics") && (!dossier.clinics || dossier.clinics.length === 0)) missing.push("clinics")

  if (fields.includes("local_resources")) {
    const resources = dossier.local_resources ?? []
    if (resources.length === 0) {
      missing.push("local_resources")
    } else {
      for (const type of block.required_resource_types ?? []) {
        if (!resources.some((r) => r.resource_type === type)) missing.push(`local_resources:${type}`)
      }
    }
  }

  return missing
}
