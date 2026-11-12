import companyData from "../data/companies.json";

export type ManualSection = {
  id: string;
  category: string;
  title: string;
  summary: string;
  steps: string[];
};
export type CompanyTheme = {
  companyName: string;
  appName: string;
  webTitle: string;
  appIcon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  successColor: string;
  dangerColor: string;
  iconColor: string;
};
export type ManualContent = {
  heroTitle: string;
  heroSubtitle: string;
  coverImage: string;
  mockupImage: string;
  videoUrl: string;
  sections: ManualSection[];
  theme: CompanyTheme;
};
export type CompanyManual = ManualContent & { companyId: string };
const companies = companyData as CompanyManual[];
export const defaultTheme = companies[0].theme;
export const manualSections = companies[0].sections;
export function applyCompanyTheme(theme: CompanyTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries({
    "--theme-primary": theme.primaryColor,
    "--theme-secondary": theme.secondaryColor,
    "--theme-accent": theme.accentColor,
    "--theme-background": theme.backgroundColor,
    "--theme-surface": theme.surfaceColor,
    "--theme-text": theme.textColor,
    "--theme-muted": theme.mutedTextColor,
    "--theme-border": theme.borderColor,
    "--theme-success": theme.successColor,
    "--theme-danger": theme.dangerColor,
    "--theme-icon": theme.iconColor,
  }).forEach(([key, value]) => root.style.setProperty(key, value));
  document.title = theme.webTitle || theme.appName;
  let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.appendChild(icon);
  }
  if (theme.appIcon) icon.href = theme.appIcon;
}
export function normalizeCompanyId(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]+/g, "-")
      .replace(/^-+|-+$/g, "") || "company"
  );
}
export function getCompanyIdFromUrl() {
  if (typeof window === "undefined") return companies[0].companyId;
  return new URLSearchParams(window.location.search).get("company") || companies[0].companyId;
}
export function getCompanyManuals(): CompanyManual[] {
  return companies;
}
export function getManualContent(companyParam = getCompanyIdFromUrl()): CompanyManual {
  const companies = getCompanyManuals();
  const normalized = normalizeCompanyId(companyParam);
  return (
    companies.find(
      (company) =>
        company.companyId === normalized ||
        normalizeCompanyId(company.theme.companyName) === normalized,
    ) || companies[0]
  );
}
export function saveManualContent(content: CompanyManual) {
  // This only updates the editor preview. Persist shared changes in data/companies.json and deploy.
  window.dispatchEvent(new Event("manual-content-updated"));
}

export function downloadCompanyManuals(updatedCompanies: CompanyManual[]) {
  const file = new Blob([`${JSON.stringify(updatedCompanies, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "companies.json";
  link.click();
  URL.revokeObjectURL(url);
}
