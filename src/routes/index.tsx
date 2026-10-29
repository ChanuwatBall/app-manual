import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CSSProperties } from "react";
import AddLineOaBanner from "../assets/images/add-lineoa.png";
import AppleLogo from "../assets/images/apple-logo.png";
import PlayStoreLogo from "../assets/images/playtore-logo.png";
import ContactImage from "../assets/images/screen/Contact.png";
import DocumentsCurrentImage from "../assets/images/screen/Documents_Current.jpg";
import GeofencesImage from "../assets/images/screen/Geofences.png";
import HistoryImage from "../assets/images/screen/History.png";
import HomeImage from "../assets/images/screen/Home.png";
import LoginImage from "../assets/images/screen/Login.png";
import WebIcon from "../assets/images/icon.svg";
import MapCardsVehiclesImage from "../assets/images/screen/Map_Cards_Vehicles.png";
import MapScreenImage from "../assets/images/screen/Map_Screen.png";
import MdvrCurrentImage from "../assets/images/screen/MDVR_Current.jpg";
import MdvrLiveCurrentImage from "../assets/images/screen/MDVR_Live_Current.jpg";
import NotificationsImage from "../assets/images/screen/Notifications.png";
import ExpiredOfflineWarningImage from "../assets/images/screen/Popup_Warnning_ExpiredOffline.jpg";
import ReportSummaryImage from "../assets/images/screen/Report_Summary.png";
import ReportTemperatureImage from "../assets/images/screen/Report_Temperture.png";
import ReportTripsImage from "../assets/images/screen/Report_Trips.png";
import VehicleDetailImage from "../assets/images/screen/Vehicle_Detail.png";
import VehicleSensorsImage from "../assets/images/screen/Vehicle_Sensors.jpg";

type Company = "andaman" | "universe" | "evdd" | "atdigital";

type CompanyConfig = {
  contact: {
    name: string;
    logo?: string | null;
    color?: string | null;
    colorSecond?: string | null;
    primaryShade?: string | null;
    primaryTint?: string | null;
    secondaryShade?: string | null;
    secondaryTint?: string | null;
    telephone?: Array<{ number?: string | null }> | null;
    facebookUrl?: string | null;
    lineOa?: string | null;
    website?: string | null;
    websiteContact?: string | null;
  };
  version?: string | null;
};

const COMPANY_ENDPOINTS: Record<Company, string> = {
  andaman: "https://mobileapp-s1.andamantracking.dev/app/v2-3/index",
  universe: "https://mobileappv2-universe.attg.cc/app/v2-3/index",
  evdd: "https://api-evddtransport.attg.cc/app/v2-3/index" ,
  atdigital: "https://atmobileappv2.attg.cc/app/v2-3/index"
};

const getCompanyConfig = createServerFn({ method: "GET" })
  .inputValidator((data: { company: Company }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(COMPANY_ENDPOINTS[data.company], {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    console.log("/index response: ",response)

    if (!response.ok) {
      throw new Error(`Unable to load ${data.company} configuration (${response.status})`);
    }

    return (await response.json()) as CompanyConfig;
  });

export const Route = createFileRoute("/")({
  validateSearch: (search): { company?: Company } => ({
    company:
      search.company === "andaman" ||
      search.company === "universe" ||
      search.company === "atdigital" ||
      search.company === "evdd"
        ? search.company
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ company: search.company ?? "andaman" }),
  loader: async ({ deps }) => ({
    company: deps.company,
    config: await getCompanyConfig({ data: { company: deps.company } }),
  }),
  head: () => ({
    meta: [
      { title: "คู่มือ Andaman GPS — เอกสารระบบติดตามยานพาหนะ" },
      {
        name: "description",
        content:
          "คู่มือการใช้งาน Andaman GPS แบบครบถ้วน: ติดตามเรียลไทม์, ย้อนดูเส้นทาง, รายงาน, ตรวจสอบน้ำมัน และวิเคราะห์พฤติกรรมผู้ขับขี่",
      },
      { property: "og:title", content: "คู่มือ Andaman GPS" },
      { property: "og:description", content: "เอกสารแพลตฟอร์มติดตามยานพาหนะ" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: WebIcon,
      },
      {
        rel: "shortcut icon",
        href: WebIcon,
      },
    ],
  }),
  component: Index,
});

const IMG = {
  login: LoginImage,
  map: MapScreenImage,
  info: MapCardsVehiclesImage,
  mdvr: MdvrCurrentImage,
  mdvrLive: MdvrLiveCurrentImage,
  fleet: HomeImage,
  playback: HistoryImage,
  trip: ReportTripsImage,
  geofence: GeofencesImage,
  temp: ReportTemperatureImage,
  fuel: ReportSummaryImage,
  notif: NotificationsImage,
  expiredOfflineWarning: ExpiredOfflineWarningImage,
  documents: DocumentsCurrentImage,
  diag: VehicleDetailImage,
  sensor: VehicleSensorsImage,
  contact: ContactImage,
};

const DOWNLOAD_URLS: Record<Company, { android: string; ios: string }> = {
  andaman: {
    android: "https://play.google.com/store/apps/details?id=at.andamantracking.dev",
    ios: "https://apps.apple.com/us/app/%E0%B8%AD-%E0%B8%99%E0%B8%94%E0%B8%B2%E0%B8%A1-%E0%B8%99-%E0%B9%81%E0%B8%97%E0%B8%A3-%E0%B8%84%E0%B8%81-%E0%B8%87/id1513508217#?platform=iphone",
  },
  universe: {
    android: "https://play.google.com/store/apps/details?id=at.universe.dev",
    ios: "https://apps.apple.com/app/id1517367415",
  },
  atdigital: {
    android:
      "https://play.google.com/store/apps/details?id=at.atdigital.dev&pcampaignid=web_share",
    ios: "https://apps.apple.com/th/app/%E0%B9%80%E0%B8%AD%E0%B8%97-%E0%B8%94-%E0%B8%88-%E0%B8%95-%E0%B8%A5/id1517361363?l=th",
  },
  evdd: {
    android: "https://play.google.com/store/apps/details?id=at.evdd.dev&pcampaignid=web_share",
    ios: "https://apps.apple.com/th/app/ev-dd-carboncredit/id6748892910?l=th",
  },
};

const VERSION_URLS = {
  older: "https://drive.google.com/file/d/15SlHX92x7Zg7zsaH8XWBiseMej3jLEik/view",
};

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined align-middle ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
    >
      {name}
    </span>
  );
}

function Index() {
  const { company, config } = Route.useLoaderData();
  console.log("Index config  ",config)
  const contact = config.contact;
  const downloadUrls = DOWNLOAD_URLS[company];
  const qrCodeUrls = {
    android: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(downloadUrls.android)}`,
    ios: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(downloadUrls.ios)}`,
  };
  const phoneNumbers = (contact.telephone ?? [])
    .map(({ number }) => number?.trim())
    .filter((number): number is string => Boolean(number));
  const contactUrl = contact.websiteContact ?? contact.website;
  const brandStyles = {
    ...(contact.color ? { "--primary": contact.color } : {}),
    ...(contact.colorSecond ? { "--secondary": contact.colorSecond } : {}),
    ...(contact.primaryShade ? { "--primary-container": contact.primaryShade } : {}),
    ...(contact.primaryTint ? { "--primary-fixed": contact.primaryTint } : {}),
    ...(contact.secondaryShade ? { "--secondary-container": contact.secondaryShade } : {}),
    ...(contact.secondaryTint ? { "--secondary-fixed": contact.secondaryTint } : {}),
  } as CSSProperties;

  return (
    <div className="bg-background text-foreground min-h-screen" style={brandStyles}>
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-14 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          {contact.logo && (
            <img
              src={contact.logo}
              alt={`${contact.name} logo`}
              className="h-8 w-8 rounded object-contain"
            />
          )}
          <h1 className="text-lg font-bold text-primary">{contact.name} Manual</h1>
        </div>
        <select
          defaultValue="current"
          aria-label="เลือกเวอร์ชันคู่มือ"
          className="h-9 rounded-md border border-outline-variant bg-surface px-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          onChange={(event) => {
            if (event.target.value !== "current") {
              window.open(VERSION_URLS.older, "_blank", "noopener,noreferrer");
            }
          }}
        >
          <option value="older">v2.2.07</option>
          <option value="current">v2.2.23 (current)</option>
        </select>
      </header>

      {/* Main */}
      <main className="pt-20 pb-24 px-4 max-w-screen-xl mx-auto space-y-8">
        {/* Intro */}
        <section id="intro" className="space-y-4">
          <div className="bg-primary p-8 rounded-xl text-primary-foreground shadow-lg overflow-hidden relative">
            <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
              <Icon name="gps_fixed" className="!text-[160px]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
              ยินดีต้อนรับสู่ {contact.name}
            </h2>
            <p className="text-lg opacity-90 max-w-prose">
              ยกระดับงานโลจิสติกส์ของคุณด้วยระบบเทเลเมติกส์ความแม่นยำสูง
              และเครื่องมือบริหารจัดการรถระดับองค์กร
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {[
                {
                  icon: "update",
                  title: "ติดตามแบบเรียลไทม์",
                  desc: "ติดตามทุกการเคลื่อนไหวแบบอัปเดตต่อเนื่อง",
                },
                {
                  icon: "gas_meter",
                  title: "ตรวจสอบน้ำมัน",
                  desc: "อ่านค่าจากเซนเซอร์อย่างแม่นยำเพื่อลดความเสี่ยงทุจริต",
                },
                {
                  icon: "psychology",
                  title: "พฤติกรรมผู้ขับขี่",
                  desc: "วิเคราะห์การใช้ความเร็ว การเบรก และเวลาจอดติดเครื่อง",
                },
              ].map((f) => (
                <div key={f.title} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <Icon name={f.icon} className="mb-2 text-secondary-fixed" />
                  <h4 className="font-bold">{f.title}</h4>
                  <p className="text-sm opacity-80">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 text-primary border-b border-outline-variant pb-4">
            <Icon name="login" />
            <h2 className="text-xl font-semibold">เริ่มต้นใช้งาน</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">วิธีเข้าสู่ระบบ</h3>
              <p className="text-on-surface-variant">
                ทำตามขั้นตอนต่อไปนี้เพื่อเข้าใช้งานแดชบอร์ด:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-on-surface-variant ml-2">
                <li>เปิดแอป {contact.name} บนมือถือ</li>
                <li>
                  <strong>เลือกเซิร์ฟเวอร์:</strong> เลือกเซิร์ฟเวอร์ที่ได้รับมอบหมาย
                  (server1, server2 หรือ server3)
                </li>
                <li>
                  กรอก <strong>Account Name</strong> ของคุณ
                </li>
                <li>
                  กรอก <strong>Username</strong> และ <strong>Password</strong>
                </li>
                <li>แตะ "Sign In" เพื่อเข้าสู่หน้าภาพรวมรายการรถ</li>
              </ol>
              <div className="bg-secondary-fixed text-on-secondary-fixed p-4 rounded-lg border-l-4 border-secondary flex gap-4">
                <Icon name="error" className="shrink-0" />
                <p className="text-sm">
                  กรุณาเลือกเซิร์ฟเวอร์ให้ถูกต้อง  มิฉะนั้นอาจไม่
                  สามารถเข้าสู่ระบบได้
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl border border-outline-variant">
              <img
                src={IMG.login}
                alt={`หน้าจอเข้าสู่ระบบ ${contact.name}`}
                className="w-full object-cover aspect-[0.45]"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">ฟีเจอร์หลักของแพลตฟอร์ม</h2>
            <p className="text-on-surface-variant">
              ใช้งานเครื่องมือสำคัญเพื่อเพิ่มประสิทธิภาพการจัดการรถ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Icon name="location_on" />
                  <h3 className="font-bold">ติดตามสดและแผนที่</h3>
                </div>
                <p className="text-on-surface-variant mb-6">
                  ดูตำแหน่งรถทั้งหมดแบบสดบนแผนที่ความละเอียดสูง พร้อมตรวจสอบความเร็ว
                  ทิศทาง และสถานะเครื่องยนต์ในหน้าเดียว
                </p>
              </div>
              <div className="flex gap-4">
                <img
                  src={IMG.map}
                  alt="หน้าจอแผนที่"
                  className="w-1/2 rounded-lg border border-outline-variant shadow-md"
                />
                <img
                  src={IMG.info}
                  alt="แผงข้อมูลรถ"
                  className="w-1/2 rounded-lg border border-outline-variant shadow-md"
                />
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex flex-col h-full" >
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Icon name="dashboard" />
                  <h3 className="font-bold">ภาพรวมยานพาหนะ</h3>
                </div>
                <p className="text-on-surface-variant mb-6">
                  ดูภาพรวมทรัพย์สินทั้งหมด และคัดกรองสถานะ Online, Offline หรือ Idle
                  เพื่อระบุจุดที่ต้องจัดการได้ทันที
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <img
                  src={IMG.fleet}
                  alt="หน้ารายการภาพรวมรถ" style={{ aspectRatio: "4 / 4" }}
                  className="w-full  object-cover object-top rounded-lg border border-outline-variant shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Playback */}
          <div className="glass-card p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="play_circle" className="text-secondary" />
              <h3 className="text-xl font-semibold">ย้อนดูเส้นทาง (Playback)</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img
                  src={IMG.playback}
                  alt="หน้าจอย้อนดูเส้นทาง"
                  className="w-full rounded-xl shadow-lg border border-outline-variant"
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <p className="text-lg">
                  ฟีเจอร์ Playback ช่วยให้คุณตรวจสอบเส้นทางย้อนหลังตามวันและเวลา
                  ที่ต้องการ พร้อมแสดงเส้นทางการเดินรถอย่างชัดเจน
                </p>
                <ul className="zebra-stripes rounded-lg overflow-hidden border border-outline-variant">
                  {[
                    { icon: "calendar_today", text: "เลือกช่วงวันที่และเวลาได้ละเอียด" },
                    { icon: "speed", text: "ปรับความเร็วการเล่นย้อนหลังได้ (1x ถึง 10x)" },
                    { icon: "stop", text: "ดูจุดจอดและระยะเวลาจอดได้ทันที" },
                  ].map((r) => (
                    <div key={r.text} className="p-3 flex items-center gap-3">
                      <Icon name={r.icon} className="text-primary" />
                      <span>{r.text}</span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-surface-container p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-3">
              <Icon name="analytics" /> รายงานเชิงลึก
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { img: IMG.trip, label: "รายงานการเดินทาง" },
                { img: IMG.geofence, label: "รายงานพื้นที่ควบคุม" },
                { img: IMG.temp, label: "บันทึกอุณหภูมิ" },
                { img: IMG.fuel, label: "รายงานน้ำมัน" },
              ].map((r) => (
                <div key={r.label} className="space-y-2">
                  <img
                    src={r.img}
                    alt={r.label}
                    className="rounded-lg shadow border border-white/50"
                  />
                  <p className="text-xs font-semibold tracking-wider text-center uppercase">
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card p-6 rounded-xl flex items-start gap-6 border-l-4 border-primary">
            <div className="hidden md:block w-32 shrink-0">
              <img src={IMG.notif} alt="การแจ้งเตือน" className="rounded-lg shadow" />
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Icon name="notifications_active" /> การแจ้งเตือนแบบเรียลไทม์
              </h3>
              <p className="text-on-surface-variant">
                รับรู้เหตุการณ์สำคัญได้ทันทีโดยไม่ต้องเปิดแอป พร้อมตั้งค่า push
                notification สำหรับเหตุการณ์เช่น ขับเร็วเกินกำหนด จอดติดเครื่องนาน
                หรือเข้าออกพื้นที่ที่กำหนด
              </p>
            </div>
          </div>

          {/* Sensor Monitoring */}
          <div id="sensor" className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Icon name="sensors" />
              <h3 className="text-xl font-semibold">การติดตามเซนเซอร์</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-on-surface-variant">
                <p>
                  ตรวจสอบค่าสัญญาณจากตัวรถแบบละเอียดผ่านหน้าจอ Sensor เพื่อติดตาม
                  สถานะการทำงานแบบเรียลไทม์และวิเคราะห์ปัญหาได้เร็วขึ้น
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>แสดงค่าจากเซนเซอร์หลักของอุปกรณ์ติดตาม</li>
                  <li>ช่วยยืนยันสาเหตุเมื่อรถ Offline หรือข้อมูลผิดปกติ</li>
                  <li>ใช้ร่วมกับข้อมูลตำแหน่งและประวัติการวิ่งเพื่อวิเคราะห์เชิงลึก</li>
                </ul>
              </div>
              <img
                src={IMG.sensor}
                alt="หน้าจอเซนเซอร์ของรถ"
                className="w-full rounded-xl border border-outline-variant shadow-lg"
              />
            </div>
          </div>

          {/* Expired and offline alerts */}
          <section id="device-alerts" className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 text-secondary border-b border-outline-variant pb-4">
              <Icon name="warning" />
              <h3 className="text-xl font-semibold">แจ้งเตือนอุปกรณ์หมดอายุและออฟไลน์</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-6 items-start">
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  เมื่อเปิดแอป ระบบอาจแสดงหน้าต่างแจ้งเตือนเพื่อให้ตรวจสอบอุปกรณ์ที่ต้องดำเนินการ
                  โดยแบ่งเป็น 2 แท็บ ได้แก่ <strong>หมดอายุ</strong> และ <strong>ออฟไลน์</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>เลือกแท็บที่ต้องการตรวจสอบ</li>
                  <li>อ่านชื่อรถและวันที่ครบกำหนดในรายการ</li>
                  <li>หากอุปกรณ์หมดอายุ ให้ติดต่อทีม {contact.name} ตามช่องทางที่แสดงในหน้าต่าง</li>
                  <li>
                    เลือก <strong>ไม่แสดงอีก (14 วัน)</strong> เพื่อซ่อนการแจ้งเตือนชั่วคราว หรือ
                    เลือก <strong>ปิดวันนี้</strong> เพื่อปิดเฉพาะครั้งนี้
                  </li>
                </ol>
                <div className="bg-secondary-fixed text-on-secondary-fixed p-4 rounded-lg border-l-4 border-secondary flex gap-3">
                  <Icon name="info" className="shrink-0" />
                  <p className="text-sm">
                    การปิดหน้าต่างเป็นเพียงการซ่อนข้อความแจ้งเตือน ไม่ได้ต่ออายุบริการหรือแก้ไขสถานะ
                    การเชื่อมต่อของอุปกรณ์
                  </p>
                </div>
              </div>
              <img
                src={IMG.expiredOfflineWarning}
                alt="หน้าต่างแจ้งเตือนอุปกรณ์หมดอายุและออฟไลน์"
                className="w-full max-w-[220px] mx-auto rounded-xl border border-outline-variant shadow-lg"
              />
            </div>
          </section>

          {/* MDVR */}
          <section id="mdvr" className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 text-primary border-b border-outline-variant pb-4">
              <Icon name="videocam" />
              <h3 className="text-xl font-semibold">MDVR — กล้องถ่ายทอดสด</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
              <div className="space-y-4">
                <figure>
                  <img
                    src={IMG.mdvr}
                    alt="หน้าจอเลือกรถสำหรับ MDVR"
                    className="w-full max-w-[260px] mx-auto rounded-xl border border-outline-variant shadow-lg"
                  />
                  <figcaption className="text-center text-sm text-on-surface-variant mt-2">เลือกรถที่ติดตั้ง MDVR</figcaption>
                </figure>
                <figure>
                  <img
                    src={IMG.mdvrLive}
                    alt="หน้าจอกล้อง MDVR ถ่ายทอดสด"
                    className="w-full max-w-[260px] mx-auto rounded-xl border border-outline-variant shadow-lg"
                  />
                  <figcaption className="text-center text-sm text-on-surface-variant mt-2">ตัวอย่างหน้าจอกล้องถ่ายทอดสด</figcaption>
                </figure>
              </div>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  เปิดเมนูด้านข้าง แล้วเลือก <strong>MDVR</strong> จากนั้นแตะทะเบียนรถที่ต้องการเพื่อเปิดหน้า
                  <strong>กล้องถ่ายทอดสด</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>ตรวจสอบสถานะอุปกรณ์ จำนวนกล้อง และรหัสอุปกรณ์ที่แสดงด้านบน</li>
                  <li>เลือกแท็บ <strong>แผงควบคุม</strong> เพื่อดูวิดีโอ หรือ <strong>แผนที่</strong> เพื่อดูตำแหน่งรถ</li>
                  <li>เลือกรูปแบบการแสดงผล 1 ช่อง, 4 ช่อง หรือ 9 ช่อง ตามจำนวนกล้องที่ต้องการดู</li>
                  <li>เลือกคุณภาพวิดีโอ <strong>ประหยัดอินเทอร์เน็ต</strong> หรือ <strong>สูง</strong></li>
                  <li>แตะ CH1, CH2, CH3 หรือ CH4 เพื่อเลือกช่องกล้อง และใช้ปุ่มเต็มหน้าจอเมื่อต้องการขยายภาพ</li>
                </ol>
                <div className="bg-secondary-fixed text-on-secondary-fixed p-4 rounded-lg border-l-4 border-secondary flex gap-3">
                  <Icon name="wifi" className="shrink-0" />
                  <p className="text-sm">
                    รายการจะแสดงเฉพาะรถที่ติดตั้งและพร้อมใช้งานกับกล้อง MDVR หากไม่พบรถ ให้ตรวจสอบการเชื่อมต่อของอุปกรณ์ก่อน
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section id="documents" className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 text-primary border-b border-outline-variant pb-4">
              <Icon name="description" />
              <h3 className="text-xl font-semibold">เอกสารการชำระเงินและการรับประกัน</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
              <img
                src={IMG.documents}
                alt="หน้าจอเมนูเอกสาร"
                className="w-full max-w-[220px] mx-auto rounded-xl border border-outline-variant shadow-lg"
              />
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  เปิดเมนูด้านข้าง แล้วเลือก <strong>เอกสาร</strong> เพื่อดูข้อมูลเอกสารของบัญชี
                  จากหน้าจอนี้สามารถเลือกหัวข้อที่ต้องการได้ทันที
                </p>
                <ul className="space-y-3">
                  {[
                    ["ใบแจ้งชำระ", "ดูรายการที่รอชำระ โดยตัวเลขด้านขวาคือจำนวนใบแจ้งชำระปัจจุบัน"],
                    ["ประวัติใบเสร็จการชำระ", "ตรวจสอบรายการชำระเงินที่ดำเนินการแล้ว"],
                    ["การรับประกัน", "ดูรายละเอียดการรับประกันของอุปกรณ์หรือบริการ"],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                      <Icon name="chevron_right" className="text-primary shrink-0" />
                      <span>
                        <strong className="text-foreground">{title}</strong>
                        <span className="block text-sm mt-1">{desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 text-secondary border-b border-outline-variant pb-4">
            <Icon name="build" />
            <h2 className="text-xl font-semibold">การแก้ปัญหาเบื้องต้น</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 space-y-4">
              <p className="text-on-surface-variant">
                หากรถแสดงสถานะ Offline หรือข้อมูลไม่ถูกต้อง ให้ตรวจสอบที่แผง{" "}
                <strong>Status Information</strong> และเฝ้าดู 3 ค่าสำคัญดังนี้:
              </p>
              <div className="space-y-2">
                {[
                  ["สัญญาณ GSM", "สถานะการเชื่อมต่อเครือข่ายมือถือ"],
                  ["จำนวนดาวเทียม", "ความแม่นยำของตำแหน่ง GPS"],
                  ["เซนเซอร์น้ำมัน", "ปริมาณน้ำมันในถังปัจจุบัน (ลิตร)"],
                ].map(([name, desc]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-3 bg-surface rounded border border-outline-variant"
                  >
                    <span className="font-semibold">{name}</span>
                    <span className="text-sm text-on-surface-variant">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={IMG.diag}
                alt="สถานะการวินิจฉัยอุปกรณ์"
                className="rounded-xl border border-outline-variant shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="support"
          className="bg-surface-container-highest p-8 rounded-xl text-center space-y-6"
        >
          <Icon name="contact_support" className="!text-4xl text-primary" />
          <h2 className="text-2xl font-semibold text-primary">ต้องการความช่วยเหลือ?</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            ทีมซัพพอร์ตของเราพร้อมให้บริการตลอด 24 ชั่วโมง สำหรับการติดตั้ง
            การตั้งค่า และคำถามด้านเทคนิคทุกประเภท
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <img
              src={IMG.contact}
              alt={`ช่องทางติดต่อ ${contact.name}`}
              className="w-48 rounded-lg shadow-xl"
            />
            <div className="text-left space-y-4">
              {contactUrl && (
                <a
                  href={contactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold w-full md:w-auto hover:opacity-80 transition-opacity"
                >
                  เปิดแบบฟอร์มติดต่อ
                </a>
              )}
              {phoneNumbers.length > 0 && (
                <p className="text-sm text-on-surface-variant italic">
                  โทร: {phoneNumbers.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Download */}
        <section id="download" className="glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 text-primary border-b border-outline-variant pb-4">
            <Icon name="download" />
            <h2 className="text-xl font-semibold">ดาวน์โหลดแอปพลิเคชัน</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="   border-r-1 border-outline-variant overflow-hidden">
              <div className="   px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <img src={PlayStoreLogo} alt="Play Store" className="w-5 h-5 object-contain" />
                  Android
                </div>
                <span className="text-xs font-bold tracking-wide uppercase">Google Play</span>
              </div>
              <div className="p-5 text-center space-y-4">
                <p className="text-sm text-on-surface-variant">สแกน QR เพื่อติดตั้งบนมือถือ Android</p>
                <img
                  src={qrCodeUrls.android}
                  alt="QR Code ดาวน์โหลดแอป Android"
                  className="mx-auto w-44 h-44 rounded-lg   border-outline-variant bg-white p-2"
                />
                <a
                  href={downloadUrls.android}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full  px-5 py-2 font-semibold hover:opacity-90 transition-opacity"
                >
                  ดาวน์โหลด Android
                </a>
              </div>
            </article>

            <article className="  rounded-xl   border-outline-variant overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <img src={AppleLogo} alt="Apple" className="w-5 h-5 object-contain" /> iOS
                </div>
                <span className="text-xs font-bold tracking-wide uppercase">App Store</span>
              </div>
              <div className="p-5 text-center space-y-4">
                <p className="text-sm text-on-surface-variant">สแกน QR เพื่อติดตั้งบน iPhone</p>
                <img
                  src={qrCodeUrls.ios}
                  alt="QR Code ดาวน์โหลดแอป iOS"
                  className="mx-auto w-44 h-44 rounded-lg   border-outline-variant bg-white p-2"
                />
                <a
                  href={downloadUrls.ios}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full  px-5 py-2 font-semibold hover:opacity-90 transition-opacity"
                >
                  ดาวน์โหลด iOS
                </a>
              </div>
            </article>
          </div>

          {contact.lineOa && (
            <div className=" p-4 rounded-xl   border-outline-variant space-y-4">
              {/* <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
              <Icon name="chat" /> เพิ่มเพื่อน Line OA
            </h3> */}
              <a href={contact.lineOa} target="_blank" rel="noreferrer" className="block">
                <img
                  src={AddLineOaBanner}
                  alt="แบนเนอร์เพิ่มเพื่อน Line OA"
                  className="w-full  border border-outline-variant shadow"
                />
              </a>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant shadow-lg h-16 flex justify-around items-center rounded-t-xl md:hidden">
        {[
          { href: "#intro", icon: "info", label: "แนะนำ", active: true },
          { href: "#features", icon: "gps_fixed", label: "ฟีเจอร์" },
          { href: "#support", icon: "help_outline", label: "ช่วยเหลือ" },
          { href: "#device-alerts", icon: "notifications", label: "แจ้งเตือน" },
        ].map((n) => (
          <a
            key={n.label}
            href={n.href}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-full ${
              n.active
                ? "bg-secondary-container text-on-secondary-container scale-95"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name={n.icon} />
            <span className="text-xs font-semibold tracking-wider">{n.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
