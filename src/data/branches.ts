import PhuketBranchPhoto from "../assets/images/branches/ภูเก็ต.png";
import KoratBranchPhoto from "../assets/images/branches/โคราช.png";

export type BranchRegion = "south" | "central" | "north" | "northeast";

export type Branch = {
  id: string;
  name: string;
  region: BranchRegion;
  address: string;
  phone: string;
  contact?: string;
  photo?: string;
  lat: number;
  lng: number;
  query?: string;
  hq?: boolean;
};

// Sourced from “Andaman GPS – แผนที่ 3D 11 สาขา.html”.
export const branches: Branch[] = [
  {
    id: "phuket",
    name: "ภูเก็ต",
    region: "south",
    hq: true,
    lat: 7.991296038,
    lng: 98.34514081,
    address:
      "55/137 หมู่บ้านสมบูรณ์ทรัพย์ วิลเลจ หมู่ 8 ตำบลศรีสุนทร อำเภอถลาง จังหวัดภูเก็ต 83110",
    phone: "087-564-9796",
    photo: PhuketBranchPhoto,
  },
  {
    id: "surat",
    name: "สุราษฎร์ธานี",
    region: "south",
    lat: 9.084306915,
    lng: 99.32309558,
    address:
      "31/133 โครงการบ้านนานนท์โฮม ซอยพ่อขุนทะเล 23 หมู่ 3 ต.มะขามเตี้ย อ.เมือง จ.สุราษฎร์ธานี 84000",
    phone: "080-940-4597",
  },
  {
    id: "nakhonsi",
    name: "นครศรีธรรมราช",
    region: "south",
    lat: 8.460050463,
    lng: 99.92031876,
    address: "เลขที่ 95/20 ตำบลนาเคียน อำเภอเมืองนครศรีธรรมราช จังหวัดนครศรีธรรมราช 80000",
    phone: "062-2450981",
  },
  {
    id: "phatthalung",
    name: "พัทลุง",
    region: "south",
    lat: 7.424905343,
    lng: 100.1682519,
    address: "บ้านเลขที่ 809/2 หมู่ที่ 6 ตำบลท่ามะเดื่อ อำเภอบางแก้ว จังหวัดพัทลุง 93140",
    phone: "080-9404596",
  },
  {
    id: "songkhla",
    name: "สงขลา",
    region: "south",
    lat: 7.179582559,
    lng: 100.6229701,
    address: "13/10 หมู่ที่ 3 ตำบลเขารูปช้าง อำเภอเมือง จังหวัดสงขลา 90000",
    phone: "062-9414468",
    contact: "นายวิชา ธานี",
  },
  {
    id: "bangkok",
    name: "กรุงเทพมหานคร",
    region: "central",
    lat: 13.96,
    lng: 100.33,
    address:
      "68/158 เดอะคัลเลอร์พรีเมี่ยม กาญจนาภิเษก-ราชพฤกษ์ 3 หมู่ที่ 6 ตำบลไทรน้อย อำเภอไทรน้อย จังหวัดนนทบุรี 11150",
    phone: "064-5505416",
    query: "เดอะคัลเลอร์ส กาญจนาภิเษก-ราชพฤกษ์ 3 ไทรน้อย นนทบุรี",
  },
  {
    id: "phitsanulok",
    name: "พิษณุโลก",
    region: "north",
    lat: 16.77702178,
    lng: 100.2015862,
    address: "บ้านเลขที่ 5 หมู่ที่ 4 ตำบลท่าทอง อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก 65000",
    phone: "091-013-4739",
    contact: "ช่างโจ",
  },
  {
    id: "nongkhai",
    name: "หนองคาย",
    region: "northeast",
    lat: 17.84791201,
    lng: 102.7253863,
    address:
      "หมู่บ้านเอสบีลากูน บ้านเลขที่ 309/38 หมู่ 2 ตำบลหนองกอมเกาะ อำเภอเมือง จังหวัดหนองคาย 43000",
    phone: "084-1509430",
  },
  {
    id: "udonthani",
    name: "อุดรธานี",
    region: "northeast",
    lat: 17.348881243474,
    lng: 102.81699044345,
    address:
      "โนโววิลล์ อุดรธานี 599/87 บ้านจั่น ตำบลบ้านจั่น อำเภอเมืองอุดรธานี จังหวัดอุดรธานี 41000",
    phone: "098-6293453",
  },
  {
    id: "ubon",
    name: "อุบลราชธานี",
    region: "northeast",
    lat: 15.29302217,
    lng: 104.8864176,
    address:
      "หมู่บ้านอรุณโฮม (ข้างทีโอที) เลขที่ 555/27 หมู่ที่ 16 ตำบลไร่น้อย อำเภอเมือง จังหวัดอุบลราชธานี 34000",
    phone: "063-4120097",
  },
  {
    id: "korat",
    name: "นครราชสีมา",
    region: "northeast",
    lat: 14.9466136,
    lng: 102.0567008,
    address:
      "โครงการหมู่บ้านดิเอ็มไพร์ บ้านเลขที่ 444/20 ม.4 ตำบลปรุใหญ่ อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา 30000",
    phone: "094-2155873",
    photo: KoratBranchPhoto,
  },
];

export const regionLabels: Record<BranchRegion, string> = {
  south: "ภาคใต้",
  central: "ภาคกลาง",
  north: "ภาคเหนือ",
  northeast: "ภาคตะวันออกเฉียงเหนือ",
};

export const branchMapUrl = (branch: Branch) => {
  const destination = branch.query || `${branch.lat},${branch.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
};
