'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const supabase = createBrowserSupabaseClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('');

  // Check for auth callback error or redirects
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'auth_callback_error') {
      setStatus('Error: Authentication failed. Please try again.');
    }
  }, [searchParams]);

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    // Enforce @memphis.edu email
    if (!email.trim().toLowerCase().endsWith('@memphis.edu')) {
      setStatus('Error: Only @memphis.edu email addresses are allowed.');
      return;
    }

    setLoading(true);

    const redirectTo =
      (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/auth/callback';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);

    if (error) {
      setStatus('Error: ' + error.message);
      return;
    }

    setStatus('✅ Code sent! Check your inbox (and spam folder).');
    setStep('otp');
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email',
    });

    setLoading(false);

    if (error) {
      setStatus('Error: ' + error.message);
      return;
    }

    if (data.session) {
      const redirect = searchParams.get('redirect') || '/feed';
      router.push(redirect);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container animate-slide-up">
        {/* UofM Brand Header */}
        <div className="login-header">
          <div className="login-logo">🐯</div>
          <h1 className="login-title">TigerSwap</h1>
          <p className="login-subtitle">University of Memphis Marketplace</p>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span className="login-divider-text">
            {step === 'email' ? 'Sign in with your UofM email' : 'Enter login code'}
          </span>
        </div>

        {/* Form State machine */}
        {step === 'email' ? (
          <form onSubmit={onSendCode} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@memphis.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoComplete="email"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary login-btn">
              {loading ? (
                <span className="login-spinner">⏳</span>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Send Login Code
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="login-form animate-fade-in">
            <p style={{ fontSize: 14, color: 'var(--foreground-secondary)', marginBottom: 8, textAlign: 'center' }}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <div className="login-field">
              <label htmlFor="otpCode" className="label" style={{ textAlign: 'center' }}>
                6-Digit Login Code
              </label>
              <input
                id="otpCode"
                type="text"
                required
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="input"
                style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.2em', fontWeight: 'bold' }}
                autoComplete="one-time-code"
              />
            </div>

            <button type="submit" disabled={loading || otpCode.length !== 6} className="btn btn-primary login-btn">
              {loading ? (
                <span className="login-spinner">⏳</span>
              ) : (
                'Verify & Log In'
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary login-btn"
              style={{ marginTop: 8 }}
              onClick={() => {
                setStep('email');
                setStatus(null);
                setOtpCode('');
              }}
            >
              Back to Email
            </button>
          </form>
        )}

        {/* Status messages */}
        {status && (
          <div
            className={`login-status ${status.startsWith('Error') ? 'login-status-error' : 'login-status-success'}`}
          >
            {status}
          </div>
        )}

        {/* Footer */}
        {step === 'email' && (
           <p className="login-footer">
             Only <strong>@memphis.edu</strong> emails are accepted.
             <br />
             We&apos;ll send you a secure login code via email.
           </p>
        )}
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(
            160deg,
            var(--background) 0%,
            #0d1220 40%,
            #0a1535 70%,
            var(--tiger-blue-dark) 100%
          );
        }
        .login-container {
          width: 100%;
          max-width: 400px;
          background: var(--background-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 40px 32px;
          box-shadow: var(--shadow-lg);
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-logo {
          font-size: 56px;
          margin-bottom: 12px;
          line-height: 1;
        }
        .login-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 6px 0;
          background: linear-gradient(135deg, #fff, var(--mynders-gray));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .login-subtitle {
          font-size: 14px;
          color: var(--foreground-secondary);
          margin: 0;
        }
        .login-divider {
          position: relative;
          text-align: center;
          margin-bottom: 24px;
        }
        .login-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--border);
        }
        .login-divider-text {
          position: relative;
          background: var(--background-card);
          padding: 0 12px;
          font-size: 12px;
          color: var(--foreground-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          margin-top: 4px;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-spinner {
          font-size: 18px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-status {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          line-height: 1.5;
        }
        .login-status-success {
          background: rgba(0, 196, 140, 0.1);
          border: 1px solid rgba(0, 196, 140, 0.2);
          color: var(--success);
        }
        .login-status-error {
          background: rgba(255, 77, 106, 0.1);
          border: 1px solid rgba(255, 77, 106, 0.2);
          color: var(--danger);
        }
        .login-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: var(--foreground-muted);
          line-height: 1.6;
        }
        .login-footer strong {
          color: var(--foreground-secondary);
        }
      `}</style>
    </main>
  );
}
