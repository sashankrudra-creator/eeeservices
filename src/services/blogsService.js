// Firestore + Cloud Storage access for blogs / articles.
// Collection: blogs/{blogId}   Images: blogs/<file> in the default storage bucket.
// Public visitors can only read published blogs; every write requires an admin.

import { isFirebaseConfigured, loadFirestore, loadFirestoreLite, loadStorage } from '../lib/firebase';

const COLLECTION = 'blogs';
const DEMO_BLOGS_KEY = 'triplee_demo_blogs';
const demoSubscribers = new Set();
const ms = (t) => (t && typeof t.toMillis === 'function' ? t.toMillis() : null);

function getInitialDemoBlogs() {
  const now = Date.now();
  return [
    {
      id: 'bed-coil-overhaul-guide',
      slug: 'afbc-boiler-bed-coil-overhaul-guide',
      title: 'AFBC Boiler Bed Coil Overhauling: Proven Engineering Practices to Prevent Tube Failures',
      category: 'Boiler Engineering',
      author: 'VP Chandra Sekhar & Engineering Team',
      date: '15 Oct 2026',
      readTime: '6 min read',
      published: true,
      imageUrl: '/images/ai/boiler-overhaul.jpg',
      imagePath: '',
      excerpt: 'How precision tube bending, IBR 6G alloy welding, hydrostatic stress testing, and proactive erosion profiling extend AFBC bed coil lifespan in thermal power plants.',
      content: `### The Challenge of In-Bed Tube Erosion in AFBC Boilers

Fluidised bed combustion (AFBC) boilers operate under extreme thermo-mechanical conditions. The bed material—typically refractory sand or bed ash fluidised by high-velocity primary air—creates an intense abrasive environment for immersed evaporator tubes (bed coils). 

Without scheduled inspection and specialised revamp protocols, localized erosion can rapidly reduce tube wall thickness below minimum allowable design limits, causing abrupt forced outages and severe operational losses.

### Key Factors in Bed Coil Overhaul and Replacement

At Triple E Services, our Special Class IBR certified engineering team employs a strict 5-stage revamp protocol during plant turnarounds:

1. **Precision Ultrasonic Thickness (UT) Gauging:** Comprehensive ultrasonic mapping across all bends, straight runs, and welds to locate critical erosion zones.
2. **IBR 6G Qualified Alloy Welding:** Using certified high-alloy seamless steel tubes (SA 213 T11 / T22) welded exclusively by IBR-recognized welders.
3. **Refractory Armor Studding & Shielding:** Fitting erosion-resistant stainless steel protection shields on high-wear lead tubes to deflect abrasive bed particles.
4. **Hydraulic Stress Testing:** Cold hydrostatic pressure testing at 1.5x design pressure witnessed by statutory IBR boiler inspectors.
5. **Cold Air Velocity Profiling:** Validating uniform bed fluidisation across the air nozzle plenum prior to light-up.

### Conclusion

Proactive maintenance by a certified agency not only protects plant uptime but guarantees full regulatory compliance under Indian Boiler Regulations (IBR).`,
      createdAt: now - 86400000 * 12,
      updatedAt: now - 86400000 * 12,
    },
    {
      id: 'solar-epc-pr-optimization',
      slug: 'maximizing-pr-in-utility-solar-epc',
      title: 'Maximizing Generation PR in Utility-Scale Solar EPC and Long-Term O&M Contracts',
      category: 'Solar Energy',
      author: 'Solar EPC Division',
      date: '28 Sep 2026',
      readTime: '5 min read',
      published: true,
      imageUrl: '/images/ai/solar-epc.jpg',
      imagePath: '',
      excerpt: 'Key design and maintenance strategies to maintain a Performance Ratio (PR) above 82% in utility and rooftop solar power plants across challenging industrial climates.',
      content: `### Understanding Solar Performance Ratio (PR)

The Performance Ratio (PR) is the ultimate benchmark of a solar power plant's health. It reflects the percentage of available solar irradiation that is successfully converted into exportable AC energy after accounting for thermal losses, soiling, inverter clipping, and grid curtailment.

### Critical Engineering Practices for High PR

Triple E Services manages solar installations ranging from industrial rooftop units to 1.65 MWp utility arrays with performance commitments:

* **Automated & Scheduled Module Cleaning:** Soiling accounts for up to 12% generation loss in dusty industrial corridors. Scheduled cyclical wet cleaning and dry brush cycles preserve irradiance capture.
* **String-Level SCADA Monitoring:** Real-time analytics pinpoint individual combiner box anomalies, blown fuses, and string open-circuits before daily output is compromised.
* **Periodic Thermography Audits:** Aerial and handheld FLIR infrared scans identify micro-cracks, bypass diode failures, and hot spots.
* **Switchyard & Transformer Maintenance:** Maintaining clean bushings, optimal transformer oil breakdown voltage (BDV), and low earth pit resistance guarantees zero bottleneck evacuation.`,
      createdAt: now - 86400000 * 29,
      updatedAt: now - 86400000 * 29,
    },
    {
      id: 'transmission-line-maintenance-400kv',
      slug: 'safety-and-reliability-in-400kv-transmission-maintenance',
      title: 'Safety, Thermography, and Zero-Outage Maintenance on 400 kV Quad Transmission Lines',
      category: 'Transmission & Substations',
      author: 'High Voltage Electrical Division',
      date: '10 Sep 2026',
      readTime: '7 min read',
      published: true,
      imageUrl: '/images/ai/transmission-line.jpg',
      imagePath: '',
      excerpt: 'Inside the inspection protocols, tower line patrolling, insulator washing, and emergency restoration procedures for double circuit 400 kV extra-high-voltage corridors.',
      content: `### The Criticality of 400 kV Evacuation

Extra-high-voltage (EHV) transmission corridors—such as the 27 km 400 kV double circuit quad line stewardship we manage for JSW-MPCL—form the lifeblood of national grid connectivity. Any tripping can cause millions in cascading penalties and severe plant curtailment.

### Routine and Breakdown Protocols

Our Electrical 'A' Grade licensed teams implement rigorous preventative schedules:

1. **Foot Patrols & Tower Integrity Audits:** Continuous right-of-way (ROW) clearance, foundation corrosion inspection, and tower footing resistance measurements.
2. **Corona & Infrared Thermography:** Detecting high-resistance joints, loose jumper clamps, and deteriorated insulator discs while lines remain energised.
3. **Puncture Insulator Replacement:** Utilizing tested hot-line and cold-line rigging equipment for rapid insulator disc exchange during scheduled outages.
4. **Emergency Restoration Systems (ERS):** Rapid-deployment tower structures to bypass fallen towers within 48 hours of natural calamity or mechanical failure.`,
      createdAt: now - 86400000 * 47,
      updatedAt: now - 86400000 * 47,
    },
    {
      id: 'ci-instrumentation-automation-guide',
      slug: 'instruments-supply-and-ci-calibration-guide',
      title: 'The Vital Role of Precision C&I Instrumentation in Modern Industrial Plant Stewardship',
      category: 'Instrumentation & Automation',
      author: 'C&I Automation Division',
      date: '22 Aug 2026',
      readTime: '5 min read',
      published: true,
      imageUrl: '/images/ai/ci-automation.jpg',
      imagePath: '',
      excerpt: 'From transmitter calibration to control valve overhaul and DCS loop testing: how calibrated process instrumentation safeguards boiler and turbine efficiency.',
      content: `### Control & Instrumentation: The Senses of the Plant

Modern thermal, chemical, and distillery plants depend entirely on real-time sensory feedback. If a pressure transmitter drifts by 2% or a drum level sensor exhibits signal lag, the entire boiler protection interlock system is jeopardized.

### Our C&I Capabilities

Triple E Services provides end-to-end field instruments supply, erection, testing, calibration, and AMC:

* **Field Instrument Supply:** Sourcing high-precision transmitters (Rosemount, Yokogawa, ABB), magnetic flowmeters, thermocouples (K, R, S-type), RTDs (Pt100), and pressure switches.
* **Control Valve Servicing & Lapping:** Pneumatic actuator overhauls, gland packing, trim replacement, and SMART positioner auto-tuning.
* **Loop Checking & DCS Commissioning:** End-to-end signal validation from field junction boxes to marshaling cabinets and operator console displays.
* **Calibration with Traceable Standards:** Digital pressure calibrators, temperature bath wells, and mA source simulators with national traceability certificates.`,
      createdAt: now - 86400000 * 66,
      updatedAt: now - 86400000 * 66,
    },
  ];
}

const AI_IMAGE_MAP = {
  'bed-coil-overhaul-guide': '/images/ai/boiler-overhaul.jpg',
  'solar-epc-pr-optimization': '/images/ai/solar-epc.jpg',
  'transmission-line-maintenance-400kv': '/images/ai/transmission-line.jpg',
  'ci-instrumentation-automation-guide': '/images/ai/ci-automation.jpg',
};

function readDemoBlogs() {
  try {
    const raw = localStorage.getItem(DEMO_BLOGS_KEY);
    let items;
    if (!raw) {
      items = getInitialDemoBlogs();
      localStorage.setItem(DEMO_BLOGS_KEY, JSON.stringify(items));
    } else {
      items = JSON.parse(raw);
    }
    return items.map((b) => {
      const img = AI_IMAGE_MAP[b.id] || b.imageUrl || b.coverImage || '/images/ai/boiler-overhaul.jpg';
      return {
        ...b,
        imageUrl: img,
        coverImage: img,
      };
    });
  } catch {
    return getInitialDemoBlogs();
  }
}

function writeDemoBlogs(blogs) {
  try {
    localStorage.setItem(DEMO_BLOGS_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.warn('Could not save demo blogs to localStorage', err);
  }
  for (const fn of demoSubscribers) {
    try { fn(blogs); } catch {}
  }
}

function subscribeDemo(fn) {
  demoSubscribers.add(fn);
  fn(readDemoBlogs());
  return () => demoSubscribers.delete(fn);
}

function docToBlog(id, d) {
  const img = AI_IMAGE_MAP[id] || d.imageUrl || d.coverImage || '/images/ai/boiler-overhaul.jpg';
  return {
    id,
    slug: d.slug || id,
    title: d.title || '',
    category: d.category || 'General',
    author: d.author || 'Triple E Team',
    date: d.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: d.readTime || '5 min read',
    published: d.published !== false,
    imageUrl: img,
    coverImage: img,
    imagePath: d.imagePath || '',
    excerpt: d.excerpt || '',
    content: d.content || '',
    createdAt: ms(d.createdAt) || Date.now(),
    updatedAt: ms(d.updatedAt) || Date.now(),
  };
}

/* ---------- Public: Watch live (published) blogs ---------- */
export function watchLiveBlogs(onData, onError) {
  if (!isFirebaseConfigured) {
    return subscribeDemo((all) => onData(all.filter((b) => b.published)));
  }

  let unsubscribe = () => {};
  let cancelled = false;

  loadFirestore()
    .then((fs) => {
      if (cancelled) return;
      const { collection, onSnapshot, query, where, orderBy } = fs;
      const db = fs.getFirestore();
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
      unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list = snap.docs.map((doc) => docToBlog(doc.id, doc.data()));
          onData(list);
        },
        (err) => {
          console.warn('Falling back to local demo blogs:', err);
          subscribeDemo((all) => onData(all.filter((b) => b.published)));
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
      subscribeDemo((all) => onData(all.filter((b) => b.published)));
    });

  return () => {
    cancelled = true;
    unsubscribe();
  };
}

/* ---------- Fetch published blogs once ---------- */
export async function getPublishedBlogs() {
  if (!isFirebaseConfigured) {
    return readDemoBlogs().filter((b) => b.published);
  }
  try {
    const fs = await loadFirestoreLite();
    const db = fs.getFirestore();
    const q = fs.query(
      fs.collection(db, COLLECTION),
      fs.where('published', '==', true),
      fs.orderBy('createdAt', 'desc')
    );
    const snap = await fs.getDocs(q);
    return snap.docs.map((d) => docToBlog(d.id, d.data()));
  } catch (err) {
    console.warn('Failed to fetch published blogs, falling back to local:', err);
    return readDemoBlogs().filter((b) => b.published);
  }
}

/* ---------- Admin: Watch ALL blogs (drafts + published) ---------- */
export function watchAllBlogs(onData, onError) {
  if (!isFirebaseConfigured) {
    return subscribeDemo((all) => onData(all));
  }

  let unsubscribe = () => {};
  let cancelled = false;

  loadFirestore()
    .then((fs) => {
      if (cancelled) return;
      const { collection, onSnapshot, query, orderBy } = fs;
      const db = fs.getFirestore();
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list = snap.docs.map((doc) => docToBlog(doc.id, doc.data()));
          onData(list);
        },
        (err) => {
          console.warn('Falling back to local demo blogs for admin:', err);
          subscribeDemo(onData);
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
      subscribeDemo(onData);
    });

  return () => {
    cancelled = true;
    unsubscribe();
  };
}

/* ---------- Save Blog (Create or Update) ---------- */
export async function saveBlog(blogData, file) {
  let { id, ...data } = blogData;
  const now = Date.now();

  // If a new cover image file is chosen, upload to Storage or convert to DataURL
  if (file) {
    let uploaded = false;
    if (isFirebaseConfigured) {
      try {
        const storageModule = await loadStorage();
        const storage = storageModule.getStorage();
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const path = `blogs/${safeName}`;
        const fileRef = storageModule.ref(storage, path);
        const uploadTask = storageModule.uploadBytes(fileRef, file, { contentType: file.type });
        const timeoutTask = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
        await Promise.race([uploadTask, timeoutTask]);
        const downloadUrl = await storageModule.getDownloadURL(fileRef);
        data.imageUrl = downloadUrl;
        data.imagePath = path;
        uploaded = true;
      } catch (err) {
        console.warn('Storage upload unavailable, falling back to data URL:', err);
      }
    }
    if (!uploaded) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          data.imageUrl = e.target.result;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  if (!isFirebaseConfigured) {
    const all = readDemoBlogs();
    if (id) {
      const idx = all.findIndex((b) => b.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...data, updatedAt: now };
      } else {
        all.unshift({ id, ...data, createdAt: now, updatedAt: now });
      }
    } else {
      id = `demo-blog-${Date.now()}`;
      all.unshift({ id, ...data, createdAt: now, updatedAt: now });
    }
    writeDemoBlogs(all);
    return id;
  }

  const fs = await loadFirestore();
  const db = fs.getFirestore();
  const payload = {
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: data.title.trim(),
    category: data.category.trim() || 'General',
    author: data.author.trim() || 'Triple E Team',
    date: data.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: data.readTime || '5 min read',
    published: Boolean(data.published),
    imageUrl: data.imageUrl || '',
    imagePath: data.imagePath || '',
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    updatedAt: fs.serverTimestamp(),
  };

  if (id) {
    await fs.updateDoc(fs.doc(db, COLLECTION, id), payload);
    return id;
  } else {
    payload.createdAt = fs.serverTimestamp();
    const docRef = await fs.addDoc(fs.collection(db, COLLECTION), payload);
    return docRef.id;
  }
}

/* ---------- Delete Blog ---------- */
export async function deleteBlog(id, imagePath) {
  if (!isFirebaseConfigured) {
    const all = readDemoBlogs().filter((b) => b.id !== id);
    writeDemoBlogs(all);
    return;
  }

  // Delete image from storage if path exists
  if (imagePath) {
    try {
      const storageModule = await loadStorage();
      const storage = storageModule.getStorage();
      await storageModule.deleteObject(storageModule.ref(storage, imagePath));
    } catch {}
  }

  const fs = await loadFirestore();
  const db = fs.getFirestore();
  await fs.deleteDoc(fs.doc(db, COLLECTION, id));
}

/* ---------- Toggle Publish Status ---------- */
export async function toggleBlogPublish(id, currentPublished) {
  if (!isFirebaseConfigured) {
    const all = readDemoBlogs();
    const item = all.find((b) => b.id === id);
    if (item) {
      item.published = !currentPublished;
      item.updatedAt = Date.now();
      writeDemoBlogs(all);
    }
    return;
  }

  const fs = await loadFirestore();
  const db = fs.getFirestore();
  await fs.updateDoc(fs.doc(db, COLLECTION, id), {
    published: !currentPublished,
    updatedAt: fs.serverTimestamp(),
  });
}
