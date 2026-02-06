export function toISO(yyyyMMdd: string | undefined) {
  if (!yyyyMMdd) return undefined
  const d = new Date(yyyyMMdd)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}
