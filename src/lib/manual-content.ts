export type ManualSection = { id: string; category: string; title: string; summary: string; steps: string[] };
export type CompanyTheme = {
  companyName: string; appName: string; webTitle: string; appIcon: string;
  primaryColor: string; secondaryColor: string; accentColor: string; backgroundColor: string;
  surfaceColor: string; textColor: string; mutedTextColor: string; borderColor: string;
  successColor: string; dangerColor: string; iconColor: string;
};
export const manualSections: ManualSection[] = [
  { id: "login", category: "เริ่มต้นใช้งาน", title: "เข้าสู่ระบบ", summary: "เข้าสู่ระบบด้วยข้อมูลบัญชีที่ได้รับ และเริ่มต้นใช้งานแอปอย่างปลอดภัย", steps: ["เปิดแอป Andaman GPS Mobile", "เลือกเซิร์ฟเวอร์ที่ได้รับมอบหมาย", "กรอก Account Name, Username และ Password", "แตะ Sign In เพื่อเข้าสู่หน้าภาพรวม"] },
  { id: "map", category: "ติดตามรถ", title: "แผนที่และการติดตามสด", summary: "ดูตำแหน่งรถ สถานะเครื่องยนต์ ความเร็ว และทิศทางแบบเรียลไทม์", steps: ["เลือกเมนู Map จากแถบด้านล่าง", "ค้นหาหรือเลือกยานพาหนะจากรายการบนแผนที่", "แตะไอคอนรถบนแผนที่เพื่อดูรายละเอียด"] },
  { id: "vehicle", category: "จัดการยานพาหนะ", title: "ข้อมูลและสถานะรถ", summary: "ดูรถทุกคันตามสถานะ พร้อมตรวจสอบตำแหน่ง ระยะทาง ความเร็ว และรายละเอียดสำคัญได้จากการ์ดรถ", steps: ["เปิดเมนู Vehicles เพื่อดูรายการรถทั้งหมด", "ใช้ช่องค้นหา หรือเลือกแท็บสถานะ เช่น All, Online, Move, Idle และ Stop", "แตะการ์ดรถที่ต้องการ เพื่อดูสถานะล่าสุด ตำแหน่ง ความเร็ว และระยะทาง", "เลื่อนดูรายละเอียดรถ ข้อมูลเซนเซอร์ เชื้อเพลิง อุปกรณ์ และกิจกรรมเพิ่มเติม"] },
  { id: "card-info", category: "จัดการยานพาหนะ", title: "คำอธิบายไอคอนและข้อมูลในการ์ดรถ", summary: "ทำความเข้าใจสัญลักษณ์ สถานะ และข้อมูลสำคัญที่แสดงบนการ์ดของรถแต่ละคัน", steps: ["ไอคอนรถและชื่อทะเบียน แสดงยานพาหนะที่กำลังดูอยู่", "ป้ายสีสถานะ เช่น Move หรือ Stop แสดงการเคลื่อนไหวของรถ พร้อมระยะเวลาสถานะ", "ไอคอนข้อมูลบนการ์ดแสดงค่า เช่น ความเร็ว ระยะทาง อุณหภูมิ และสถานะอุปกรณ์", "ไอคอนหมุดแสดงตำแหน่งหรือชื่อพื้นที่ล่าสุดของรถ"] },
  { id: "mdvr", category: "จัดการยานพาหนะ", title: "การใช้งาน MDVR", summary: "ตรวจสอบสถานะกล้องบันทึกภาพในรถ และดูข้อมูลอุปกรณ์ MDVR จากการ์ดรถ", steps: ["เปิดเมนู Vehicles แล้วเลือกรถที่ติดตั้งอุปกรณ์ MDVR", "ตรวจสอบไอคอน MDVR บนการ์ดรถเพื่อดูสถานะการเชื่อมต่อ", "แตะการ์ดรถเพื่อดูข้อมูลและการดำเนินการเพิ่มเติมของรถ"] },
  { id: "history", category: "ติดตามรถ", title: "ดูเส้นทางย้อนหลัง", summary: "ย้อนดูเส้นทางการเดินรถ พร้อมตำแหน่ง ความเร็ว เวลา และสถานที่ระหว่างการเดินทาง", steps: ["เลือกยานพาหนะ และกำหนดช่วงวัน–เวลาในหน้า เส้นทางย้อนหลัง", "แตะ Start Date หรือ End Date เพื่อเลือกวันที่และเวลา", "แตะ แสดงเส้นทางย้อนหลัง เพื่อดูเส้นทาง พร้อมข้อมูลความเร็ว เวลา และสถานที่", "แตะปุ่ม Play เพื่อเริ่มจำลองเส้นทาง และเลือก Speed Control เพื่อปรับความเร็ว"] },
  { id: "reports", category: "รายงาน", title: "รายงานการเดินทาง", summary: "สร้างรายงานสรุปการใช้งานรถ ระยะทาง เวลาเดินทาง และพฤติกรรมผู้ขับขี่", steps: ["เปิดเมนู Reports", "เลือกรูปแบบรายงานที่ต้องการ", "กำหนดรถและช่วงวันที่", "แตะ Generate เพื่อดูหรือส่งออกรายงาน"] },
  { id: "geofence", category: "ความปลอดภัย", title: "กำหนดพื้นที่ปลอดภัย", summary: "เพิ่มเขตพื้นที่ (POI) บนแผนที่ เพื่อกำหนดจุดหรือขอบเขตที่ต้องการติดตาม", steps: ["เลือก Polygon หรือ Circle แล้ววางจุดบนแผนที่เพื่อกำหนดขอบเขตพื้นที่", "ระบุชื่อเขตพื้นที่ / POI เลือกไอคอน แล้วแตะ เพิ่มเขตพื้นที่"] },
  { id: "alerts", category: "ความปลอดภัย", title: "การแจ้งเตือน", summary: "ติดตามเหตุการณ์สำคัญ เช่น ความเร็วเกิน จอดนาน หรือรถออกนอกพื้นที่", steps: ["แตะไอคอน Notification", "เลือกการแจ้งเตือนที่ต้องการอ่าน", "แตะเหตุการณ์เพื่อดูรถและตำแหน่ง", "ปรับการตั้งค่าการแจ้งเตือนได้จากเมนู Settings"] },
];
export type ManualContent = { heroTitle: string; heroSubtitle: string; coverImage: string; mockupImage: string; videoUrl: string; sections: ManualSection[]; theme: CompanyTheme };
export type CompanyManual = ManualContent & { companyId: string };
export const defaultTheme: CompanyTheme = {
  companyName: "ANDAMAN GPS", appName: "Andaman GPS Mobile", webTitle: "Andaman GPS Mobile | คู่มือการใช้งาน", appIcon: "",
  primaryColor: "#176bd0", secondaryColor: "#0f427f", accentColor: "#eaf3ff", backgroundColor: "#f4f8fc",
  surfaceColor: "#ffffff", textColor: "#10233f", mutedTextColor: "#71889e", borderColor: "#e1eaf4",
  successColor: "#22a464", dangerColor: "#d8646d", iconColor: "#176bd0",
};
const defaults: CompanyManual = { companyId: "andaman", heroTitle: "คู่มือ Andaman GPS Mobile", heroSubtitle: "คู่มือฉบับย่อที่จะช่วยให้คุณติดตาม ควบคุม และจัดการยานพาหนะได้มั่นใจในทุกเส้นทาง", coverImage: "", mockupImage: "", videoUrl: "", sections: manualSections, theme: defaultTheme };
export function applyCompanyTheme(theme: CompanyTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries({
    "--theme-primary": theme.primaryColor, "--theme-secondary": theme.secondaryColor, "--theme-accent": theme.accentColor,
    "--theme-background": theme.backgroundColor, "--theme-surface": theme.surfaceColor, "--theme-text": theme.textColor,
    "--theme-muted": theme.mutedTextColor, "--theme-border": theme.borderColor, "--theme-success": theme.successColor, "--theme-danger": theme.dangerColor, "--theme-icon": theme.iconColor,
  }).forEach(([key, value]) => root.style.setProperty(key, value));
  document.title = theme.webTitle || theme.appName;
  let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!icon) { icon = document.createElement("link"); icon.rel = "icon"; document.head.appendChild(icon); }
  if (theme.appIcon) icon.href = theme.appIcon;
}
export function normalizeCompanyId(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9ก-๙]+/g, "-").replace(/^-+|-+$/g, "") || "company"; }
function mergeCompany(saved: Partial<CompanyManual>): CompanyManual { return { ...defaults, ...saved, companyId: saved.companyId || defaults.companyId, theme: { ...defaultTheme, ...saved.theme } }; }
export function getCompanyIdFromUrl() { if (typeof window === "undefined") return defaults.companyId; return new URLSearchParams(window.location.search).get("company") || defaults.companyId; }
export function getCompanyManuals(): CompanyManual[] {
  if (typeof window === "undefined") return [defaults];
  try {
    const collection = JSON.parse(localStorage.getItem("andaman-manual-companies") || "null");
    if (Array.isArray(collection) && collection.length) return collection.map(mergeCompany);
    const legacy = JSON.parse(localStorage.getItem("andaman-manual-content") || "{}");
    return [mergeCompany(legacy)];
  } catch { return [defaults]; }
}
export function getManualContent(companyParam = getCompanyIdFromUrl()): CompanyManual {
  const companies = getCompanyManuals(); const normalized = normalizeCompanyId(companyParam);
  return companies.find((company) => company.companyId === normalized || normalizeCompanyId(company.theme.companyName) === normalized) || companies[0];
}
export function saveManualContent(content: CompanyManual) {
  const companies = getCompanyManuals(); const index = companies.findIndex((company) => company.companyId === content.companyId);
  const updated = index === -1 ? [...companies, content] : companies.map((company, i) => i === index ? content : company);
  localStorage.setItem("andaman-manual-companies", JSON.stringify(updated));
  window.dispatchEvent(new Event("manual-content-updated"));
}
