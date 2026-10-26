import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, LogOut, ShieldAlert } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { isFirebaseConfigured } from '../../lib/firebase';
import { checkIsAdmin, signOutAdmin, watchAuth } from '../../services/authService';
import './admin.css';

function Shell({ children }) {
  return (
    <div className="adm adm--center">
      <div className="adm-card">
        <Logo />
        {children}
      </div>
    </div>
  );
}

// Keeps the admin page out of search engines.
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default function AdminApp() {
  useDocumentTitle('Admin');
  useNoIndex();
  const [auth, setAuth] = useState({ status: 'loading', user: null });

  useEffect(() => {
    let alive = true;
    const stop = watchAuth(
      async (user) => {
        if (!alive) return;
        if (!user) { setAuth({ status: 'signedOut', user: null }); return; }
        setAuth({ status: 'checking', user });
        const ok = await checkIsAdmin(user.uid);
        if (alive) setAuth({ status: ok ? 'ready' : 'denied', user });
      },
      () => alive && setAuth({ status: 'error', user: null })
    );
    return () => { alive = false; stop(); };
  }, []);

  switch (auth.status) {
    case 'loading':
    case 'checking':
      return (
        <Shell>
          <p className="adm-wait" role="status"><Loader2 size={18} className="spin" aria-hidden="true" /> Checking your access…</p>
        </Shell>
      );
    case 'error':
      return (
        <Shell>
          <h1>Could not reach Firebase</h1>
          <p>Check your internet connection and the Firebase settings, then reload the page.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </Shell>
      );
    case 'signedOut':
      return <AdminLogin />;
    case 'denied':
      return (
        <Shell>
          <h1><ShieldAlert size={22} aria-hidden="true" /> No admin access</h1>
          <p>You are signed in as <strong>{auth.user.email}</strong>, but this account is not an administrator for the advertisement manager.</p>
          <p className="adm-small">If you own the site, add this account ID to the <code>admins</code> collection in Firestore:</p>
          <code className="adm-code">{auth.user.uid}</code>
          <Button variant="outline" icon={<LogOut size={16} aria-hidden="true" />} onClick={signOutAdmin}>Sign out</Button>
        </Shell>
      );
    default:
      return <AdminDashboard user={auth.user} />;
  }
}
