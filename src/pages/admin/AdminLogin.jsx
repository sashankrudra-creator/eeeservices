import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import { authMessage, sendReset, signIn } from '../../services/authService';
import { isFirebaseConfigured } from '../../lib/firebase';

export default function AdminLogin() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setInfo('');
    if (!email.trim() || (mode === 'signin' && !password)) {
      setError(mode === 'signin' ? 'Enter your email and password.' : 'Enter your email address.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password, remember);
        // The auth listener in AdminApp takes over from here.
      } else {
        await sendReset(email).catch(() => {}); // never reveal whether the account exists
        setInfo('If that address belongs to an administrator, a password reset email is on its way.');
      }
    } catch (err) {
      setError(authMessage(err));
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  return (
    <div className="adm adm--center">
      <form className="adm-card form" onSubmit={submit} noValidate>
        <Logo />
        <h1><Lock size={20} aria-hidden="true" /> {mode === 'signin' ? 'Admin sign in' : 'Reset password'}</h1>
        <p className="adm-small">{mode === 'signin' ? 'Advertisement manager for Triple E Services. Authorised administrators only.' : 'We will email you a link to choose a new password.'}</p>

        <div className="field">
          <label htmlFor="adm-email">Email</label>
          <input id="adm-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>

        {mode === 'signin' && (
          <>
            <div className="field">
              <label htmlFor="adm-pass">Password</label>
              <div className="adm-pass">
                <input id="adm-pass" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="icon-btn icon-btn--sm" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label className="adm-check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Keep me signed in on this device
            </label>
          </>
        )}

        {error && <p className="field__err" role="alert">{error}</p>}
        {info && <p className="adm-ok" role="status">{info}</p>}

        <Button type="submit" disabled={busy} icon={busy ? <Loader2 size={16} className="spin" aria-hidden="true" /> : null}>
          {mode === 'signin' ? 'Sign in' : 'Send reset link'}
        </Button>

        {!isFirebaseConfigured && mode === 'signin' && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn('admin@triple-e.test', 'demo', true)}
              style={{ marginTop: '8px' }}
            >
              Sign in as Demo Admin
            </Button>
            <p className="adm-small" style={{ textAlign: 'center', marginTop: '6px' }}>
              💡 Running in preview mode. Click above or enter any email to manage ads.
            </p>
          </>
        )}

        <div className="adm-links">
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'signin' ? 'reset' : 'signin'); setError(''); setInfo(''); }}>
            {mode === 'signin' ? 'Forgot password?' : 'Back to sign in'}
          </button>
          <Link to="/" className="link-btn">Back to website</Link>
        </div>
      </form>
    </div>
  );
}
