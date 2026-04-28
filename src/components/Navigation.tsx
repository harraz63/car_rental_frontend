import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLangStore, useT } from '@/i18n';
import { toast } from 'sonner';

export default function Navigation() {
  const { user, signOut } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <nav className="relative z-50 w-full" style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(234,179,8,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.5px' }}>Car</span>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: '1.5rem', background: 'linear-gradient(135deg, #eab308, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>4U</span>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', marginTop: '4px' }}></div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/cars" active={isActive('/cars')}>{t('nav_rent_car')}</NavLink>
            <NavLink to="/list-car" active={isActive('/list-car')}>{t('nav_list_car')}</NavLink>
            <NavLink to="/terms" active={isActive('/terms')}>{t('nav_terms')}</NavLink>
            {user && (
              <>
                {user.role === 'admin' && <NavLink to="/dashboard" active={isActive('/dashboard')}>{t('nav_dashboard')}</NavLink>}
                {user.role === 'owner' && <NavLink to="/my-listings" active={isActive('/my-listings')}>{t('nav_my_listings')}</NavLink>}
                {user.role === 'user' && <NavLink to="/dashboard" active={isActive('/dashboard')}>{t('nav_my_bookings')}</NavLink>}
              </>
            )}
          </div>

          {/* Auth Buttons + Language Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* ── Language toggle button ── */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                border: '1px solid rgba(234,179,8,0.3)',
                color: '#eab308',
                fontFamily: 'Cairo, sans-serif',
                letterSpacing: '0.05em',
              }}
              title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              {lang === 'en' ? '🇪🇬 AR' : '🇺🇸 EN'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Cairo, sans-serif' }}>
                  {user.full_name}
                  {user.role === 'admin' && <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)' }}>Admin</span>}
                  {user.role === 'owner' && <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>Owner</span>}
                </div>
                <button onClick={handleSignOut} className="px-4 py-2 text-sm rounded-lg transition-all" style={{ border: '1px solid rgba(234,179,8,0.3)', color: '#eab308', fontFamily: 'Cairo, sans-serif' }}>
                  {t('nav_sign_out')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif' }}>{t('nav_sign_in')}</Link>
                <Link to="/register" className="px-4 py-2 text-sm rounded-lg font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', color: '#000', fontFamily: 'Cairo, sans-serif' }}>{t('nav_register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#fff' }}>
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(234,179,8,0.1)' }}>
          <MobileLink to="/cars" onClick={() => setMenuOpen(false)}>{t('nav_rent_car')}</MobileLink>
          <MobileLink to="/list-car" onClick={() => setMenuOpen(false)}>{t('nav_list_car')}</MobileLink>
          <MobileLink to="/terms" onClick={() => setMenuOpen(false)}>{t('nav_terms')}</MobileLink>
          {user && user.role === 'admin' && <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>{t('nav_dashboard')}</MobileLink>}
          {user && user.role === 'owner' && <MobileLink to="/my-listings" onClick={() => setMenuOpen(false)}>{t('nav_my_listings')}</MobileLink>}
          {user && user.role === 'user' && <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>{t('nav_my_bookings')}</MobileLink>}
          {/* Language toggle in mobile menu */}
          <button
            onClick={() => { toggleLang(); setMenuOpen(false); }}
            className="text-left py-2 text-sm"
            style={{ color: '#eab308', fontFamily: 'Cairo, sans-serif', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {lang === 'en' ? '🇪🇬 العربية' : '🇺🇸 English'}
          </button>
          {user ? (
            <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-left py-2 text-sm" style={{ color: '#eab308', fontFamily: 'Cairo, sans-serif' }}>{t('nav_sign_out')}</button>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>{t('nav_sign_in')}</MobileLink>
              <MobileLink to="/register" onClick={() => setMenuOpen(false)}>{t('nav_register')}</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link to={to} className="px-4 py-2 text-sm rounded-lg transition-all" style={{ color: active ? '#eab308' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(234,179,8,0.1)' : 'transparent', fontFamily: 'Cairo, sans-serif', fontWeight: active ? 600 : 400, border: active ? '1px solid rgba(234,179,8,0.2)' : '1px solid transparent' }}>
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="py-2 text-sm border-b" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.05)', fontFamily: 'Cairo, sans-serif' }}>
      {children}
    </Link>
  );
}
