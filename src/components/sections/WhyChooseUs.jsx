import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const strengths = [
  {
    tag: 'Statutory Certification',
    title: 'Dual State Accreditations',
    client: 'Rajasthan & AP State Endorsed',
    desc: 'Special Class IBR Boiler License and Electrical ‘A’ Grade License enabling multi-state heavy industrial execution.',
    image: '/images/generated/hero_industrial_plant.jpg',
  },
  {
    tag: 'Large Scale O&M',
    title: 'Proven 135 MW Unit Mastery',
    client: 'Single-Point Accountability',
    desc: 'Demonstrated single-source O&M stewardship of 1x135 MW thermal power facility (VSLP) with continuous 99%+ availability.',
    image: '/images/generated/power_plant_turbine.jpg',
  },
  {
    tag: 'Certified Technical Fleet',
    title: '1,300+ Skilled Manpower Strength',
    client: 'Deployed Across 6 Industrial States',
    desc: 'BOE-certified power engineers, 6G alloy welders, HT substation technicians, and rigging crews mobilised across India.',
    image: '/images/generated/control_room_scada.jpg',
  },
  {
    tag: 'Quality & Safety Assurance',
    title: 'In-House Advanced NDT Testing',
    client: 'UT · MPI · DP · Radiography',
    desc: 'Dedicated non-destructive testing teams equipped for full weld integrity, flaw detection, and thickness monitoring.',
    image: '/images/generated/boiler_pipeline.jpg',
  },
  {
    tag: 'Regulatory Clearances',
    title: 'CEA & CIEG Statutory Liaison',
    client: 'Chief Electrical Inspectorate Sign-offs',
    desc: 'Rapid regulatory approvals and statutory clearances to commission high-voltage substations with zero commissioning lag.',
    image: '/images/generated/substation_400kv.jpg',
  },
  {
    tag: 'Heavy Infrastructure',
    title: '400 kV Grid Corridors & Substation Erection',
    client: 'Extra-High Voltage Transmission',
    desc: 'Turnkey transformer bay erection, gantry towers, and 24/7 double-circuit transmission line maintenance.',
    image: '/images/generated/transmission_grid.jpg',
  },
];

const lifecycleSteps = [
  {
    num: '01',
    phase: 'System Audit & Baselining',
    desc: 'Comprehensive thermodynamic & vibration analysis to establish operational baseline and benchmark against OEM specs.',
  },
  {
    num: '02',
    phase: 'Preventive & Predictive Scheduling',
    desc: 'Real-time telemetry, thermography, and oil degradation tracking to preempt unplanned outages and equipment wear.',
  },
  {
    num: '03',
    phase: 'Planned Shutdown Execution',
    desc: 'Deployment of specialized 6G welding teams, boiler tube replacement, and turbine rotor overhauls during scheduled turnarounds.',
  },
  {
    num: '04',
    phase: 'Statutory Compliance & Testing',
    desc: 'IBR hydraulic pressure tests, relay calibration, HT insulation resistance testing, and certified CEIG sign-offs.',
  },
  {
    num: '05',
    phase: 'Ramping & Synchronisation',
    desc: 'Precision cold/hot startup protocol, grid synchronization up to 400 kV, and balance-of-plant stabilization.',
  },
  {
    num: '06',
    phase: 'Continuous Reliability Upkeep',
    desc: '24/7 SCADA operational control, routine safety drills, spare parts rationalization, and monthly plant heat-rate reviews.',
  },
];

export default function WhyChooseUs() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section section--why-choose section--dark" id="why-choose-us">
      <div className="container">
        <SectionHeading
          tag="Why Triple E Services"
          title="Engineering Rigour. Certified Credentials. Unbroken Availability."
          text="When critical power infrastructure is on the line, Tier-1 industrial leaders depend on Triple E Services for certified capability and disciplined execution."
          light
          className="sh--editorial"
        />

        {/* Highlight Metrics Grid */}
        <div className="why-metrics-bar">
          <div className="why-metric">
            <span className="why-metric__val">135 MW</span>
            <span className="why-metric__lbl">Plant Unit O&amp;M Proven</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">400 kV</span>
            <span className="why-metric__lbl">Substation &amp; Line Capability</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">1,300+</span>
            <span className="why-metric__lbl">Certified Technical Workforce</span>
          </div>
          <div className="why-metric">
            <span className="why-metric__val">6 States</span>
            <span className="why-metric__lbl">Industrial Footprint Across India</span>
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
            <div className="why-lifecycle__tag">O&amp;M EXECUTION PROTOCOL</div>
            <h3 className="why-lifecycle__title">6-Phase Engineered Maintenance Lifecycle</h3>
            <p className="why-lifecycle__text">
              Our systematic approach guarantees plant safety, regulatory compliance, and thermal heat-rate efficiency from audit to continuous baseload operations.
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
                Phase {lifecycleSteps[activeStep].num}
              </div>
              <h4 className="why-lifecycle__panel-title">
                {lifecycleSteps[activeStep].phase}
              </h4>
              <p className="why-lifecycle__panel-desc">
                {lifecycleSteps[activeStep].desc}
              </p>
              <div className="why-lifecycle__panel-checklist">
                <span><CheckCircle2 size={16} /> Certified BOE Protocol</span>
                <span><CheckCircle2 size={16} /> Zero Safety Incidents</span>
                <span><CheckCircle2 size={16} /> Documented Quality Traceability</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
