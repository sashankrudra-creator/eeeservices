import { Link } from 'react-router-dom';
import Marquee from '../ui/Marquee';
import { clients } from '../../data/clients';

export default function TopClientTicker() {
  return (
    <div className="top-client-ticker" aria-label="Our Esteemed Clients Ticker">
      <div className="top-client-ticker__label">
        <span className="top-client-ticker__dot" aria-hidden="true" />
        <span className="top-client-ticker__tag">OUR CLIENTS</span>
      </div>
      <div className="top-client-ticker__track">
        <Marquee speed={48}>
          {clients.map((c) => (
            <Link
              key={c.name}
              to="/clients"
              className="top-client-ticker__item"
              title={`${c.name} (${c.industry})`}
            >
              {c.logo ? (
                <span className="top-client-ticker__logo-wrap">
                  <img src={c.logo} alt="" className="top-client-ticker__logo" loading="lazy" />
                </span>
              ) : (
                <span className="top-client-ticker__monogram" aria-hidden="true">
                  {c.name.charAt(0)}
                </span>
              )}
              <span className="top-client-ticker__name">{c.name}</span>
              <span className="top-client-ticker__sep" aria-hidden="true">•</span>
            </Link>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
