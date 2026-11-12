import { createFileRoute, Link } from "@tanstack/react-router";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ImageUp,
  Palette,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import {
  applyCompanyTheme,
  downloadCompanyManuals,
  getCompanyManuals,
  getManualContent,
  normalizeCompanyId,
  saveManualContent,
  type CompanyManual,
  type CompanyTheme,
  type ManualSection,
} from "../lib/manual-content";

export const Route = createFileRoute("/admin")({ component: Admin });

const colorFields: {
  key: keyof Pick<
    CompanyTheme,
    | "primaryColor"
    | "secondaryColor"
    | "accentColor"
    | "backgroundColor"
    | "surfaceColor"
    | "textColor"
    | "mutedTextColor"
    | "borderColor"
    | "successColor"
    | "dangerColor"
    | "iconColor"
  >;
  label: string;
}[] = [
  { key: "primaryColor", label: "สีหลัก" },
  { key: "secondaryColor", label: "สีรอง / พื้นหลัง Hero" },
  { key: "accentColor", label: "สีเน้นอ่อน" },
  { key: "backgroundColor", label: "สีพื้นหลังเว็บ" },
  { key: "surfaceColor", label: "สีพื้นผิวการ์ด" },
  { key: "textColor", label: "สีฟอนต์หลัก" },
  { key: "mutedTextColor", label: "สีฟอนต์รอง" },
  { key: "iconColor", label: "สีไอคอน" },
  { key: "borderColor", label: "สีเส้นขอบ" },
  { key: "successColor", label: "สีสถานะสำเร็จ" },
  { key: "dangerColor", label: "สีแจ้งเตือน" },
];

function Admin() {
  const [companies, setCompanies] = useState<CompanyManual[]>(getCompanyManuals);
  const [form, setForm] = useState<CompanyManual>(getManualContent);
  const [saved, setSaved] = useState(false);
  const [openId, setOpenId] = useState(form.sections[0]?.id);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  useEffect(() => applyCompanyTheme(form.theme), [form.theme]);
  const update = (
    key: Exclude<keyof CompanyManual, "sections" | "theme" | "companyId">,
    value: string,
  ) => setForm((f) => ({ ...f, [key]: value }));
  const updateTheme = (key: keyof CompanyTheme, value: string) =>
    setForm((f) => ({ ...f, theme: { ...f.theme, [key]: value } }));
  const upload =
    (key: "coverImage" | "mockupImage" | "videoUrl" | "appIcon") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        const value = URL.createObjectURL(file);
        update(key, value);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const value = String(reader.result);
        key === "appIcon" ? updateTheme("appIcon", value) : update(key, value);
      };
      reader.readAsDataURL(file);
    };
  const updateSection = (id: string, changes: Partial<ManualSection>) =>
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) => (s.id === id ? { ...s, ...changes } : s)),
    }));
  const updateStep = (id: string, stepIndex: number, value: string) => {
    const current = form.sections.find((s) => s.id === id);
    if (current)
      updateSection(id, {
        steps: current.steps.map((step, i) => (i === stepIndex ? value : step)),
      });
  };
  const addStep = (id: string) => {
    const current = form.sections.find((s) => s.id === id);
    if (current) updateSection(id, { steps: [...current.steps, "ขั้นตอนใหม่"] });
  };
  const removeStep = (id: string, stepIndex: number) => {
    const current = form.sections.find((s) => s.id === id);
    if (current && current.steps.length > 1)
      updateSection(id, { steps: current.steps.filter((_, i) => i !== stepIndex) });
  };
  const selectCompany = (companyId: string) => {
    const company = companies.find((item) => item.companyId === companyId);
    if (company) {
      setForm(company);
      window.history.replaceState(null, "", `/admin?company=${encodeURIComponent(companyId)}`);
    }
  };
  const addCompany = () => {
    const companyId = normalizeCompanyId(newCompanyId || newCompanyName);
    if (!newCompanyName.trim() || companies.some((company) => company.companyId === companyId))
      return;
    const company: CompanyManual = {
      ...form,
      companyId,
      theme: {
        ...form.theme,
        companyName: newCompanyName.trim(),
        appName: newCompanyName.trim(),
        webTitle: `${newCompanyName.trim()} | คู่มือการใช้งาน`,
      },
      sections: form.sections.map((section) => ({ ...section, steps: [...section.steps] })),
    };
    saveManualContent(company);
    setCompanies((items) => [...items, company]);
    setForm(company);
    setNewCompanyName("");
    setNewCompanyId("");
    window.history.replaceState(null, "", `/admin?company=${encodeURIComponent(companyId)}`);
  };
  const submit = () => {
    const updatedCompanies = companies.map((company) =>
      company.companyId === form.companyId ? form : company,
    );
    downloadCompanyManuals(updatedCompanies);
    setCompanies(updatedCompanies);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> กลับสู่คู่มือ
        </Link>
        <div className="admin-brand">
          {form.theme.companyName} <span>CONTENT STUDIO</span>
        </div>
        <button onClick={submit} className="primary-button">
          <Save size={17} /> ดาวน์โหลด companies.json
        </button>
      </header>
      <main className="admin-main">
        <div className="admin-intro">
          <div>
            <p className="eyebrow dark">
              <span></span> ADMINISTRATION
            </p>
            <h1>จัดการเนื้อหาคู่มือ</h1>
            <p>แก้ไขแบรนด์ สี และเนื้อหาที่แสดงบนเว็บไซต์</p>
          </div>
          {saved && (
            <div className="saved-toast">
              <Check size={18} /> ดาวน์โหลด companies.json แล้ว
            </div>
          )}
        </div>
        <section className="company-switcher">
          <div>
            <b>บริษัทที่กำลังแก้ไข</b>
            <small>
              ลิงก์ใช้งาน: <code>?company={form.companyId}</code>
            </small>
          </div>
          <select value={form.companyId} onChange={(e) => selectCompany(e.target.value)}>
            {companies.map((company) => (
              <option key={company.companyId} value={company.companyId}>
                {company.theme.companyName} ({company.companyId})
              </option>
            ))}
          </select>
          <input
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="ชื่อบริษัทใหม่"
          />
          <input
            value={newCompanyId}
            onChange={(e) => setNewCompanyId(e.target.value)}
            placeholder="รหัสบริษัท (ไม่บังคับ)"
          />
          <button type="button" className="add-company" onClick={addCompany}>
            <Plus size={16} /> เพิ่มบริษัท
          </button>
        </section>
        <div className="admin-layout">
          <section className="editor-card">
            <div className="editor-heading">
              <span>01</span>
              <div>
                <h2>ชื่อและตัวตนบริษัท</h2>
                <p>ชื่อที่ใช้ในเว็บ ไอคอนแอป และชื่อบนแท็บเบราว์เซอร์</p>
              </div>
            </div>
            <label>
              ชื่อบริษัท
              <input
                value={form.theme.companyName}
                onChange={(e) => updateTheme("companyName", e.target.value)}
              />
            </label>
            <label>
              ชื่อแอป
              <input
                value={form.theme.appName}
                onChange={(e) => updateTheme("appName", e.target.value)}
              />
            </label>
            <label>
              Web title
              <input
                value={form.theme.webTitle}
                onChange={(e) => updateTheme("webTitle", e.target.value)}
              />
            </label>
            <MediaControl
              icon={<ImageUp size={21} />}
              title="App icon / โลโก้"
              accept="image/*"
              value={form.theme.appIcon}
              onChange={(v) => updateTheme("appIcon", v)}
              onUpload={upload("appIcon")}
            />
            <div className="editor-heading sections-heading">
              <span>
                <Palette size={15} />
              </span>
              <div>
                <h2>สีของธีม</h2>
                <p>สีทุกส่วนหลักของหน้าเว็บและหน้าผู้ดูแลระบบ</p>
              </div>
            </div>
            <div className="theme-color-grid">
              {colorFields.map(({ key, label }) => (
                <ColorControl
                  key={key}
                  label={label}
                  value={form.theme[key]}
                  onChange={(value) => updateTheme(key, value)}
                />
              ))}
            </div>
            <div className="editor-heading sections-heading">
              <span>02</span>
              <div>
                <h2>เนื้อหาหน้าแรก</h2>
                <p>ข้อความที่แสดงในส่วนแนะนำ</p>
              </div>
            </div>
            <label>
              หัวข้อหลัก
              <input value={form.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
            </label>
            <label>
              คำอธิบาย
              <textarea
                rows={4}
                value={form.heroSubtitle}
                onChange={(e) => update("heroSubtitle", e.target.value)}
              />
            </label>
            <div className="editor-heading">
              <span>03</span>
              <div>
                <h2>สื่อประกอบ</h2>
                <p>อัปโหลดจากเครื่อง หรือวางลิงก์ไฟล์</p>
              </div>
            </div>
            <MediaControl
              icon={<ImageUp size={21} />}
              title="iPhone mockup บน Cover"
              accept="image/*"
              value={form.mockupImage}
              onChange={(v) => update("mockupImage", v)}
              onUpload={upload("mockupImage")}
            />
            <MediaControl
              icon={<ImageUp size={21} />}
              title="ภาพหน้าปก / ตัวอย่าง"
              accept="image/*"
              value={form.coverImage}
              onChange={(v) => update("coverImage", v)}
              onUpload={upload("coverImage")}
            />
            <MediaControl
              icon={<Video size={21} />}
              title="วิดีโอแนะนำ"
              accept="video/*"
              value={form.videoUrl}
              onChange={(v) => update("videoUrl", v)}
              onUpload={upload("videoUrl")}
            />
            <div className="editor-heading sections-heading">
              <span>04</span>
              <div>
                <h2>หัวข้อคู่มือทั้งหมด</h2>
                <p>แก้ไขหมวด ชื่อ รายละเอียด และขั้นตอนของทุกฟีเจอร์</p>
              </div>
            </div>
            <div className="section-editor-list">
              {form.sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  isOpen={openId === section.id}
                  onToggle={() => setOpenId(openId === section.id ? "" : section.id)}
                  onUpdate={(changes) => updateSection(section.id, changes)}
                  onStepChange={(step, value) => updateStep(section.id, step, value)}
                  onAddStep={() => addStep(section.id)}
                  onRemoveStep={(step) => removeStep(section.id, step)}
                />
              ))}
            </div>
          </section>
          <aside className="preview-card">
            <div className="preview-label">LIVE PREVIEW</div>
            <div className="mini-site">
              <div className="mini-nav">{form.theme.companyName}</div>
              <div className="mini-hero">
                {(form.mockupImage || form.coverImage) && (
                  <img src={form.mockupImage || form.coverImage} alt="preview" />
                )}
                <small>{form.theme.appName}</small>
                <h3>{form.heroTitle || form.theme.appName}</h3>
                <p>{form.heroSubtitle || "รายละเอียดคู่มือ"}</p>
                <button>เริ่มดูคู่มือ</button>
              </div>
            </div>
            <p>
              ดาวน์โหลดไฟล์ แล้วแทนที่ <code>src/data/companies.json</code> ก่อน deploy
              เพื่อให้ทุกคนเห็นข้อมูลเดียวกัน
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="color-control">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} รหัสสี`}
      />
    </label>
  );
}
function SectionEditor({
  section,
  index,
  isOpen,
  onToggle,
  onUpdate,
  onStepChange,
  onAddStep,
  onRemoveStep,
}: {
  section: ManualSection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (changes: Partial<ManualSection>) => void;
  onStepChange: (index: number, value: string) => void;
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
}) {
  return (
    <div className={`section-editor ${isOpen ? "open" : ""}`}>
      <button className="section-editor-title" onClick={onToggle}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <b>{section.title}</b>
          <small>
            {section.category} · {section.steps.length} ขั้นตอน
          </small>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="section-editor-body">
          <label>
            หมวดหมู่
            <input
              value={section.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
            />
          </label>
          <label>
            ชื่อหัวข้อ
            <input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </label>
          <label>
            คำอธิบาย
            <textarea
              rows={3}
              value={section.summary}
              onChange={(e) => onUpdate({ summary: e.target.value })}
            />
          </label>
          <div className="steps-label">ขั้นตอนการใช้งาน</div>
          {section.steps.map((step, stepIndex) => (
            <div className="step-edit" key={`${section.id}-${stepIndex}`}>
              <span>{stepIndex + 1}</span>
              <input value={step} onChange={(e) => onStepChange(stepIndex, e.target.value)} />
              <button
                onClick={() => onRemoveStep(stepIndex)}
                disabled={section.steps.length === 1}
                aria-label="ลบขั้นตอน"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button className="add-step" onClick={onAddStep}>
            <Plus size={15} /> เพิ่มขั้นตอน
          </button>
        </div>
      )}
    </div>
  );
}
function MediaControl({
  icon,
  title,
  accept,
  value,
  onChange,
  onUpload,
}: {
  icon: React.ReactNode;
  title: string;
  accept: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="media-control">
      <div className="media-icon">{icon}</div>
      <div>
        <b>{title}</b>
        <small>รองรับไฟล์จากอุปกรณ์ของคุณ</small>
      </div>
      <label className="upload-button">
        อัปโหลด
        <input type="file" accept={accept} onChange={onUpload} />
      </label>
      <input
        className="url-field"
        placeholder="หรือวาง URL ที่นี่"
        value={value.startsWith("blob:") ? "อัปโหลดแล้ว (แสดงผลในเซสชันนี้)" : value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
