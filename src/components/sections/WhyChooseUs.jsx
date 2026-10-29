import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { maintenanceSteps, safetyChips } from '../../data/capabilities';

// Every line below is taken from src/data (company profile).
const strengths = [
  {
    tag: 'Licensed & certified',
    title: "IBR, Electrical 'A' Grade & ISO Certified",
    client: 'Statutory Licences · ISO 9001, 14001 & 45001',
    desc: 'Special Class IBR licence, Electrical "A" Grade licence (all voltages) endorsed by AP state, and ISO certified quality, environmental & safety management systems.',
    image: '/images/generated/hero_industrial_plant.jpg',
  },
  {
    tag: 'Power plant O&M',
    title: '1x135 MW Power Plant O&M',
    client: 'VSLP · Rajasthan · Since Oct 2018',
    desc: 'Operation and maintenance of a 1x135 MW power plant, continuing since October 2018. Also: 135 MW (Harbin make) generator repair work in 2019.',
    image: '/images/generated/power_plant_turbine.jpg',
  },
  {
    tag: 'Manpower',
    title: '1,343 Manpower Across 6 States',
    client: '1,003 on permanent rolls',
    desc: 'A further call pool is tied up within each state so customer requirements can be met within the shortest time.',
    image: '/images/generated/control_room_scada.jpg',
  },
  {
    tag: 'Quality & Diagnostics',
    title: 'In-house Qualified NDT & Drone Thermography',
    client: 'UT · MPI · DP · Radiography · Drone Thermography',
    desc: 'Ultrasonic, MPI, dye penetrant, radiography and aerial drone thermography audits for zero-outage hot line inspections.',
    image: '/images/drone-thermography.jpg',
  },
  {
    tag: 'Statutory liaison',
    title: 'Electrical & Boiler Approvals',
    client: 'IBR · CIEG · PCB · CEA',
    desc: 'Liaisoning of electrical and boiler jobs: IBR, CIEG and PCB approvals, drawing approvals and CEA.',
    image: '/images/generated/substation_400kv.jpg',
  },
  {
    tag: 'Ramp-up capability',
    title: '600–700 Resources in a Single Instance',
    client: 'Revamp & restoration · 2019',
    desc: 'About 600–700 gang resources were mobilised across multiple locations on two occasions in 2019 for revamp and restoration work.',
    image: '/images/generated/transmission_grid.jpg',
  },
];

const lifecycleSteps = maintenanceSteps.map((m, i) => ({ num: String(i + 1).padStart(2, '0'), phase: m.title, desc: m.text }));

export default function WhyChooseUs() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section section--why-choose section--dark" id="why-choose-us">
      <div className="container">
        <SectionHeading
          tag="Why Triple E Services"
          title="Licensed, experienced and ready to mobilise."
          text="Statutory licences, senior engineers with decades of plant experience, and manpower on rolls across six states."
          light
          className="sh--editorial"
        />

        {/* Highlight Metrics Grid */}
        <div className="why-metrics-bar">
          <div className="why-metric">
            <span className="why-metric__val">135 MW</span>
            <span className="why-metric__lbl">Power plant O&amp;M</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">400 kV</span>
            <span className="why-metric__lbl">Transmission line O&amp;M</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">1,343</span>
            <span className="why-metric__lbl">Total manpower</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">6 States</span>
            <span className="why-metric__lbl">States with manpower &amp; sites</span>
          </div>
        </div>

        {/* Core Strengths in Reference Card Format */}
        <div className="ref-cards-grid ref-cards-grid--3" style={{ marginBottom: '60px' }}>
          {strengths.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.08} className="ref-card">
              <div className="ref-card__bg">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="ref-card__gradient" />
              </div>

              <div className="ref-card__top">
                <span className="ref-card__pill">{item.tag}</span>
              </div>

              <div className="ref-card__bottom">
                <div className="ref-card__info">
                  <span className="ref-card__client">{item.client}</span>
                  <h3 className="ref-card__title">{item.title}</h3>
                  <p className="ref-card__desc">{item.desc}</p>
                </div>

                <div className="ref-card__action-btn" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Maintenance Lifecycle Stepper */}
        <div className="why-lifecycle">
          <div className="why-lifecycle__header">
            <div className="why-lifecycle__tag">MAINTENANCE APPROACH</div>
            <h3 className="why-lifecycle__title">A structured methodology, end to end</h3>
            <p className="why-lifecycle__text">
              Our maintenance planning focuses on identifying potential failures at an early stage, keeping critical equipment healthy and reducing forced outages.
            </p>
          </div>

          <div className="why-lifecycle__rail">
            {lifecycleSteps.map((step, idx) => (
              <button
                key={step.num}
                type="button"
                className={`why-lifecycle__tab ${idx === activeStep ? 'is-active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <span className="why-lifecycle__tab-num">{step.num}</span>
                <span className="why-lifecycle__tab-name">{step.phase}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              className="why-lifecycle__panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="why-lifecycle__panel-badge">
                Step {lifecycleSteps[activeStep].num}
              </div>
              <h4 className="why-lifecycle__panel-title">
                {lifecycleSteps[activeStep].phase}
              </h4>
              <p className="why-lifecycle__panel-desc">
                {lifecycleSteps[activeStep].desc}
              </p>
              <div className="why-lifecycle__panel-checklist">
                {safetyChips.slice(0, 3).map((c) => (
                  <span key={c}><CheckCircle2 size={16} /> {c}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
