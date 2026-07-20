const formatter = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

export function experiencePeriod(startDate: string, endDate: string | null, current: boolean) {
  const start = formatter.format(new Date(`${startDate}T00:00:00Z`));
  const end = current ? "Present" : endDate ? formatter.format(new Date(`${endDate}T00:00:00Z`)) : "Present";
  return `${start} — ${end}`;
}
