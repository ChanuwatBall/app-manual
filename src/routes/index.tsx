import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BellRing, BookOpen, ChevronRight, CircleHelp, Download, Gauge, History, MapPinned, Menu, PlayCircle, Search, Settings2, ShieldCheck, X } from "lucide-react";
import LoginImage from "../images/screen/Login.png";
import LogoGlass from "../images/logo-glass.jpg";
import MapImage from "../images/screen/Map_Screen.png";
import HistoryImage from "../images/screen/History.png";
import ReportsImage from "../images/screen/Reports.png";
import GeofencesImage from "../images/screen/Geofences.png";
import NotificationsImage from "../images/screen/Notifications.png";
import VehicleListImage from "../assets/images/screenv22031/home.png";
import VehicleSearchImage from "../assets/images/screenv22031/home-search.png";
import VehicleDetailImage from "../assets/images/screenv22031/vehicle-detail-modal.png";
import VehicleSensorsImage from "../assets/images/screenv22031/vehicle-sensors-modal.png";
import FullMapImage from "../assets/images/screenv22031/fullmap.jpg";
import FullMapSearchImage from "../assets/images/screenv22031/fullmap-search.jpg";
import FullMapVehicleDetailImage from "../assets/images/screenv22031/fullmap-vehicle-detail.jpg";
import PassRouteImage from "../assets/images/screenv22031/passroute.jpg";
import PassRouteSelectDateImage from "../assets/images/screenv22031/passroute-select-date.jpg";
import PassRouteMapImage from "../assets/images/screenv22031/passroute-map.jpg";
import PassRoutePlaySpeedImage from "../assets/images/screenv22031/passroute-play-speed.jpg";
import PoiDrawingImage from "../assets/images/screenv22031/poi-drawing.jpg";
import AddPoiNameImage from "../assets/images/screenv22031/add-poi-name.jpg";
import CardVehicleTypeImage from "../assets/images/screenv22031/card-icon-vehicle-type.jpg";
import CardStatusTimeImage from "../assets/images/screenv22031/card-status-and-status-time.jpg";
import CardUpdateTimeImage from "../assets/images/screenv22031/card-update-time.jpg";
import CardSpeedImage from "../assets/images/screenv22031/card-sensor-speed.jpg";
import CardDistanceImage from "../assets/images/screenv22031/card-distance-today.jpg";
import CardTemperatureImage from "../assets/images/screenv22031/card-sensor-temperature.jpg";
import CardFuelImage from "../assets/images/screenv22031/card-sensor-fuel.jpg";
import CardHumidityImage from "../assets/images/screenv22031/card-sensor-humidity.jpg";
import CardCompressorImage from "../assets/images/screenv22031/card-compressor-status.jpg";
import CardMdvrImage from "../assets/images/screenv22031/card-mdvr.jpg";
import MdvrSelectVehicleImage from "../assets/images/screenv22031/mdvr-select-vehicle.jpg";
import MdvrLiveImage from "../assets/images/screenv22031/mdvr-live.jpg";
import MdvrChannelImage from "../assets/images/screenv22031/mdvr-channel.jpg";
import CardDriverImage from "../assets/images/screenv22031/card-driver-swipecard.jpg";
import CardLocationImage from "../assets/images/screenv22031/card-current-location.jpg";
import CardActionsImage from "../assets/images/screenv22031/card-actions-btn.jpg";
import MockupImage from "../assets/images/screenv22031/AndamanGPS-Mockup.png";
import { applyCompanyTheme, getManualContent, type ManualSection } from "../lib/manual-content";

export const Route = createFileRoute("/")({ component: ManualHome });
const icons = [BookOpen, MapPinned, Gauge, History, BellRing, Settings2];
const imagesById: Record<string, string> = { login: LoginImage, map: MapImage, vehicle: MapImage, "card-info": VehicleListImage, mdvr: CardMdvrImage, history: HistoryImage, reports: ReportsImage, geofence: GeofencesImage, alerts: NotificationsImage };
const vehicleStepImages = [VehicleListImage, VehicleSearchImage, VehicleDetailImage, VehicleSensorsImage];
const mapStepImages = [FullMapImage, FullMapSearchImage, FullMapVehicleDetailImage];
const historyStepImages = [PassRouteImage, PassRouteSelectDateImage, PassRouteMapImage, PassRoutePlaySpeedImage];
const geofenceStepImages = [PoiDrawingImage, AddPoiNameImage];
const mdvrStepImages = [MdvrSelectVehicleImage, MdvrLiveImage, MdvrChannelImage];
const TutorialVideo = "https://drive.google.com/file/d/1xRY_3oPA0hCaYjuA_uwq1Eb4Owh784Rh/preview";

function ManualHome() {
  const [content, setContent] = useState(getManualContent); const [query, setQuery] = useState(""); const [active, setActive] = useState("เริ่มต้นใช้งาน"); const [selected, setSelected] = useState<ManualSection | null>(null); const [menuOpen, setMenuOpen] = useState(false); const [videoOpen, setVideoOpen] = useState(false);
  useEffect(() => { const sync = () => setContent(getManualContent()); window.addEventListener("storage", sync); window.addEventListener("manual-content-updated", sync); return () => { window.removeEventListener("storage", sync); window.removeEventListener("manual-content-updated", sync); }; }, []);
  useEffect(() => applyCompanyTheme(content.theme), [content.theme]);
  const sections = content.sections; const matching = useMemo(() => sections.filter((item) => `${item.title} ${item.summary} ${item.steps.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query, sections]); const shown = query ? matching : sections;
  return <div className="manual-app">
    <header className="manual-topbar"><a className="brand" href="#top"><span className="brand-mark"><img src={content.theme.appIcon || LogoGlass} alt={content.theme.appName}/></span><span>{content.theme.companyName}</span></a><div className="top-actions"><span className="version-pill">{content.theme.appName}</span><a className="pdf-download top-pdf-download" href="/andaman-gps-mobile-manual.pdf" download><Download size={16}/> ดาวน์โหลด PDF</a><a href={`/admin?company=${encodeURIComponent(content.companyId)}`} className="admin-link">ผู้ดูแลระบบ</a><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="เปิดเมนู"><Menu size={20}/></button></div></header>
    <aside className={`manual-sidebar ${menuOpen ? "is-open" : ""}`}><div className="sidebar-caption">สารบัญคู่มือ</div><button className={`nav-row ${active === "เริ่มต้นใช้งาน" ? "active" : ""}`} onClick={() => { setActive("เริ่มต้นใช้งาน"); document.getElementById("top")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); }}><BookOpen size={17}/> เริ่มต้นใช้งาน</button><div className="sidebar-caption small">ฟีเจอร์ในแอป</div>{sections.map((item, i) => { const Icon = icons[(i + 1) % icons.length]; return <button key={item.id} className={`nav-row ${active === item.title ? "active" : ""}`} onClick={() => { setActive(item.title); setSelected(item); setMenuOpen(false); }}><Icon size={17}/>{item.title}</button>; })}<a className="sidebar-pdf-download" href="/andaman-gps-mobile-manual.pdf" download><Download size={17}/> ดาวน์โหลดคู่มือ PDF</a><div className="sidebar-bottom"><CircleHelp size={18}/><span>ต้องการความช่วยเหลือ?</span><a href="#contact">ติดต่อทีมงาน</a></div></aside>{menuOpen && <button className="sidebar-backdrop" type="button" aria-label="ปิดเมนู" onClick={() => setMenuOpen(false)}/>} 
    <main className="manual-main" id="top"><section className="hero-panel"><div className="hero-copy"><div className="eyebrow"><span></span> MOBILE APPLICATION GUIDE</div><h1>{content.heroTitle || "คู่มือ Andaman GPS Mobile"}<em>เวอร์ชันใหม่</em></h1><p>{content.heroSubtitle || "คู่มือฉบับย่อที่จะช่วยให้คุณติดตาม ควบคุม และจัดการยานพาหนะได้มั่นใจในทุกเส้นทาง"}</p><div className="hero-buttons"><a href="#manual" className="primary-button">เริ่มดูคู่มือ <ArrowRight size={18}/></a><a className="pdf-download" href="/andaman-gps-mobile-manual.pdf" download><Download size={18}/> ดาวน์โหลดคู่มือ PDF</a><button className="text-button" onClick={() => setVideoOpen(true)}><PlayCircle size={20}/> ดูวิดีโอแนะนำ</button></div></div><div className="hero-phone"><div className="phone-frame"><img src={content.mockupImage || content.coverImage || MockupImage} alt={`หน้าจอ ${content.theme.appName}`}/><span className="pulse-dot"></span></div><div className="floating-card"><span className="green-dot"></span><div><b>72 ยานพาหนะ</b><small>กำลังออนไลน์</small></div></div></div></section>
      <section className="search-zone" id="manual"><div className="search-box"><Search size={20}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาฟีเจอร์หรือวิธีใช้งาน เช่น “ดูเส้นทางย้อนหลัง”"/><kbd>⌘ K</kbd></div>{query && <p className="search-result">พบ {matching.length} หัวข้อที่เกี่ยวข้อง</p>}</section><section className="feature-head"><div><div className="eyebrow dark"><span></span> EXPLORE THE APP</div><h2>เลือกหัวข้อที่ต้องการ</h2></div><p>เรียนรู้ทุกฟังก์ชันของ Andaman GPS<br/>ได้ทีละขั้นตอนอย่างเป็นระบบ</p></section><section className="feature-grid">{shown.map((item, index) => { const Icon = icons[(index + 1) % icons.length]; return <article className="feature-card" key={item.id} onClick={() => setSelected(item)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(item)}><div className={`icon-box tone-${index % 4}`}><Icon size={25}/></div><div className="card-label">{item.category}</div><h3>{item.title}</h3><p>{item.summary}</p><button>ดูวิธีใช้งาน <ChevronRight size={17}/></button></article>; })}</section>{!shown.length && <div className="empty-state">ไม่พบหัวข้อที่ค้นหา ลองค้นหาด้วยคำอื่น</div>}
      <section className="quick-section"><div className="quick-copy"><div className="eyebrow dark"><span></span> QUICK START</div><h2>เริ่มต้นใช้งานใน<br/><strong>3 ขั้นตอน</strong></h2><p>ตั้งค่าแอปให้พร้อม แล้วเริ่มติดตามรถของคุณได้เลย</p><button className="primary-button" onClick={() => setSelected(sections[0])}>ดูคู่มือเริ่มต้น <ArrowRight size={18}/></button></div><div className="quick-steps">{["ดาวน์โหลดและเข้าสู่ระบบ", "เลือกยานพาหนะที่ต้องการ", "เริ่มติดตามแบบเรียลไทม์"].map((x,i) => <div className="quick-step" key={x}><span>0{i+1}</span><div><b>{x}</b><p>{i === 0 ? "ใช้ข้อมูลบัญชีที่ได้รับจากทีม Andaman" : i === 1 ? "แตะการ์ดรถเพื่อดูรายละเอียดและสถานะ" : "ดูตำแหน่ง ความเร็ว และข้อมูลสำคัญบนแผนที่"}</p></div></div>)}</div></section><section className="contact-strip" id="contact"><div><ShieldCheck size={25}/><span><b>ทีม Andaman GPS พร้อมช่วยเหลือ</b><small>หากคุณมีคำถามเกี่ยวกับการใช้งาน</small></span></div><a href="tel:076521122">ติดต่อเรา <ArrowRight size={17}/></a></section></main>
    {selected && <GuideDialog item={selected} onClose={() => setSelected(null)} image={imagesById[selected.id] || MapImage} stepImages={selected.id === "vehicle" ? vehicleStepImages : selected.id === "map" ? mapStepImages : selected.id === "mdvr" ? mdvrStepImages : selected.id === "history" ? historyStepImages : selected.id === "geofence" ? geofenceStepImages : undefined} videoUrl={content.videoUrl}/>} {videoOpen && <VideoDialog onClose={() => setVideoOpen(false)} videoUrl={content.videoUrl || TutorialVideo}/>}</div>;
}
function VideoDialog({ onClose, videoUrl }: { onClose: () => void; videoUrl: string }) {
  const driveId = videoUrl.match(/drive\.google\.com\/file\/d\/([^/?]+)/)?.[1]; const embedUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : videoUrl;
  return <div className="guide-overlay video-overlay" role="dialog" aria-modal="true" aria-label="วิดีโอแนะนำ"><div className="video-dialog"><button className="close-guide" onClick={onClose} aria-label="ปิดวิดีโอ"><X size={20}/></button><iframe src={embedUrl} title="วิดีโอแนะนำ" allow="autoplay; fullscreen" allowFullScreen/></div></div>;
}
function GuideDialog({ item, onClose, image, stepImages, videoUrl }: { item: ManualSection; onClose: () => void; image: string; stepImages?: string[]; videoUrl?: string }) {
  if (item.id === "card-info") return <CardInfoGuide item={item} onClose={onClose}/>;
  return <StandardGuideDialog item={item} onClose={onClose} image={image} stepImages={stepImages} videoUrl={videoUrl}/>;
}
function StandardGuideDialog({ item, onClose, image, stepImages, videoUrl }: { item: ManualSection; onClose: () => void; image: string; stepImages?: string[]; videoUrl?: string }) {
  const [step, setStep] = useState(0);
  const activeImage = stepImages?.[step] || image;
  return <div className="guide-overlay" role="dialog" aria-modal="true"><div className="guide-dialog"><button className="close-guide" onClick={onClose}><X size={20}/></button><div className="guide-media">{videoUrl ? <video controls src={videoUrl} poster={activeImage}/> : <img src={activeImage} alt={`${item.title} — ขั้นตอน ${step + 1}`}/>}<span className="guide-count">ขั้นตอน {step + 1} / {item.steps.length}</span></div><div className="guide-body"><div className="card-label">{item.category}</div><h2>{item.title}</h2><p>{item.summary}</p><ol>{item.steps.map((s,i) => <li className={i === step ? "current" : ""} key={s} onClick={() => setStep(i)}><span>{i + 1}</span><span className="step-copy">{s}</span>{stepImages?.[i] && <img className="step-thumbnail" src={stepImages[i]} alt=""/>}</li>)}</ol><div className="guide-footer"><button className="soft-button" disabled={step === 0} onClick={() => setStep(step - 1)}>ย้อนกลับ</button>{step < item.steps.length - 1 ? <button className="primary-button" onClick={() => setStep(step + 1)}>ขั้นตอนถัดไป <ArrowRight size={17}/></button> : <button className="primary-button" onClick={onClose}>เสร็จสิ้น</button>}</div></div></div></div>;
}
function CardInfoGuide({ item, onClose }: { item: ManualSection; onClose: () => void }) {
  const infoItems = [
    { image: CardVehicleTypeImage, title: "รถและทะเบียน", description: "ไอคอนชนิดรถและชื่อทะเบียน ระบุยานพาหนะที่กำลังแสดงอยู่" },
    { image: CardStatusTimeImage, title: "สถานะและระยะเวลา", description: "ป้ายสี เช่น Move หรือ Stop บอกสถานะปัจจุบันและระยะเวลาที่อยู่ในสถานะนั้น" },
    { image: CardUpdateTimeImage, title: "เวลาอัปเดต", description: "แสดงเวลาที่ระบบได้รับข้อมูลล่าสุดจากอุปกรณ์ของรถ" },
    { image: CardSpeedImage, title: "ความเร็ว", description: "แสดงความเร็วปัจจุบันของรถเป็นกิโลเมตรต่อชั่วโมง" },
    { image: CardDistanceImage, title: "ระยะทางวันนี้", description: "แสดงระยะทางที่รถวิ่งสะสมในวันปัจจุบัน" },
    { image: CardTemperatureImage, title: "อุณหภูมิ", description: "แสดงอุณหภูมิที่วัดได้จากเซนเซอร์ของรถ" },
    { image: CardFuelImage, title: "เชื้อเพลิง", description: "แสดงสถานะหรือข้อมูลเชื้อเพลิงจากอุปกรณ์ที่ติดตั้ง" },
    { image: CardHumidityImage, title: "ความชื้น", description: "แสดงค่าความชื้นจากเซนเซอร์ เมื่อรถมีอุปกรณ์รองรับ" },
    { image: CardCompressorImage, title: "คอมเพรสเซอร์", description: "แสดงสถานะการทำงานของคอมเพรสเซอร์หรืออุปกรณ์เสริม" },
    { image: CardMdvrImage, title: "กล้อง MDVR", description: "แสดงสถานะการเชื่อมต่อของกล้องบันทึกภาพในรถ เมื่อมีการติดตั้งอุปกรณ์รองรับ" },
    { image: CardDriverImage, title: "ผู้ขับขี่", description: "แสดงข้อมูลผู้ขับขี่จากบัตรหรือระบบระบุตัวตน" },
    { image: CardLocationImage, title: "ตำแหน่งล่าสุด", description: "แสดงตำแหน่งหรือชื่อพื้นที่ล่าสุดที่รถอยู่" },
    { image: CardActionsImage, title: "คำสั่งด่วน", description: "ใช้เปิดคำสั่งเพิ่มเติมสำหรับรถจากปุ่มการดำเนินการ" },
  ];
  return <div className="guide-overlay" role="dialog" aria-modal="true"><div className="guide-dialog card-info-dialog"><button className="close-guide" onClick={onClose}><X size={20}/></button><div className="card-info-body"><div className="card-label">{item.category}</div><h2>{item.title}</h2><p>{item.summary}</p><div className="icon-legend-grid">{infoItems.map(({ image, title, description }) => <article className="icon-legend-card" key={title}><div className="legend-image"><img src={image} alt={title}/></div><div><h3>{title}</h3><p>{description}</p></div></article>)}</div><div className="guide-footer"><span></span><button className="primary-button" onClick={onClose}>เข้าใจแล้ว</button></div></div></div></div>;
}
