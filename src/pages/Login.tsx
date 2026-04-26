import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useT } from '@/i18n';
import { toast } from 'sonner';

export default function Login() {
  const { signIn, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const t = useT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await signIn(form.email, form.password);
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(
        err.message || 'Sign in failed. Please check your credentials.',
      );
    }
  };

  const inp = 'w-full px-4 py-3 rounded-xl text-white text-sm outline-none';
  const inpS = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontFamily: 'Cairo, sans-serif',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-3xl font-black text-white mb-2">
            {t('login_title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t('login_no_account')}{' '}
            <Link
              to="/register"
              style={{ color: '#eab308', textDecoration: 'none' }}
            >
              {t('login_register_link')}
            </Link>
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="rounded-xl p-3 mb-6 text-xs"
            style={{
              background: 'rgba(234,179,8,0.06)',
              border: '1px solid rgba(234,179,8,0.15)',
              display: 'none',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span style={{ color: '#eab308' }}>Admin: </span>
            Use <b style={{ color: '#fff' }}>admin@carrental.com</b> /{' '}
            <b style={{ color: '#fff' }}>Admin@12345</b>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {t('login_email')}
              </label>
              <input
                type="email"
                className={inp}
                style={inpS}
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {t('login_password')}
              </label>
              <input
                type="password"
                className={inp}
                style={inpS}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-black mt-2 disabled:opacity-50 hover:opacity-90 transition-all"
              style={{
                background: 'linear-gradient(135deg, #eab308, #f59e0b)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {isLoading ? t('login_loading') : t('login_submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
