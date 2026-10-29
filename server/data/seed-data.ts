export interface SeedCategory {
  id: number
  name: string
  slug: string
  parentId: number | null
  sortOrder: number
  description: string
}

export interface SeedProduct {
  id: number
  slug: string
  legacySlug?: string
  name: string
  brand: string
  excerpt: string
  description: string
  image: string
  datasheetUrl?: string
  categoryIds: number[]
  isActive: number
}

export interface SeedService {
  id: number
  slug: string
  legacySlug?: string
  type: 'equipment' | 'service'
  title: string
  excerpt: string
  content: string
  image: string
  sortOrder: number
}

export interface SeedPost {
  id: number
  slug: string
  legacySlug?: string
  type: 'portfolio' | 'news'
  title: string
  excerpt: string
  content: string
  image: string
  gallery: string[]
  publishedAt: string
}

export const SEED_SETTINGS: Record<string, string> = {
  siteName: 'Firezone',
  companyName: 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
  companyTagline: 'จัดจำหน่ายอุปกรณ์พร้อมติดตั้งระบบสัญญาณเตือนอัคคีภัย FIRE ALARM และรับแจ้งเหตุผ่านมือถือ',
  address: '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร กทม. 10900',
  phone1: '086-363-5495',
  phone2: '086-449-2598',
  phone3: '086-954-1974',
  officePhone: '02-197-5275',
  email: 'fire_zone@hotmail.com',
  lineId: '0864492598',
  lineUrl: 'https://line.me/ti/p/RBiGzfFotR',
  lineQrImage: 'https://fireszone.com/wp-content/uploads/2021/01/qrcode.png',
  facebookUrl: 'https://www.facebook.com/FIRESZONE/',
  logoHeader: '/logosticky-fireszone-2.png',
  logoSticky: '/logosticky-fireszone-2.png',
  logoFooter: '/logofooter-firesone.png',
  aboutImage: 'https://fireszone.com/wp-content/uploads/2021/01/bg-homeaboutus.png',
  whyChooseImage: 'https://fireszone.com/wp-content/uploads/2021/01/bg-homefireszone3.png',
  aboutIntro:
    'โดยที่เรามีช่างผู้เชี่ยวชาญด้านระบบไฟอรามโดยเฉพาะ เราจึงจัดจำหน่ายอุปกรณ์ไฟอราม และกล้องวงจรปิด และเน้นให้คำปรึกษาเฉพาะทาง เน้นงานบริการเข้าถึง ลูกค้าได้งาน ไม่คิดราคาเกินจริง พร้อมถึงเซอร์วิสหลังการขาย และการรับประกันจากแบรนด์ชั้นนำต่างๆ',
  statFireAlarmCount: '856',
  statFireAlarmLabel: 'โปรเจค ระบบไฟอราม',
  statCctvCount: '165',
  statCctvLabel: 'โปรเจค ระบบกล้องวงจรปิด',
  statMatvCount: '93',
  statMatvLabel: 'โปรเจค ระบบเอ็มเอทีวี',
  googleMapsEmbed:
    'https://maps.google.com/maps?q=678/6%20%E0%B8%8B%E0%B8%AD%E0%B8%A2%E0%B8%9E%E0%B8%AB%E0%B8%A5%E0%B9%82%E0%B8%A2%E0%B8%98%E0%B8%B4%E0%B8%99%2032%20%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%A1%20%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%88%E0%B8%95%E0%B8%B8%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A3%20%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E&t=&z=15&ie=UTF8&iwloc=&output=embed',
  // SEO & ASEO (AI Search Optimization)
  siteUrl: 'https://fireszone.com',
  seoDefaultTitle: 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด | ระบบสัญญาณเตือนอัคคีภัย Fire Alarm ครบวงจร',
  seoDefaultDescription:
    'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด ตัวแทนจำหน่าย ออกแบบ ติดตั้ง ตรวจเช็ค และบำรุงรักษาระบบสัญญาณเตือนอัคคีภัย (Fire Alarm System) มาตรฐาน UL/FM กล้องวงจรปิด CCTV ระบบทีวีดิจิตอล MATV และระบบแจ้งเตือนไฟไหม้ผ่าน LINE & Email',
  seoKeywords:
    'Fire Alarm, ระบบสัญญาณเตือนอัคคีภัย, ตู้ควบคุมไฟอราม, Smoke Detector, Heat Detector, Notifier, Nohmi, System Sensor, ติดตั้งไฟอราม, ตรวจเช็คระบบไฟอราม, แจ้งเตือนไฟไหม้ผ่าน Line',
  seoOgImage: '/logo-fz.jpg',
  googleSiteVerification: '',
  // Analytics & Tag Injection
  gaMeasurementId: '',
  gtmContainerId: '',
  metaPixelId: '',
  lineTagId: '',
  customHeadScripts: '',
  customBodyStartScripts: '',
  customBodyEndScripts: '',
  // PDPA Compliance
  pdpaEnabled: '1',
  pdpaBannerText:
    'เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งาน วิเคราะห์สถิติการเข้าชม และปรับปรุงการให้บริการตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
  pdpaDpoEmail: 'fire_zone@hotmail.com',
  pdpaRetentionDays: '365',
  // LINE Login & LINE OA / Email Notification Settings
  lineOaBasicId: '',
  lineLoginChannelId: '',
  lineLoginChannelSecret: '',
  lineChannelAccessToken: '',
  lineNotifyTargetId: '',
  smtpHost: '',
  smtpPort: '587',
  smtpSecure: '0',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  notifyEmailTo: 'fire_zone@hotmail.com',
  turnstileSiteKey: '',
  turnstileSecretKey: '',
  heroSlidesJson: JSON.stringify([
    {
      id: 1,
      subtitle: 'จำหน่ายอุปกรณ์ ไฟอราม',
      title: 'ระบบสัญญาณเตือนอัคคีภัย',
      description: 'หรือติดตั้งพร้อมช่างผู้เชี่ยวชาญเฉพาะทาง ยินดีให้คำปรึกษา ฟรี',
      buttonText: 'คลิกรายละเอียด',
      buttonLink: '/shop',
      image: 'https://fireszone.com/wp-content/uploads/2021/01/banner1.png'
    },
    {
      id: 2,
      subtitle: 'จำหน่ายอุปกรณ์ ไฟอราม',
      title: 'ระบบแจ้งเตือน Alarm ผ่าน Line',
      description: 'และระบบแจ้งเตือนผ่าน E-mail รู้เหตุทันท่วงทีผ่านมือถือ ยินดีให้คำปรึกษา ฟรี',
      buttonText: 'คลิกรายละเอียด',
      buttonLink: '/service/line-alarm-development',
      image: 'https://fireszone.com/wp-content/uploads/2021/02/Banner-2.jpg'
    },
    {
      id: 3,
      subtitle: 'ตัวแทนจำหน่ายโดยตรง',
      title: 'อุปกรณ์ Fire Alarm มาตรฐาน UL / FM',
      description: 'Notifier, Nohmi, System Sensor, Cemen, CL, AIP, BGM ราคาไม่สูงเกินจริง',
      buttonText: 'ดูสินค้าทั้งหมด',
      buttonLink: '/shop',
      image: 'https://fireszone.com/wp-content/uploads/2021/02/Banner-3.jpg'
    },
    {
      id: 4,
      subtitle: 'บริการครบวงจร ประสบการณ์กว่า 20 ปี',
      title: 'ติดตั้ง ตรวจเช็ค และทดสอบระบบไฟอราม',
      description: 'พร้อมทีมช่างชำนาญงานเฉพาะทาง บริการหลังการขายและการรับประกันครบถ้วน',
      buttonText: 'ติดต่อเรา',
      buttonLink: '/contact',
      image: 'https://fireszone.com/wp-content/uploads/2021/02/Banner-4-2.jpg'
    }
  ]),
  brandsJson: JSON.stringify([
    { name: 'EDWARDS', slug: 'edwards', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-edwards.png' },
    { name: 'NOTIFIER', slug: 'notifier', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-notifier.png' },
    { name: 'NOHMI', slug: 'nohmi', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-nohmi.png' },
    { name: 'SYSTEM SENSOR', slug: 'smoke-detectors', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-systemsensor.png' },
    { name: 'CEMEN', slug: 'cemen', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-cemen.png' },
    { name: 'AIP', slug: 'aip', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-aip.png' },
    { name: 'BGM', slug: 'explosion-proof', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-bgm.png' },
    { name: 'CL', slug: 'control-panels', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-cl.png' },
    { name: 'CM', slug: 'smoke-detectors', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-cm.png' },
    { name: 'COMMAX', slug: 'accessories', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-commax.png' },
    { name: 'FIREMAN', slug: 'accessories', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-fireman.png' },
    { name: 'MAX', slug: 'accessories', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-max.png' }
  ]),
  clientsJson: JSON.stringify([
    { name: 'Porsche', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-porsche.png' },
    { name: 'Italthai', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-italthai.png' },
    { name: 'บ้านร้อยสาน', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-baanroisarn.png' },
    { name: 'Mitsubishi', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-mitsubishi.png' },
    { name: 'Texas Chicken', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-texas.png' },
    { name: 'มหาวิทยาลัยธรรมศาสตร์', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-thammasat.png' },
    { name: 'มหาวิทยาลัยเกษตรศาสตร์', logo: 'https://fireszone.com/wp-content/uploads/2021/01/logo-kaset.png' }
  ])
}

export const SEED_CATEGORIES: SeedCategory[] = [
  { id: 67, name: 'ตู้ควบคุม', slug: 'control-panels', parentId: null, sortOrder: 1, description: 'ตู้ควบคุมระบบสัญญาณแจ้งเหตุเพลิงไหม้ (Fire Alarm Control Panel)' },
  { id: 76, name: 'NOTIFIER', slug: 'notifier', parentId: 67, sortOrder: 2, description: 'ตู้ควบคุมระบบไฟอรามแบรนด์ NOTIFIER by Honeywell มาตรฐาน UL/FM' },
  { id: 77, name: 'NOHMI', slug: 'nohmi', parentId: 67, sortOrder: 3, description: 'ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้แบรนด์ NOHMI ประเทศญี่ปุ่น' },
  { id: 78, name: 'CEMEN', slug: 'cemen', parentId: 67, sortOrder: 4, description: 'ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้แบรนด์ CEMEN' },
  { id: 89, name: 'AIP', slug: 'aip', parentId: 67, sortOrder: 5, description: 'ตู้ควบคุมระบบสัญญาณเตือนอัคคีภัยแบรนด์ AIP' },
  { id: 117, name: 'EDWARDS', slug: 'edwards', parentId: 67, sortOrder: 6, description: 'ตู้ควบคุมและอุปกรณ์แจ้งเหตุเพลิงไหม้แบรนด์ EDWARDS (EST)' },
  { id: 68, name: 'อุปกรณ์ตรวจจับควันไฟ', slug: 'smoke-detectors', parentId: null, sortOrder: 7, description: 'อุปกรณ์ตรวจจับควันไฟ (Smoke Detector / Beam Detector)' },
  { id: 69, name: 'อุปกรณ์ตรวจจับความร้อน', slug: 'heat-detectors', parentId: null, sortOrder: 8, description: 'อุปกรณ์ตรวจจับความร้อน (Heat Detector แบบ Fixed Temp และ Rate-of-Rise)' },
  { id: 70, name: 'อุปกรณ์สัญญาณแจ้งเตือน', slug: 'notification-appliances', parentId: null, sortOrder: 9, description: 'กระดิ่งไซเรนและไฟกระพริบแจ้งเหตุเพลิงไหม้ (Alarm Bell / Horn Strobe)' },
  { id: 71, name: 'อุปกรณ์แจ้งเหตุด้วยมือ', slug: 'manual-pull-stations', parentId: null, sortOrder: 10, description: 'อุปกรณ์ดึงหรือกดแจ้งเหตุเพลิงไหม้ด้วยมือ (Manual Pull Station / Call Point)' },
  { id: 72, name: 'อุปกรณ์เสริม', slug: 'accessories', parentId: null, sortOrder: 11, description: 'โมดูลขยายโซน โทรศัพท์นักดับเพลิง และอุปกรณ์เสริมระบบ Fire Alarm' },
  { id: 90, name: 'อุปกรณ์กันระเบิด', slug: 'explosion-proof', parentId: null, sortOrder: 12, description: 'อุปกรณ์แจ้งเหตุเพลิงไหม้ชนิดป้องกันการระเบิด (Explosion-Proof) สำหรับพื้นที่เสี่ยง' },
  { id: 118, name: 'อุปกรณ์แจ้งเตือนภัยผ่านไลน์', slug: 'line-alarm-notification', parentId: null, sortOrder: 13, description: 'ชุดพัฒนาต่อพ่วงตู้ Fire Alarm แจ้งเตือนผ่าน Line Group และ E-mail ทันที' }
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: 2104,
    slug: 'notifier-sfp-5ud-sfp-10ude',
    name: 'SFP-5UD/SFP-10UD(E)',
    brand: 'NOTIFIER',
    excerpt:
      'The SFP-5UD is a five-zone FACP (Fire Alarm Control Panel) and the SFP-10UD(E) is a ten-zone FACP. These control panels provide reliable fire signaling protection for small to medium-sized commercial, industrial, and institutional buildings. Both panels include built-in communicators for Central Station Service and remote upload/download.',
    description: `<ul>
<li>Listed to UL Standard 864, 9th edition.</li>
<li>Built-in DACT (Digital Alarm Communicator/Transmitter).</li>
<li>Style B (Class B) IDC (Initiating Device Circuit) – SFP-5UD (5 IDCs) / SFP-10UD (10 IDCs).</li>
<li>Style Y (Class B) NAC (Notification Appliance Circuit) – 4 NACs.</li>
<li>Notification Appliances programmable for Silence Inhibit and Auto-Silence.</li>
<li>Strobe Synchronization for System Sensor, Wheelock, Gentex, Faraday, or Amseco devices.</li>
<li>Selective Silence (horn-strobe mute), Temporal or Steady Signal, Silenceable or Nonsilenceable.</li>
<li>Form-C Relays for Alarm, Trouble and Supervisory – 2.0 A @ 30 VDC or 30 VAC.</li>
<li>3.0 A total system current for SFP-5UD / 7.0 A total system current for SFP-10UD.</li>
<li>24 volt operation, Low AC voltage sense, Alarm Verification, PAS (Positive Alarm Sequence).</li>
<li>Automatic battery trickle charger & up to eight ANN-BUS annunciators.</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/5zone-1.jpg',
    categoryIds: [76, 67],
    isActive: 1
  },
  {
    id: 2107,
    slug: 'notifier-nfs-320',
    name: 'NFS-320',
    brand: 'NOTIFIER',
    excerpt:
      'The NFS-320 intelligent Fire Alarm Control Panel is part of the ONYX® Series of Fire Alarm Controls from NOTIFIER. Designed with modularity and for ease of system planning, the NFS-320 can be configured for small building applications or large campus/high-rise networks.',
    description: `<ul>
<li>Listed to UL Standard 864, 9th edition.</li>
<li>One isolated intelligent Signaling Line Circuit (SLC) Style 4, 6 or 7.</li>
<li>Up to 159 detectors and 159 modules per loop (318 devices maximum).</li>
<li>Standard 80-character display with full QWERTY keypad.</li>
<li>Network option — up to 103 nodes supported using wire or fiber-optic connections.</li>
<li>6.0 amp power supply with four Class A/B built-in Notification Appliance Circuits (NAC).</li>
<li>Built-in Alarm, Trouble, and Supervisory relays.</li>
<li>VeriFire® Tools offline programming option & Walk Test reports.</li>
<li>History file with 800-event capacity in nonvolatile memory, plus separate 200-event alarm-only file.</li>
<li>Charger for up to 90 hours of standby power.</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/320.jpg',
    categoryIds: [76, 67],
    isActive: 1
  },
  {
    id: 2109,
    slug: 'notifier-nfs-640',
    name: 'NFS-640',
    brand: 'NOTIFIER',
    excerpt:
      'The NFS2-640 intelligent Fire Alarm Control Panel is part of the ONYX® Series of Fire Alarm Controls from NOTIFIER. Expandable from 1 to 2 isolated intelligent SLC loops supporting up to 636 addressable devices.',
    description: `<ul>
<li>Listed to UL Standard 864, 9th edition.</li>
<li>One, expandable to two, isolated intelligent Signaling Line Circuit (SLC) Style 4, 6 or 7.</li>
<li>Up to 159 detectors and 159 modules per SLC (318 devices per loop / 636 per FACP).</li>
<li>Standard 80-character display, 640-character large display, or display-less network node.</li>
<li>6.0 amp switch mode power supply with four Class A/B built-in NACs.</li>
<li>Selectable System Sensor, Wheelock, or Gentex strobe synchronization.</li>
<li>Built-in Alarm, Trouble, and Supervisory relays.</li>
<li>History file with 800-event capacity in nonvolatile memory + 200-event alarm-only file.</li>
<li>Full QWERTY keypad & charger for up to 200 hours of standby power.</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/1-loop.jpg',
    categoryIds: [76, 67],
    isActive: 1
  },
  {
    id: 2112,
    slug: 'notifier-rp-2002e',
    name: 'RP-2002(E)',
    brand: 'NOTIFIER',
    excerpt:
      'The RP-2002 is a six-zone FACP for single and dual hazard agent releasing applications, providing reliable fire detection, signaling and protection for commercial, industrial and institutional buildings.',
    description: `<ul>
<li>Listed to UL Standard 864, 9th edition & FM Approved.</li>
<li>Designed for agent releasing standards NFPA 12, 12A, 12B, and 2001.</li>
<li>Dual hazard operation with adjustable pre-discharge, discharge and waterflow delay timers.</li>
<li>Cross-zone (double-interlock) capability.</li>
<li>Six programmable Style B (Class B) IDCs & four programmable Style Y (Class B) output circuits.</li>
<li>Three programmable Form-C relays & 7.0 amps total 24 VDC output current.</li>
<li>80-character backlit LCD display, real-time clock/calendar, and 256-event history log.</li>
<li>ANN-BUS connector for up to 8 remote annunciator/relay/printer modules.</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/2002.jpg',
    categoryIds: [76, 67],
    isActive: 1
  },
  {
    id: 2115,
    slug: 'nohmi-fapn202-r-10l',
    legacySlug: 'fapn202-r-5l',
    name: 'FAPN202-R-10L',
    brand: 'NOHMI',
    excerpt:
      'ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้ NOHMI รุ่น FAPN202-R-10L ขนาด 10 โซน (Conventional) แสดงผลจุดเกิดเหตุแยกตามโซนชัดเจน พร้อมระบบตรวจสอบตัวเองและแบตเตอรี่สำรองไฟ',
    description: `<ul>
<li>Conventional type 10 fire zones (No programming required)</li>
<li>Alarm verification type (Alarm verification time: 60 seconds)</li>
<li>Self-diagnosis system & Misoperation inhibit function</li>
<li>Back-up Power Supply (Ni-Cd battery, 24VDC)</li>
<li>Large fire alarm symbol for easy visual recognition & durable LED indicators</li>
<li>Removable front cover for easy installation and maintenance</li>
<li>Built-in surge arrester for power lines</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FAPN202-R-5L-1.jpg',
    categoryIds: [77, 67],
    isActive: 1
  },
  {
    id: 2118,
    slug: 'nohmi-fapn202-r-5l',
    legacySlug: '2118',
    name: 'FAPN202-R-5L',
    brand: 'NOHMI',
    excerpt:
      'ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้ NOHMI รุ่น FAPN202-R-5L ขนาด 5 โซน (Conventional) ใช้งานง่าย ทนทาน มาตรฐานญี่ปุ่น พร้อมแบตเตอรี่สำรอง 24VDC ในตัว',
    description: `<ul>
<li>Conventional type 5 fire zones (No programming required)</li>
<li>Alarm verification type (Alarm verification time: 60 seconds)</li>
<li>Self-diagnosis system & Misoperation inhibit function</li>
<li>Back-up Power Supply (Ni-Cd battery, 24VDC)</li>
<li>Large fire alarm symbol for easy visual recognition & durable LED indicators</li>
<li>Removable front cover for easy installation and maintenance</li>
<li>Built-in surge arrester for power lines</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FAPN202-R-5L-2.jpg',
    categoryIds: [77, 67],
    isActive: 1
  },
  {
    id: 2120,
    slug: 'fapn104n-b1-30l-40l-50l',
    name: 'FAPN104N-B1-30L, 40L, 50L',
    brand: 'NOHMI',
    excerpt:
      'The FAPN104N series fire alarm panel was developed to improve panel-front recognizability and functional operability, available from 30 up to 100 fire zones.',
    description: `<ul>
<li>Conventional type available for 30, 40, 50, 60, 70, 80, 90 and 100 fire zones</li>
<li>Alarm verification type (Verification time: 60 seconds)</li>
<li>Various test functions: fire indication test, alarm verification time test, battery test, automatic after-test resetting</li>
<li>Self-diagnosis system & Misoperation inhibit function</li>
<li>Built-in telephone system & Back-up power supply (Ni-Cd battery, 24VDC)</li>
<li>Fire zone indication by both zone nameplates and digital display, history list for last 10,000 events</li>
<li>25 programmable dry contacts interlocked by zone alarm signals & optional RS485 serial output</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FAPN104N-B1.jpg',
    categoryIds: [77, 67],
    isActive: 1
  },
  {
    id: 2124,
    slug: 'fa-605',
    name: 'FA-605',
    brand: 'CEMEN',
    excerpt:
      'Fire Alarm Control Panel ใน 1 โซนสามารถต่อกับอุปกรณ์ตรวจจับควันไฟ Smoke Detector ได้ 25 ตัว และอุปกรณ์ตรวจจับความร้อน Heat Detector ได้ไม่จำกัดจำนวน มีแบตเตอรี่ 24 โวลท์ในตัว มีฟังก์ชั่นตรวจเช็คสายและอุปกรณ์ได้',
    description: `<p>ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ ยี่ห้อ CEMEN รุ่น FA-605 รองรับการต่อ Smoke Detector ได้ 25 ตัวต่อโซน และ Heat Detector ไม่จำกัดจำนวน มาพร้อมแบตเตอรี่สำรองไฟ 24VDC ในตัว และระบบตรวจสอบสายสัญญาณขาดหรือลัดวงจรอัตโนมัติ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FA-605.jpg',
    categoryIds: [78, 67],
    isActive: 1
  },
  {
    id: 2126,
    slug: 'fa-601',
    name: 'FA-601',
    brand: 'CEMEN',
    excerpt:
      'Fire Alarm Control Panel (FCP) ตู้คอนโทรล หรือ ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ในอาคาร 1 โซน สามารถต่อกับ Smoke Detector ได้ 25 ตัว และ Heat Detector ได้ไม่จำกัดจำนวน พร้อมแบตเตอรี่ 24 โวลท์ มีฟังก์ชั่นตรวจเช็คสายและอุปกรณ์ได้',
    description: `<p>ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ขนาด 1 โซน ยี่ห้อ CEMEN รุ่น FA-601 เหมาะสำหรับอาคารพาณิชย์ สำนักงานคลินิก หรือร้านค้า ติดตั้งง่าย พร้อมแบตเตอรี่สำรอง 24VDC และระบบตรวจเช็คสาย</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FA-601.jpg',
    categoryIds: [78, 67],
    isActive: 1
  },
  {
    id: 2128,
    slug: 'fa-505',
    name: 'FA-505',
    brand: 'CEMEN',
    excerpt:
      'ตู้คอนโทรล หรือ ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ในอาคาร ขนาด 5 โซนและ 10 โซน Fire Alarm Control Panel 5 Zone and 10 Zone พร้อมแบตเตอรี่ 24VDC ใน 1 โซนต่อ Smoke Detector ได้ 25 ตัว และ Heat Detector ได้ไม่จำกัดจำนวน',
    description: `<p>ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ CEMEN รุ่น FA-505 ขนาด 5 โซน และ 10 โซน พร้อมแบตเตอรี่ 24VDC มีฟังก์ชั่นตรวจเช็คสายและอุปกรณ์ครบถ้วน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FA-505.jpg',
    categoryIds: [78, 67],
    isActive: 1
  },
  {
    id: 2130,
    slug: 'fa-400',
    name: 'FA-400',
    brand: 'CEMEN',
    excerpt:
      'ตู้คอนโทรล หรือ ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ในอาคาร ขนาด 15 – 80 โซน Fire Alarm Control Panel 15 – 80 Zone พร้อมแบตเตอรี่ 24VDC ใน 1 โซนต่อ Smoke Detector ได้ 25 ตัว และ Heat Detector ได้ไม่จำกัดจำนวน มีฟังก์ชั่นตรวจเช็คสายและอุปกรณ์ได้',
    description: `<p>ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ขนาดใหญ่สำหรับอาคารสูง โรงงาน และโครงการขนาดกลาง-ใหญ่ ขนาดตั้งแต่ 15 ถึง 80 โซน ยี่ห้อ CEMEN รุ่น FA-400 พร้อมแบตเตอรี่สำรองไฟ 24VDC</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FA-400.jpg',
    categoryIds: [78, 67],
    isActive: 1
  },
  {
    id: 2262,
    slug: 'cl-9600',
    name: 'CL-9600',
    brand: 'CL',
    excerpt:
      'ตู้ควบคุมระบบไฟอลาม Fire Alarm Control Panel ขนาด 5 – 80 โซน รุ่น CL-9600 ยี่ห้อ CL ใน 1 โซนต่อ Smoke Detector ได้ 25 ตัว และ Heat Detector ได้ไม่จำกัดจำนวน มีแบตเตอรี่ 24 โวลท์ สามารถตรวจเช็คสายและอุปกรณ์ Detector ได้',
    description: `<p>ตู้คอนโทรลระบบสัญญาณแจ้งเหตุเพลิงไหม้ รุ่น CL-9600 ยี่ห้อ CL รองรับตั้งแต่ 5 ถึง 80 โซน พร้อมแบตเตอรี่สำรอง 24V และฟังก์ชันตรวจสอบสถานะสายสัญญาณ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/CL-9600.jpg',
    categoryIds: [67],
    isActive: 1
  },
  {
    id: 2264,
    slug: 'ya-cp100',
    name: 'YA-CP100',
    brand: 'AIP',
    excerpt:
      'Fire Alarm Control Panel (FCP) ตู้คอนโทรล หรือ ตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ในอาคาร รุ่น YA-CP100 ขนาด 2-18 Zones Detector และรุ่น YA-CCP100-10 ขนาด 2-10 Zones Detector',
    description: `<ul>
<li>รุ่น YA-CP100 ขนาด 2-18 Zones Detector</li>
<li>รุ่น YA-CCP100-10 ขนาด 2-10 Zones Detector</li>
<li>ระบบแจ้งเตือนและตรวจสอบสายสัญญาณครบวงจร มาตรฐานแบรนด์ AIP</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/YA-CP100.jpg',
    categoryIds: [89, 67],
    isActive: 1
  },
  {
    id: 2133,
    slug: '882r',
    name: '882R',
    brand: 'System Sensor',
    excerpt:
      'System Sensor 800 series 2-wire conventional profile plug-in photoelectric smoke detector aimed to meet UL performance criteria, featuring state-of-the-art optical sensing chamber and latching alarm LED.',
    description: `<ul>
<li>Diameter: 10.2 cm (4″), Height (including base): 5.0 cm (2.0″)</li>
<li>Operating Temperature Range: 0~49°C (32°F to 120°F)</li>
<li>Operating Humidity Range: 10% to 93% Relative Humidity, Non-condensing</li>
<li>Operating Voltage: 8.5~35 VDC</li>
<li>Standby Current: ≤90μA | Alarm Current: 10mA – 130mA</li>
<li>Latching Alarm LED with remote LED connection capability</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/882.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2136,
    slug: 'sd-651',
    name: 'SD-651',
    brand: 'NOTIFIER',
    excerpt:
      'The Notifier SD-651 Plug-in Smoke Detectors offer superb performance and reliability in a sleek 2” (5.1 cm) low-profile design. UL listed optical sensing chamber sealed against dirt, back pressure air flow, and insects.',
    description: `<p>SD-651 photoelectric smoke detectors contain a unique optical sensing chamber designed to sense smoke particles produced by a wide range of combustion sources. Custom integrated circuit incorporates signal processing to reduce false alarms. Features low current draw, built-in tamper resistant base design, remote LED option, removable cover, and built-in test switch.</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/SD-651.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2138,
    slug: 'system-sensor-5600',
    legacySlug: '5600',
    name: '5600',
    brand: 'System Sensor',
    excerpt:
      'System Sensor 5600 series mechanical heat detectors offer a reliable, cost-effective means for property protection against fire and installations where smoke detectors are inappropriate.',
    description: `<ul>
<li>Single- and dual-circuit models available</li>
<li>Fixed temperature and combination fixed-temp / rate-of-rise (135°F or 194°F ratings)</li>
<li>Easy-to-use terminal screws & reversible mounting bracket</li>
<li>Compatible with single-gang, 3.5″/4″ octagonal, and 4″ square back boxes</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/5600.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2140,
    slug: 'ssm24-6',
    name: 'SSM24-6',
    brand: 'System Sensor',
    excerpt:
      'System Sensor SSM series 24VDC 6-inch alarm bells are low-current, high-decibel notification appliances approved for indoor and outdoor fire signaling applications.',
    description: `<ul>
<li>Approved for indoor and outdoor use</li>
<li>Low current draw & high dB output</li>
<li>Available in 6-inch, 8-inch, and 10-inch sizes</li>
<li>DC models polarized for use with supervision circuitry</li>
<li>Mounts directly to standard 4-inch square electrical box indoors, pre-wired</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/SSM24-6-1.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2143,
    slug: 'nbg-12s',
    name: 'NBG-12S',
    brand: 'NOTIFIER',
    excerpt:
      'NOTIFIER NBG-12S Manual Fire Alarm Pull Station — non-coded conventional pull station meeting UL 38 and ADA 5 lb. maximum pull-force requirements.',
    description: `<ul>
<li>Meets UL 38 Standard for Manually Actuated Signaling Boxes & ADA 5 lb. maximum pull-force</li>
<li>PUSH IN / PULL DOWN handle latches in the down position showing bright yellow "ACTIVATED" indicator</li>
<li>Braille text included on finger-hold area and top of handle</li>
<li>Key-lock / hex-lock models open for inspection without initiating alarm</li>
<li>Four-position terminal strip molded into backplate (accepts up to 12 AWG wire)</li>
<li>Surface or semi-flush mounting options</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/NBG-12S.jpg',
    categoryIds: [71],
    isActive: 1
  },
  {
    id: 2145,
    slug: 'monitor-modules',
    name: 'Monitor Modules',
    brand: 'NOTIFIER',
    excerpt:
      'โมดูลระบุตำแหน่ง (Addressable Monitor Modules) สำหรับเชื่อมต่ออุปกรณ์ตรวจจับและสวิตช์แจ้งเหตุเข้ากับตู้ควบคุมระบบอัจฉริยะ NOTIFIER ONYX Series (NFS-320 / NFS-640)',
    description: `<p>Addressable Monitor Modules สำหรับใช้งานร่วมกับตู้ควบคุมอัจฉริยะตระกูล ONYX Series ของ NOTIFIER (เช่น NFS-320, NFS-640) เพื่อเชื่อมต่ออุปกรณ์ Conventional Smoke/Heat Detector, Manual Pull Station, Waterflow Switch และอุปกรณ์แจ้งสถานะเข้าสู่ระบบ Loop อัจฉริยะ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/Monitor-Modules.jpg',
    categoryIds: [72],
    isActive: 1
  },
  {
    id: 2266,
    slug: 'aip-624b',
    name: 'AIP-624B',
    brand: 'AIP',
    excerpt:
      'กระดิ่งเตือนภัย ขนาด 6 นิ้ว รุ่น AIP-624B Fire Alarm Bell 6″ ยี่ห้อ AIP ได้มาตรฐาน UL LISTED ใช้ไฟ 24 VDC ความดังที่ 95 dB ที่ 3 เมตร',
    description: `<p>กระดิ่งสัญญาณแจ้งเหตุเพลิงไหม้ ขนาด 6 นิ้ว รุ่น AIP-624B ยี่ห้อ AIP มาตรฐาน UL Listed แรงดันใช้งาน 24 VDC ให้ระดับเสียงเตือนภัยดังชัดเจนถึง 95 dB (ที่ระยะ 3 เมตร) แข็งแรงทนทาน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/AIP-624B.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2269,
    slug: 'fbm023z-d',
    name: 'FBM023Z-D',
    brand: 'NOHMI',
    excerpt:
      'กระดิ่ง 6 นิ้ว (6 Inch Bell) รุ่น FBM023Z-D ยี่ห้อ Nohmi อุปกรณ์กำเนิดสัญญาณเตือนด้วยเสียง กระดิ่งแจ้งเตือนเหตุเพลิงไหม้ ขนาด 6 นิ้ว 24V DC เสียงดัง 90dB',
    description: `<ul>
<li>Motor driven type alarm bell (24V DC, 90 dB at 1 m)</li>
<li>Compatible with both Nohmi ATF analog addressable and conventional fire alarm systems</li>
<li>High sound output with low current consumption & low RFI noise</li>
<li>High durability, rainproof type available, lead wire connection</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FBM023Z-D.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2271,
    slug: 'fmmn102-u',
    name: 'FMMN102-U',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FMMN102-U push-button manual fire alarm box designed for high accessibility and usability, winner of the Japan Good Design Gold Award.',
    description: `<ul>
<li>Cutting-edge compact design</li>
<li>Push-button-type manual fire alarm box with easy reset after operation</li>
<li>Addressable and conventional types available</li>
<li>Built-in response lamp and telecommunication jack</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FMMN102-U.jpg',
    categoryIds: [71],
    isActive: 1
  },
  {
    id: 2274,
    slug: 's-336',
    name: 'S-336',
    brand: 'CEMEN',
    excerpt: 'อุปกรณ์แจ้งเหตุด้วยมือ Manual Station ยี่ห้อ CEMEN รุ่น S-336 มีแบบฝังและแบบติดลอย',
    description: `<p>อุปกรณ์กดแจ้งเหตุเพลิงไหม้ด้วยมือ (Manual Station) ยี่ห้อ CEMEN รุ่น S-336 ติดตั้งง่าย รองรับทั้งการติดตั้งแบบฝังผนังและแบบติดลอย</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/S-336.jpg',
    categoryIds: [71],
    isActive: 1
  },
  {
    id: 2276,
    slug: 'ya102',
    name: 'YA102',
    brand: 'AIP',
    excerpt:
      'สำหรับใช้กดแจ้งเหตุเพลิงไหม้เมื่อเกิดไฟไหม้ เป็นชนิดกดหน้ากระจกให้แตก วัสดุทำด้วยพลาสติกสีแดงทรงสี่เหลี่ยม พร้อมรุ่นฝาครอบใสป้องกันการกดโดยบังเอิญ ใช้ไฟ 24 VDC',
    description: `<p>อุปกรณ์กดแจ้งเหตุเพลิงไหม้ชนิด Break Glass รุ่น YA102 วัสดุพลาสติกทนทานสีแดงทรงสี่เหลี่ยม เมื่อใช้งานแล้วสามารถเปลี่ยนกระจกใหม่ได้ รองรับฝาครอบใสป้องกันการกดเล่น ใช้ไฟ 24 VDC</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/YA102.jpg',
    categoryIds: [71],
    isActive: 1
  },
  {
    id: 2278,
    slug: 'beam1224',
    name: 'Beam1224',
    brand: 'System Sensor',
    excerpt:
      'Model BEAM1224(S) single-ended reflective beam smoke detector is uniquely suited for protecting open areas with high ceilings such as warehouses, factories, and atriums.',
    description: `<ul>
<li>16- to 328-foot (5 to 100 m) protection range</li>
<li>Single-ended, reflective design with digital display for easy alignment</li>
<li>Six user-selectable sensitivity levels</li>
<li>Built-in automatic gain control compensates for signal deterioration from dust build-up</li>
<li>Optional integral NFPA 72 sensitivity test feature & remote test station</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/Beam1224-1.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2281,
    slug: 'system-sensor-2151',
    legacySlug: '2151',
    name: '2151',
    brand: 'System Sensor',
    excerpt:
      'The System Sensor 2151 low-profile photoelectric smoke detector is UL 268A listed with dual standby LEDs, removable cover for easy cleaning, and low standby current.',
    description: `<ul>
<li>Low-profile photoelectric smoke detector design</li>
<li>Low standby current with two blinking standby LEDs</li>
<li>Detector head plugs easily into B114LP / B401 base</li>
<li>Field sensitivity metering to meet NFPA 72 requirements</li>
<li>Removable cover and insect screen for field cleaning</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/2151.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2284,
    slug: 'system-sensor-5151',
    legacySlug: '5151',
    name: '5151',
    brand: 'System Sensor',
    excerpt:
      'System Sensor 100 Series 5151 Plug-in Thermal Detectors offer superb performance and reliability in a sleek, low-profile design.',
    description: `<ul>
<li>Low standby current & compatible with 400 Series products</li>
<li>Two visible LEDs blink in standby and provide a 360° field viewing angle</li>
<li>Detector head plugs easily into mounting base with built-in shorting spring</li>
<li>Built-in test switch</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/5151.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2286,
    slug: 'cl-180',
    name: 'CL-180',
    brand: 'CL',
    excerpt:
      'สโม๊คดีเทคเตอร์ อุปกรณ์ตรวจจับควันไฟ วัสดุเป็นพลาสติกทนความร้อนสีขาว มีไฟ LED บอกสถานะการทำงาน กินกระแสไฟตอนสแตนด์บาย 60~90 ไมโครแอมป์ และตอนทำอลาม 60 มิลลิแอมป์ ไฟ LED สีแดงติดค้างเมื่อแจ้งเหตุ',
    description: `<p>อุปกรณ์ตรวจจับควันไฟ (Photoelectric Smoke Detector) รุ่น CL-180 ยี่ห้อ CL ตัวเรือนพลาสติกทนความร้อนสีขาว กินไฟต่ำ มีไฟ LED แสดงสถานะการทำงานรอบทิศทาง</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/CL-180.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2288,
    slug: 'cl-181',
    name: 'CL-181',
    brand: 'CL',
    excerpt:
      'อุปกรณ์จับความร้อน แบบตรวจจับความร้อนอุณหภูมิคงที่ 70 องศาเซลเซียส วัสดุพลาสติกทนความร้อนสีขาว กินกระแสไฟตอนทำอลาม 60 มิลลิแอมป์ มีไฟ LED สีแดงติดค้างบอกสถานะแจ้งเหตุ',
    description: `<p>อุปกรณ์ตรวจจับความร้อนชนิดอุณหภูมิคงที่ 70°C (Fixed Temperature Heat Detector) รุ่น CL-181 ยี่ห้อ CL ทนทาน เหมาะกับห้องครัว ห้องเครื่อง หรือพื้นที่ที่มีฝุ่น/ไอน้ำ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/CL-181.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2290,
    slug: 's-332',
    name: 'S-332',
    brand: 'CEMEN',
    excerpt: 'กระดิ่งเตือนภัย รุ่น S-332 Fire Alarm Bell ยี่ห้อ CEMEN ขนาด 6 นิ้ว ใช้ไฟ 24 VDC',
    description: `<p>กระดิ่งสัญญาณเตือนอัคคีภัยขนาด 6 นิ้ว ยี่ห้อ CEMEN รุ่น S-332 ใช้ไฟ 24 VDC เสียงกังวานชัดเจน แข็งแรงทนทาน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/S-332.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2332,
    slug: 'ah-03127-bs',
    name: 'AH-03127-BS',
    brand: 'Horing Lih',
    excerpt: 'ไซเรนพร้อมไฟกระพริบ สามารถปรับความดังและปรับเสียงได้ 32 เสียง ความดังสูงสุด 114 dB ที่ 1 เมตร ใช้ไฟ 24 VDC',
    description: `<p>อุปกรณ์ส่งสัญญาณเสียงไซเรนและแสงไฟกระพริบ รุ่น AH-03127-BS ปรับรูปแบบเสียงเตือนภัยได้ถึง 32 โทนเสียง ความดังสูงสุด 114 dB (ที่ระยะ 1 เมตร) แรงดันไฟ 24 VDC</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/AH-03127-BS.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2334,
    slug: 'fdgj203-d-x',
    name: 'FDGJ203-D-X',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FDGJ203-D-X projected beam type smoke detector consisting of a Light Transmitter and Light Receiver covering distances of 5 to 100 meters.',
    description: `<ul>
<li>50% size reduction from previous model</li>
<li>Wide and high coverage within 5 to 100 m distance</li>
<li>Sensitivity drift compensation for contamination or slight optical shift</li>
<li>Light synchronized system to prevent false alarms</li>
<li>Simple optical axis setting & optional remote test switch</li>
<li>Approved by Japan Fire Equipment Inspection Institute</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FDGJ203-D-X.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2337,
    slug: 'fdk-246-n',
    name: 'FDK-246-N',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FDK-246-N Conventional Photoelectric Smoke Detector — ultra-low 45μA monitoring current, 2-wire system, low profile, approved by Japan Fire Equipment Inspection Institute.',
    description: `<ul>
<li>Small monitoring current of 45 μA</li>
<li>2-wire conventional system</li>
<li>Alarm response lamp (LED)</li>
<li>Simple mounting & very easy maintenance</li>
<li>Very low profile design</li>
<li>Approved by Japan Fire Equipment Inspection Institute</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FDK-246-N.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2339,
    slug: 'fdl120-e-60',
    name: 'FDL120-E-60',
    brand: 'NOHMI',
    excerpt: 'Explosion-proof Type Detector Model FDL120-E-60 ยี่ห้อ NOHMI สำหรับพื้นที่เสี่ยงอันตราย',
    description: `<p>อุปกรณ์ตรวจจับชนิดป้องกันการระเบิด (Explosion-proof Type) รุ่น FDL120-E-60 ยี่ห้อ NOHMI ออกแบบสำหรับติดตั้งในพื้นที่อันตราย เช่น โรงกลั่น คลังสารเคมี หรือห้องเก็บเชื้อเพลิง</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/FDL120-E-60.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2342,
    slug: 'fdlj906-dw-65',
    name: 'FDLJ906-DW-65',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FDLJ906-DW-65 fixed temperature waterproof heat detector (65°C) using bi-metal snap discs, automatically self-restoring and equipped with physical protector.',
    description: `<ul>
<li>Physical protector equipped for improved durability</li>
<li>Easy installation U-figure screw holes & soldered lead-wire tips</li>
<li>Waterproof type suitable for kitchens, bathrooms, and humid industrial areas</li>
<li>2-wire system with Alarm response lamp (LED)</li>
<li>Approved by Japan Fire Equipment Inspection Institute</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/FDLJ906-DW-65.jpg',
    datasheetUrl: 'https://fireszone.com/wp-content/uploads/woocommerce_uploads/2021/03/fdlj_df_2914-xgyf9c.pdf',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2346,
    slug: 'fdpj206-d',
    name: 'FDPJ206-D',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FDPJ206-D rate-of-rise pneumatic heat detector responding rapidly to fire-induced temperature rises while ignoring normal gradual room heating.',
    description: `<ul>
<li>Conventional 2-wire rate-of-rise heat detector</li>
<li>Interchangeable common base with NOHMI FDK series smoke detectors</li>
<li>Alarm response lamp (LED) for immediate identification</li>
<li>Simple mounting, low profile, and easy maintenance</li>
<li>Approved by Japan Fire Equipment Inspection Institute</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/FDPJ206-D.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2348,
    slug: 'fireman-telephone-jack',
    name: 'Fireman-telephone-jack',
    brand: 'FIREMAN',
    excerpt: 'เต้ารับโทรศัพท์นักดับเพลิง (Fireman Telephone Jack) หน้ากากสแตนเลส ขนาด 7 x 11.5 ซม. สำหรับบ๊อกซ์เดี่ยวมาตรฐาน',
    description: `<ul>
<li>Prewired to the phone jack for fast installation</li>
<li>Single Phone Jack Mounted on durable Stainless Steel Faceplate</li>
<li>Size: 7 cm x 11.5 cm (Single-Gang Electrical Outlet Box)</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/Fireman-telephone-jack.jpg',
    categoryIds: [72],
    isActive: 1
  },
  {
    id: 2350,
    slug: 'fsp-851ch',
    name: 'FSP-851CH',
    brand: 'NOTIFIER',
    excerpt:
      'Notifier 851 Series intelligent plug-in photoelectric smoke detector with FlashScan® & CLIP addressable communication for ONYX series FACPs.',
    description: `<ul>
<li>Sleek, low-profile addressable-analog design</li>
<li>Compatible with FlashScan (NFS-320, NFS-640, NFS2-3030) and CLIP systems</li>
<li>Rotary decimal addressing (1–159 on FlashScan systems)</li>
<li>Dual bi-color LEDs provide 360° viewing angle (blink green on poll, steady red on alarm)</li>
<li>Remote test feature from panel & built-in magnet test switch</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/FSP-851CH.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2352,
    slug: 'fwln007-r-p1',
    name: 'FWLN007-R-P1',
    brand: 'NOHMI',
    excerpt:
      'NOHMI FWLN007-R-P1 three-in-one combination fire alarm box integrating ring-shaped location lamp, manual fire alarm box, and fire alarm bell.',
    description: `<ul>
<li>Three-in-one integrated unit: ring-shaped LED location lamp, manual fire alarm box, and alarm bell</li>
<li>Winner of Japan Good Design Gold Award — ultra-slim 15mm recess depth (75mm surface mount)</li>
<li>High visibility even in dark corridors</li>
<li>Streamlined internal structure for fast, clean wiring</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/FWLN007-R-P1.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2354,
    slug: 'ldm-e32',
    name: 'LDM-E32',
    brand: 'NOTIFIER',
    excerpt:
      'Notifier LDM-E32 Lamp Driver Annunciator Expander Module with 32 alarm drivers (or 16 alarm, 16 trouble, and 16 switch inputs), includes ribbon cable.',
    description: `<p>Lamp Driver Annunciator Expander Module 32 Points สำหรับขยายจุดแสดงผล Graphic Annunciator ร่วมกับโมดูล LDM-32 ของ NOTIFIER มาพร้อมสายแพเชื่อมต่อ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/LDM-32.jpg',
    categoryIds: [72],
    isActive: 1
  },
  {
    id: 2356,
    slug: 'p2rl',
    name: 'P2RL',
    brand: 'System Sensor',
    excerpt:
      'System Sensor L-Series P2RL wall-mount 2-wire LED Horn Strobe featuring lower current draw, modern aesthetics, and field-selectable candela settings.',
    description: `<ul>
<li>Updated modern compact profile for Horn Strobes</li>
<li>Plug-in design with minimal intrusion into the back box & tamper-resistant construction</li>
<li>Automatic selection of 12- or 24-volt operation at 15 and 30 candela</li>
<li>Field-selectable candela settings: 15, 30, 75, 95, 110, 135, and 185 cd</li>
<li>Horn rated at 88+ dBA at 16 volts with rotary switch for tone and volume selection</li>
<li>Mounting plate shorting spring checks wiring continuity before device installation</li>
</ul>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/p2rl.jpg',
    categoryIds: [70],
    isActive: 1
  },
  {
    id: 2359,
    slug: 's-302',
    name: 'S-302',
    brand: 'CEMEN',
    excerpt:
      'อุปกรณ์ตรวจจับความร้อน จับอุณหภูมิที่เปลี่ยนแปลงจากปกติ 9 องศาเซลเซียส หรือ 15 องศาฟาเรนไฮต์ ภายใน 1 นาที มีไฟ LED บอกสถานะการทำงาน',
    description: `<p>อุปกรณ์ตรวจจับความร้อนชนิดตรวจจับอัตราการเพิ่มของอุณหภูมิ (Rate-of-Rise Heat Detector) รุ่น S-302 ยี่ห้อ CEMEN ทำงานเมื่ออุณหภูมิสูงขึ้นเกิน 9°C ภายใน 1 นาที พร้อมไฟ LED แสดงสถานะ</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/S-302.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2361,
    slug: 's-314',
    name: 'S-314',
    brand: 'CEMEN',
    excerpt:
      'ตัวจับควัน สโม๊คดีเทคเตอร์ ใช้ไฟ 12~24 โวลท์ สามารถใช้ร่วมกับระบบกันขโมยได้ มีดรายคอนแทคแยก (NO/NC) และไฟ LED สีแดงติดค้างเมื่อเกิดเหตุอลาม',
    description: `<p>อุปกรณ์ตรวจจับควันไฟ รุ่น S-314 ยี่ห้อ CEMEN วัสดุพลาสติกทนความร้อนสีขาว ใช้ไฟ 12~24V กินกระแสสแตนด์บาย 75 ไมโครแอมป์ มี Dry Contact แยก (0.8A @ 30V / 0.4A @ 125V) สามารถประยุกต์ใช้งานร่วมกับตู้ Fire Alarm และระบบกันขโมยได้</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/S-314.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2363,
    slug: 's-315',
    name: 'S-315',
    brand: 'CEMEN',
    excerpt: 'ตรวจจับควัน Smoke Detector ยี่ห้อ CEMEN รุ่น S-315 มีไฟ LED บอกสถานะการทำงาน',
    description: `<p>อุปกรณ์ตรวจจับควันไฟ Photoelectric Smoke Detector ยี่ห้อ CEMEN รุ่น S-315 ดีไซน์กะทัดรัด ติดตั้งง่าย พร้อมไฟ LED แสดงสถานะการทำงาน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/S-315.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2365,
    slug: 's-318',
    name: 'S-318',
    brand: 'CEMEN',
    excerpt:
      'อุปกรณ์ตรวจจับความร้อนอุณหภูมิคงที่ 70 องศาเซลเซียส ใช้ไฟ 12~24 โวลท์ มีดรายคอนแทคแยก และไฟ LED สีแดงติดค้างบอกสถานะตอนทำอลาม',
    description: `<p>อุปกรณ์ตรวจจับความร้อนชนิดอุณหภูมิคงที่ 70°C รุ่น S-318 ยี่ห้อ CEMEN ใช้ไฟ 12~24V กินกระแสตอนทำอลาม 40mA มี Dry Contact แยก พร้อมไฟ LED แสดงสถานะการทำงาน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/S-318.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2367,
    slug: 'ya-ch710',
    name: 'YA-CH710',
    brand: 'AIP',
    excerpt:
      'อุปกรณ์ตรวจจับความร้อน 2 ระบบ คือ ตรวจจับอุณหภูมิที่เปลี่ยนแปลงและตรวจจับอุณหภูมิคงที่ในตัวเดียวกัน วัสดุเป็นพลาสติกทนความร้อนสีขาว',
    description: `<p>Combination Heat Detector รุ่น YA-CH710 ยี่ห้อ AIP รวมระบบตรวจจับอัตราการเพิ่มอุณหภูมิ (Rate-of-Rise) และอุณหภูมิคงที่ (Fixed Temperature) ไว้ในตัวเดียว แม่นยำและทนทาน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/YA-CH710.jpg',
    categoryIds: [69],
    isActive: 1
  },
  {
    id: 2369,
    slug: 'ya-cs820',
    name: 'YA-CS820',
    brand: 'AIP',
    excerpt: 'ตัวจับควัน สโม๊คดีเทคเตอร์ หรือ อุปกรณ์ตรวจจับควันไฟ รุ่น YA-CS820 วัสดุเป็นพลาสติกทนความร้อนสีขาว',
    description: `<p>อุปกรณ์ตรวจจับควันไฟ (Photoelectric Smoke Detector) รุ่น YA-CS820 ยี่ห้อ AIP ตัวเรือนผลิตจากพลาสติกทนความร้อนสีขาว ตรวจจับควันไฟได้อย่างรวดเร็วและเสถียร</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/YA-CS820.jpg',
    categoryIds: [68],
    isActive: 1
  },
  {
    id: 2374,
    slug: 'bgm',
    name: 'BGM',
    brand: 'BGM',
    excerpt: 'อุปกรณ์แจ้งเหตุเพลิงไหม้ชนิดป้องกันการระเบิด (Explosion-Proof) แบรนด์ BGM สำหรับติดตั้งในพื้นที่เสี่ยงอันตรายและโรงงานอุตสาหกรรม',
    description: `<p>ชุดอุปกรณ์แจ้งเหตุเพลิงไหม้ชนิดกันระเบิด (Explosion-Proof Fire Alarm Equipment) แบรนด์ BGM ออกแบบโครงสร้างป้องกันประกายไฟเล็ดลอดออกสู่ภายนอก เหมาะสำหรับโรงงานเคมี คลังเชื้อเพลิง ห้องเก็บก๊าซ และพื้นที่ Hazardous Location</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/03/BMG.jpg',
    categoryIds: [90],
    isActive: 1
  }
]

export const SEED_SERVICES: SeedService[] = [
  // หมวดอุปกรณ์ของเรา (5 รายการบนหน้าแรก)
  {
    id: 1,
    slug: 'fire-alarm-devices',
    legacySlug: 'ระบบไฟอราม',
    type: 'equipment',
    title: 'อุปกรณ์กำเนิดสัญญาณเหตุเพลิงไหม้',
    excerpt: 'อุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ เช่น Smoke Detector, Heat Detector, Manual Pull Station สำหรับแจ้งเตือนเมื่อเกิดเหตุ',
    content: `<p>อุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ ที่มีไว้สำหรับแจ้งเตือนเมื่อมีเหตุเพลิงไหม้ โดยจะใช้อุปกรณ์ตรวจจับชนิดต่างๆ กันออกไปตามความเหมาะสมของพื้นที่ เช่น Smoke Detector (อุปกรณ์ตรวจจับควัน), Heat Detector (อุปกรณ์ตรวจจับความร้อน), Manual Pull Station / Manual Call Point (อุปกรณ์ดึงหรือกดแจ้งเหตุด้วยมือ) เป็นต้น ซึ่งจะทำให้สามารถรับรู้เหตุการณ์ตั้งแต่ระยะเริ่มต้นและแก้ไขได้ทันท่วงที ไม่ให้ไฟไหม้ลุกลามจนไม่สามารถควบคุมได้</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/product1.png',
    sortOrder: 1
  },
  {
    id: 2,
    slug: 'fire-control-panels',
    legacySlug: 'ระบบกล้องวงจรปิด',
    type: 'equipment',
    title: 'ตู้ควบคุมระบบป้องกันอัคคีภัย',
    excerpt: 'ตู้ควบคุมระบบป้องกันอัคคีภัยทั้งแบบ Hard-Wire (Conventional) และแบบ Multiplex (Addressable) มาตรฐาน UL, FM',
    content: `<p>ตู้ควบคุมระบบป้องกันอัคคีภัยจะมีด้วยกัน 2 แบบหลัก ได้แก่ แบบ Hard-Wire (Conventional) และแบบ Multiplex (Addressable)</p>
<p><strong>1. ตู้ควบคุมระบบแบบ Hard-Wire (Conventional):</strong> จะต่อโซนอุปกรณ์ตรวจจับและโซนอุปกรณ์แจ้งสัญญาณเตือนเข้ากับแผงควบคุมภายในตู้โดยตรง มีให้เลือกทั้งขนาด 1, 2, 4, 5, 6, 10 ไปจนถึง 80 โซน จากแบรนด์ชั้นนำมาตรฐาน UL, FM, ULC และมาตรฐานญี่ปุ่น</p>
<p><strong>2. ตู้ควบคุมระบบแบบ Multiplex (Addressable):</strong> ใช้อุปกรณ์ระบุตำแหน่งและโมดูล (Addressable Module) ในการต่อโซนและขยายระบบ ทำให้ทราบจุดเกิดเหตุแบบรายตัว เหมาะกับอาคารขนาดกลางถึงขนาดใหญ่</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/product2.png',
    sortOrder: 2
  },
  {
    id: 3,
    slug: 'fire-extinguishing-equipment',
    legacySlug: 'อุปกรณ์ดับเพลิง',
    type: 'equipment',
    title: 'อุปกรณ์ดับเพลิง',
    excerpt: 'ถังดับเพลิงชนิดผงเคมีแห้ง ถังดับเพลิง CO2 อุปกรณ์ไฟฉุกเฉิน และอุปกรณ์ดับเพลิงครบวงจร พร้อมให้คำปรึกษาฟรี',
    content: `<p>เครื่องดับเพลิงแบบมือถือ หรือถังดับเพลิง มีหลากหลายประเภทให้เลือกใช้งานตามความเหมาะสมของพื้นที่ ได้แก่:</p>
<p><strong>• ถังดับเพลิงชนิดผงเคมีแห้ง (Dry Chemical):</strong> บรรจุถังสีแดง ภายในบรรจุผงเคมีแห้งและก๊าซไนโตรเจน ฉีดออกมาเป็นฝุ่นละออง สามารถดับเพลิงไหม้ที่เกิดจากไม้ กระดาษ สิ่งทอ ยาง น้ำมัน แก๊ส และเครื่องใช้ไฟฟ้าได้อย่างรวดเร็วและมีประสิทธิภาพสูง</p>
<p><strong>• ถังดับเพลิงชนิดก๊าซคาร์บอนไดออกไซด์ (CO2):</strong> น้ำยาเป็นหมอกหิมะที่ช่วยลดความร้อนและไล่ออกซิเจน ไม่ทิ้งคราบสกปรก เหมาะสำหรับใช้งานภายในอาคาร ห้องเซิร์ฟเวอร์ ห้องควบคุมไฟฟ้า มีขนาด 5, 10 และ 15 ปอนด์</p>
<p><strong>• อุปกรณ์ไฟฉุกเฉิน (Emergency Light):</strong> อุปกรณ์ให้แสงสว่างสำรองอัตโนมัติเมื่อเกิดเหตุไฟฟ้าดับ เพื่อให้สามารถอพยพออกจากอาคารได้อย่างปลอดภัย</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/Porduct-6.jpg',
    sortOrder: 3
  },
  {
    id: 4,
    slug: 'cctv-systems',
    legacySlug: 'ระบบกล้องวงจรปิด-2',
    type: 'equipment',
    title: 'ระบบกล้องวงจรปิด',
    excerpt: 'ระบบการบันทึกภาพเคลื่อนไหวด้วยกล้องวงจรปิด CCTV แบรนด์ชั้นนำ Hikvision, Panasonic, Bosch, Dahua',
    content: `<p>ระบบการบันทึกภาพเคลื่อนไหวด้วยกล้องวงจรปิด (CCTV) สำหรับการรักษาความปลอดภัยและเฝ้าระวังเหตุการณ์ต่างๆ ทั้งภายในและภายนอกอาคาร รองรับการดูภาพออนไลน์ผ่านสมาร์ทโฟนตลอด 24 ชั่วโมง จัดจำหน่ายและติดตั้งแบรนด์ชั้นนำ อาทิ Hikvision, Panasonic, Bosch, Pelco และ Dahua</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/Porduct-5.jpg',
    sortOrder: 4
  },
  {
    id: 5,
    slug: 'digital-matv-systems',
    legacySlug: 'ระบบทีวีดิจิตอล',
    type: 'equipment',
    title: 'ระบบทีวีดิจิตอล',
    excerpt: 'ระบบเสาอากาศรวม Master Antenna Television (MATV) สำหรับหอพัก อพาร์ทเม้นท์ รีสอร์ท คอนโดมิเนียม และโรงแรม',
    content: `<p>Master Antenna Television (MATV) คือระบบกระจายสัญญาณทีวีดิจิตอลไปยังห้องพักต่างๆ ภายในอาคารเดียวกันหรือกลุ่มอาคารใกล้เคียงโดยใช้เสาอากาศรวมเพียงชุดเดียว นิยมใช้ในหอพัก อพาร์ทเม้นท์ รีสอร์ท คอนโดมิเนียม และโรงแรม</p>
<p>ช่วยให้ไม่ต้องติดตั้งเสาก้างปลาหรือจานดาวเทียมแยกแต่ละห้อง ลดความรกของอาคาร บริหารจัดการสายสัญญาณได้เป็นระเบียบ และดูแลรักษาง่าย</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/Porduct-4.jpg',
    sortOrder: 5
  },

  // งานบริการของเรา (4 รายการบนหน้าแรก)
  {
    id: 6,
    slug: 'installation-and-inspection',
    legacySlug: 'บริการของเรา-1',
    type: 'service',
    title: 'ติดตั้งและตรวจเช็คระบบสัญญาณเตือนไฟไหม้',
    excerpt: 'พร้อมช่างที่ชำนาญเฉพาะทางที่มีประสบการณ์มาหลายปี ติดตั้งตามแบบและสโคปงานมาตรฐาน',
    content: `<p>บริการติดตั้งและตรวจเช็คบำรุงรักษาระบบสัญญาณเตือนไฟไหม้ (Fire Alarm System) ติดตั้งตามแบบวิศวกรรมหรือตามสโคปงานที่ได้รับมอบหมาย พร้อมตรวจสอบสายสัญญาณและทดสอบการทำงานของอุปกรณ์ทุกจุดโดยทีมช่างผู้ชำนาญการที่มีประสบการณ์มากกว่า 20 ปี</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/server-2.jpg',
    sortOrder: 6
  },
  {
    id: 7,
    slug: 'testing-and-training',
    legacySlug: 'บริการของเรา-3',
    type: 'service',
    title: 'ทดสอบระบบสัญญาณเตือนไฟไหม้',
    excerpt: 'สอนการใช้งานของอุปกรณ์ พร้อมให้คำปรึกษาจากช่างที่ชำนาญงานโดยตรง',
    content: `<p>บริการทดสอบประสิทธิภาพระบบสัญญาณเตือนไฟไหม้ประจำปี แนะนำอุปกรณ์สัญญาณเตือนไฟไหม้ที่เหมาะสมกับหน้างาน สอนวิธีการใช้งานตู้ควบคุมให้กับเจ้าหน้าที่ประจำอาคาร รวมถึงวิเคราะห์และแก้ไขปัญหาหน้างานอย่างตรงจุด</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2020/06/service-1.png',
    sortOrder: 7
  },
  {
    id: 8,
    slug: 'line-alarm-development',
    legacySlug: 'พัฒนาระบบสัญญาณเตือนภั',
    type: 'service',
    title: 'พัฒนาระบบสัญญาณเตือนภัยไฟอราม',
    excerpt: 'เขียนระบบให้อุปกรณ์สัญญาณเตือนภัยไฟอราม สามารถแจ้งเตือนผ่านมือถือ Line และ E-mail ได้ทันที',
    content: `<p>พัฒนาระบบต่อพ่วงให้อุปกรณ์และตู้ควบคุมสัญญาณเตือนภัยไฟอรามสามารถแจ้งเตือนถึงผู้ดูแลอาคารได้รวดเร็วขึ้น โดยส่งข้อความแจ้งเตือนเข้าสู่กลุ่ม LINE (Line Notification) หรือ E-mail ทันทีเมื่อเกิดเหตุสัญญาณเตือนอัคคีภัย ทางบริษัทเป็นผู้พัฒนาขึ้นโดยเฉพาะเพื่อรองรับความต้องการของลูกค้ายุคใหม่</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/02/server-3.jpg',
    sortOrder: 8
  },
  {
    id: 9,
    slug: 'fire-alarm-supply',
    legacySlug: 'บริการของเรา-2-2',
    type: 'service',
    title: 'ระบบสัญญาณเตือนไฟไหม้',
    excerpt: 'จำหน่ายอุปกรณ์ ระบบสัญญาณเตือนไฟไหม้ ได้มาตรฐาน UL พร้อมคู่มือและสอนการใช้งาน',
    content: `<p>จัดจำหน่ายอุปกรณ์แจ้งเตือนภัยไฟอราม (Fire Alarm) และอุปกรณ์ดับเพลิงหลากหลายแบรนด์ชั้นนำ ได้รับมาตรฐานสากล UL / FM พร้อมเอกสารคู่มือการใช้งาน การรับประกันสินค้า และบริการให้คำปรึกษาวิธีการใช้งานครบถ้วน</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/server-1-1.jpg',
    sortOrder: 9
  }
]

export const SEED_POSTS: SeedPost[] = [
  // 13 ผลงานโครงการจริง (คัดกรองโพสต์ที่ถูกแฮกออกทั้งหมด)
  {
    id: 2906,
    slug: 'project-pa-phone',
    legacySlug: 'โครงการ-บริษัท-พี-เอ-โฟน',
    type: 'portfolio',
    title: 'โครงการ บริษัท พี เอ โฟน',
    excerpt: 'ผลงานติดตั้งและตรวจสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ บริษัท พี เอ โฟน',
    content: '<p>ดำเนินการติดตั้งและทดสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ (Fire Alarm System) ณ โครงการ บริษัท พี เอ โฟน โดยทีมช่างผู้เชี่ยวชาญจาก บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-15.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-15.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2903,
    slug: 'project-signal-department-palace',
    legacySlug: 'โครงการ-กรมทหารสื่อสาร-พ',
    type: 'portfolio',
    title: 'โครงการ กรมทหารสื่อสาร พระราชวัง',
    excerpt: 'ผลงานติดตั้งและดูแลระบบสัญญาณเตือนอัคคีภัย กรมทหารสื่อสาร พระราชวัง',
    content: '<p>ดำเนินการติดตั้ง ตรวจเช็ค และทดสอบระบบสัญญาณเตือนอัคคีภัย ณ โครงการ กรมทหารสื่อสาร พระราชวัง ให้พร้อมใช้งานตามมาตรฐานความปลอดภัยสูงสุด</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-14.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-14.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2900,
    slug: 'project-porsche-vibhavadi',
    legacySlug: 'โครงการ-โรงอู่-ปอร์เช่-ว',
    type: 'portfolio',
    title: 'โครงการ โรงอู่ ปอร์เช่ วิภาวดีรังสิต',
    excerpt: 'ผลงานติดตั้งระบบสัญญาณเตือนอัคคีภัย ศูนย์บริการและโรงอู่ ปอร์เช่ ถนนวิภาวดีรังสิต',
    content: '<p>ผลงานติดตั้งและทดสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ (Fire Alarm System) ณ โครงการ โรงอู่ ปอร์เช่ วิภาวดีรังสิต มาตรฐานศูนย์บริการรถยนต์ระดับสากล</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-13.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-13.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2897,
    slug: 'project-animal-space-hospital',
    legacySlug: 'โครงการ-โรงบาลสัตว์-แอนิ',
    type: 'portfolio',
    title: 'โครงการ โรงพยาบาลสัตว์ แอนิมอลสเปซ พุทธมณฑล 2',
    excerpt: 'ผลงานติดตั้งระบบแจ้งเหตุเพลิงไหม้ โรงพยาบาลสัตว์ แอนิมอลสเปซ พุทธมณฑลสาย 2',
    content: '<p>ดำเนินการติดตั้งและทดสอบระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm System) สำหรับอาคารโรงพยาบาลสัตว์ แอนิมอลสเปซ พุทธมณฑล 2 เพื่อความปลอดภัยตลอด 24 ชั่วโมง</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-12.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-12.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2894,
    slug: 'project-mitsubishi-training-center',
    legacySlug: 'โครงการ-ศูนย์-training-center-of-mutsubishie',
    type: 'portfolio',
    title: 'โครงการ ศูนย์ Training Center of Mitsubishi',
    excerpt: 'ผลงานติดตั้งและตรวจเช็คระบบป้องกันอัคคีภัย ศูนย์ฝึกอบรม Mitsubishi',
    content: '<p>ดำเนินการติดตั้งและตรวจเช็คระบบสัญญาณเตือนอัคคีภัย ณ โครงการ ศูนย์ฝึกอบรม Training Center of Mitsubishi โดยทีมวิศวกรและช่างเทคนิคชำนาญการ</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-10.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-10.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2891,
    slug: 'project-lat-krabang-factory',
    legacySlug: 'โครงการ-โรงงาน-ลาดกระบัง',
    type: 'portfolio',
    title: 'โครงการ โรงงาน ลาดกระบัง',
    excerpt: 'ผลงานติดตั้งระบบสัญญาณแจ้งเหตุเพลิงไหม้สำหรับโรงงานอุตสาหกรรม เขตลาดกระบัง',
    content: '<p>ผลงานติดตั้งและทดสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ในพื้นที่โรงงานอุตสาหกรรม เขตลาดกระบัง ครอบคลุมพื้นที่การผลิตและคลังสินค้า</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-9.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-9.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2888,
    slug: 'project-bukkhalo-trading-factory',
    legacySlug: 'โครงการ-โรงงาน-บุคคโลแทร',
    type: 'portfolio',
    title: 'โครงการ โรงงาน บุคคโลแทรดิ้ง',
    excerpt: 'ผลงานติดตั้งและบำรุงรักษาระบบไฟอราม โรงงาน บุคคโลแทรดิ้ง',
    content: '<p>ดำเนินการติดตั้งและตรวจเช็คระบบสัญญาณแจ้งเหตุเพลิงไหม้ (Fire Alarm System) ณ โครงการ โรงงาน บุคคโลแทรดิ้ง พร้อมส่งมอบและแนะนำการใช้งาน</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-8.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-8.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2885,
    slug: 'project-poultry-group-chonburi',
    legacySlug: 'โครงการ-บริษัท-โพลทรี่กร',
    type: 'portfolio',
    title: 'โครงการ บริษัท โพลทรี่กรุ๊ป จำกัด พนัสนิคม ชลบุรี',
    excerpt: 'ผลงานติดตั้งระบบสัญญาณเตือนอัคคีภัย บริษัท โพลทรี่กรุ๊ป จำกัด อ.พนัสนิคม จ.ชลบุรี',
    content: '<p>ดำเนินการติดตั้งและทดสอบระบบแจ้งเหตุเพลิงไหม้ ณ โครงการ บริษัท โพลทรี่กรุ๊ป จำกัด อ.พนัสนิคม จ.ชลบุรี</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-7.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-7.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2878,
    slug: 'project-unison-laboratories',
    legacySlug: 'โครงการ-โรงงาน-unison-laboratories',
    type: 'portfolio',
    title: 'โครงการ UNISON LABORATORIES',
    excerpt: 'ผลงานติดตั้งและตรวจสอบระบบสัญญาณเตือนไฟไหม้ โรงงานเวชภัณฑ์ UNISON LABORATORIES',
    content: '<p>ผลงานติดตั้งและตรวจสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ตามมาตรฐานโรงงานผลิตเวชภัณฑ์ ณ โครงการ UNISON LABORATORIES</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-6.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/10/Pro-6.jpg'],
    publishedAt: '2021-10-29'
  },
  {
    id: 2292,
    slug: 'project-the-living',
    legacySlug: 'โครงการ-the-living',
    type: 'portfolio',
    title: 'โครงการ The LIVING',
    excerpt: 'ผลงานติดตั้งและทดสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ครบวงจร โครงการ The LIVING',
    content: '<p>ประมวลภาพผลงานการเดินสาย ติดตั้งตู้ควบคุม อุปกรณ์ตรวจจับควัน-ความร้อน และทดสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ ณ โครงการ The LIVING</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/02/Pro-3.jpg',
    gallery: [
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_0.jpg',
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_1.jpg',
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_2.jpg',
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_3.jpg',
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_5.jpg',
      'https://fireszone.com/wp-content/uploads/2021/02/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87_210212_9.jpg'
    ],
    publishedAt: '2021-02-12'
  },
  {
    id: 1896,
    slug: 'project-asian-marine-services',
    legacySlug: 'โครงการ-อุปกรณ์ไฟอราม',
    type: 'portfolio',
    title: 'โครงการ บริษัท เอเชียน มารีน เซอร์วิสส์ จำกัด',
    excerpt: 'ผลงานติดตั้งและตรวจเช็คระบบอุปกรณ์ไฟอราม บริษัท เอเชียน มารีน เซอร์วิสส์ จำกัด',
    content: '<p>ประมวลภาพการเข้าติดตั้ง ตรวจเช็ค และทดสอบระบบสัญญาณเตือนอัคคีภัย ณ บริษัท เอเชียน มารีน เซอร์วิสส์ จำกัด โดยทีมช่างเทคนิคผู้เชี่ยวชาญ</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/01/Pro-1.jpg',
    gallery: [
      'https://fireszone.com/wp-content/uploads/2021/01/141562653_1840738426103258_2317414679984104631_o.jpg',
      'https://fireszone.com/wp-content/uploads/2021/01/142731819_1840738462769921_1981925840563520749_o.jpg',
      'https://fireszone.com/wp-content/uploads/2021/01/S__455966733.jpg',
      'https://fireszone.com/wp-content/uploads/2021/01/S__455966735.jpg',
      'https://fireszone.com/wp-content/uploads/2021/01/S__455966739.jpg',
      'https://fireszone.com/wp-content/uploads/2021/01/S__455966729.jpg'
    ],
    publishedAt: '2021-01-21'
  },
  {
    id: 1908,
    slug: 'project-condo-ratchada-18',
    legacySlug: 'โครงการ-อุปกรณ์ไฟอราม-6',
    type: 'portfolio',
    title: 'โครงการ คอนโด รัชดา 18',
    excerpt: 'ผลงานติดตั้งและตรวจสอบระบบสัญญาณแจ้งเหตุเพลิงไหม้ อาคารชุดพักอาศัย คอนโด รัชดา 18',
    content: '<p>ผลงานติดตั้ง ตรวจสอบ และบำรุงรักษาระบบสัญญาณเตือนอัคคีภัย (Fire Alarm System) ณ โครงการ คอนโด รัชดา 18 เพื่อความอุ่นใจของผู้อยู่อาศัยทุกยูนิต</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/01/Pro-2.jpg',
    gallery: [
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-6.png',
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-5.png',
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-4.png',
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-3.png',
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-2.png',
      'https://fireszone.com/wp-content/uploads/2021/01/portfolio-1.png'
    ],
    publishedAt: '2021-01-15'
  },
  {
    id: 2870,
    slug: 'project-eklada-hotel-buriram',
    legacySlug: '2870',
    type: 'portfolio',
    title: 'โครงการ โรงแรม เอกลดา บุรีรัมย์',
    excerpt: 'เปลี่ยนตู้ควบคุมไฟอรามใหม่ พร้อมทดสอบระบบแจ้งเหตุเพลิงไหม้ โรงแรม เอกลดา จ.บุรีรัมย์',
    content: '<p>ดำเนินการเปลี่ยนตู้ควบคุมไฟอราม (Fire Alarm Control Panel) ชุดใหม่ พร้อมตรวจเช็คสายสัญญาณและทดสอบการทำงานของอุปกรณ์แจ้งเหตุเพลิงไหม้ ณ โรงแรม เอกลดา จังหวัดบุรีรัมย์</p>',
    image: 'https://fireszone.com/wp-content/uploads/2021/10/Pro-5.jpg',
    gallery: [
      'https://fireszone.com/wp-content/uploads/2021/10/Pro-5.jpg',
      'https://fireszone.com/wp-content/uploads/2021/06/S__304103428.jpg',
      'https://fireszone.com/wp-content/uploads/2021/06/S__304103429.jpg',
      'https://fireszone.com/wp-content/uploads/2021/06/S__304103430.jpg'
    ],
    publishedAt: '2019-06-19'
  },

  // 3 บทความข่าวสารความรู้เกี่ยวกับไฟอราม
  {
    id: 1833,
    slug: 'when-to-replace-smoke-detector',
    legacySlug: 'ข่าว-3',
    type: 'news',
    title: 'จะรู้ได้อย่างไรว่าถึงเวลาเปลี่ยนระบบ Smoke Detector แล้ว',
    excerpt: 'การสูญเสียทั้งชีวิตและทรัพย์สินจากเหตุเพลิงไหม้ในอาคาร 38% เกิดจากไม่มีระบบ Smoke Detector หรือระบบเสื่อมสภาพ',
    content: `<p>สถิติความสูญเสียทั้งชีวิตและทรัพย์สินจากเหตุเพลิงไหม้ในอาคาร พบว่ากว่า 38% เกิดขึ้นในอาคารที่ไม่มีระบบ Smoke Detector และอีก 21% พบว่าอาคารที่เกิดเพลิงไหม้แม้ว่าจะติดตั้งระบบ Smoke Detector ไว้แล้ว แต่เมื่อเกิดเหตุจริงระบบกลับไม่ทำงานเนื่องจากขาดการตรวจเช็คหรืออุปกรณ์หมดอายุการใช้งาน</p>
<p>ความสำคัญของ <strong>Smoke Detector (อุปกรณ์ตรวจจับควันไฟ)</strong> คือการตรวจจับอนุภาคควันไฟตั้งแต่ระยะเริ่มต้นเมื่อเกิดการลุกไหม้บนเชื้อเพลิง เพราะควันไฟจะเป็นสิ่งแรกที่ลอยตัวขึ้นสู่ที่สูงไปกระทบกับเครื่องตรวจจับควันบนเพดานก่อนที่เปลวไฟจะลุกลาม</p>
<p>เมื่ออุปกรณ์ตรวจจับควันทำงาน ระบบส่งสัญญาณแจ้งเหตุเพลิงไหม้ (Signaling Equipment) จะเริ่มส่งเสียงเตือนทันทีเพื่อให้ผู้ที่อยู่ภายในอาคารรับรู้เหตุการณ์ อพยพออกจากพื้นที่ หรือเข้าระงับเหตุเบื้องต้นได้อย่างรวดเร็ว ลดความสูญเสียได้อย่างมหาศาล ดังนั้นจึงควรตรวจเช็คทำความสะอาดเป็นประจำทุกปี และพิจารณาเปลี่ยนหัวตรวจจับเมื่อใช้งานครบอายุมาตรฐาน (ประมาณ 8–10 ปี) หรือเมื่อทดสอบแล้วค่าความไวต่ำกว่าเกณฑ์</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/news-3.png',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/01/smoke-alarm.jpg'],
    publishedAt: '2021-02-04'
  },
  {
    id: 1831,
    slug: 'manual-fire-alarm-types',
    legacySlug: 'ข่าว-2',
    type: 'news',
    title: 'อุปกรณ์แจ้งเหตุด้วยมือ Manual',
    excerpt: 'รู้หรือไม่ อุปกรณ์แจ้งเหตุด้วยมือนั้น มีด้วยกันอยู่ 2 แบบ คือ Manual Pull Station และ Manual Call Point',
    content: `<p>รู้หรือไม่? อุปกรณ์แจ้งเหตุเพลิงไหม้ด้วยมือ (Manual Initiating Device) ที่ติดตั้งตามทางเดินและใกล้บันไดหนีไฟ มีด้วยกันอยู่ 2 รูปแบบหลัก ได้แก่:</p>
<p><strong>1. อุปกรณ์แจ้งเหตุด้วยมือแบบดึงคันโยกลง (Manual Pull Station):</strong> นิยมใช้ตามมาตรฐานอเมริกา (UL / NFPA) ผู้พบเห็นเหตุเพลิงไหม้สามารถดันเข้าและดึงคันโยกลง (Push In / Pull Down) เพื่อส่งสัญญาณแจ้งเตือนไปยังตู้ควบคุมทันที</p>
<p><strong>2. อุปกรณ์แจ้งเหตุด้วยมือแบบกดปุ่ม / ทุบกระจก (Manual Call Point):</strong> นิยมใช้ตามมาตรฐานยุโรปและญี่ปุ่น เมื่อเกิดเหตุให้กดที่แผ่นหน้าหรือกดปุ่มตรงกลางเพื่อส่งสัญญาณแจ้งเหตุ โดยหลายรุ่นสามารถรีเซ็ตกลับมาใช้งานใหม่ได้โดยไม่ต้องเปลี่ยนแผ่นกระจก</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/new-1p.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/01/new-1.jpg'],
    publishedAt: '2021-02-03'
  },
  {
    id: 1818,
    slug: 'explosion-proof-fire-alarm-system',
    legacySlug: 'ข่าว-1',
    type: 'news',
    title: 'Explosion-Proof Fire Alarm System อุปกรณ์ป้องกันการระเบิดในตัว',
    excerpt: 'มาทำความรู้จักกับอุปกรณ์กันระเบิด สำหรับพื้นที่เสี่ยงอันตราย เช่น โรงกลั่นน้ำมัน และคลังสารเคมี',
    content: `<p><strong>Explosion-Proof Fire Alarm System (อุปกรณ์ป้องกันการระเบิดในตัว)</strong> เป็นอุปกรณ์ที่ออกแบบโครงสร้างพิเศษให้เมื่อเกิดประกายไฟหรือการระเบิดขึ้นภายในตัวอุปกรณ์เอง จะไม่มีเปลวไฟหรือประกายไฟเล็ดลอดออกมาสู่ภายนอกได้ จึงไม่กลายเป็นแหล่งจุดติดไฟในบรรยากาศรอบข้าง</p>
<p>อุปกรณ์ประเภทนี้มีความจำเป็นอย่างยิ่งสำหรับติดตั้งในพื้นที่อันตราย (Hazardous Location) ที่มีความเสี่ยงต่อการเกิดการระเบิดจากไอระเหยของสารไวไฟ ก๊าซ หรือฝุ่นผงที่ติดไฟง่าย อาทิ โรงกลั่นน้ำมัน คลังเก็บสารเคมี ห้องพ่นสี โรงงานปิโตรเคมี และคลังเก็บเชื้อเพลิง</p>`,
    image: 'https://fireszone.com/wp-content/uploads/2021/01/new-2p.jpg',
    gallery: ['https://fireszone.com/wp-content/uploads/2021/01/new-2.jpg'],
    publishedAt: '2021-02-03'
  }
]
