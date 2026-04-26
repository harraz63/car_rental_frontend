import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarStore } from '@/store/carStore';
import { useT } from '@/i18n';

export default function Home() {
  const { cars, fetchCars } = useCarStore();
  const t = useT();

  useEffect(() => { fetchCars(); }, []);

  const featured = cars.slice(0, 3);

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(234,179,8,0.08) 0%, transparent 70%)' }}></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#eab308' }}>
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            {t('home_badge')}
          </div>

          <h1 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff' }}>
            {t('home_hero_title1')}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('home_hero_title2')}
            </span>
          </h1>
          <p className="text-lg mb-12" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 3rem' }}>
            {t('home_hero_sub')}
          </p>

          {/* TWO BIG CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/cars" className="group relative overflow-hidden rounded-2xl p-8 text-right transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))', border: '1px solid rgba(234,179,8,0.3)', textDecoration: 'none' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(234,179,8,0.08))' }}></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🚗</div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('home_rent_title')}</h2>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home_rent_sub')}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#eab308' }}>{t('home_rent_cta')}</span>
              </div>
            </Link>

            <Link to="/list-car" className="group relative overflow-hidden rounded-2xl p-8 text-right transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03))', border: '1px solid rgba(34,197,94,0.25)', textDecoration: 'none' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' }}></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('home_list_title')}</h2>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home_list_sub')}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#22c55e' }}>{t('home_list_cta')}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span className="text-xs">{t('home_discover')}</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(234,179,8,0.5), transparent)' }}></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4" style={{ background: 'rgba(5,5,15,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-3">{t('home_how_title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('home_how_sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Renters */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold" style={{ background: '#eab308' }}>🚗</div>
                <h3 className="text-xl font-bold text-white">{t('home_for_renters')}</h3>
              </div>
              <div className="space-y-6">
                {[
                  { n: '01', t: 'Search',  d: 'Browse cars by location, price, and type' },
                  { n: '02', t: 'Book',    d: 'Pick your dates, choose a payment method, and confirm' },
                  { n: '03', t: 'Pick Up', d: 'Contact the owner and receive your car safely' },
                ].map(step => (
                  <div key={step.n} className="flex items-start gap-4">
                    <span className="text-3xl font-black" style={{ color: 'rgba(234,179,8,0.3)', minWidth: '3rem' }}>{step.n}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{step.t}</h4>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Owners */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold" style={{ background: '#22c55e' }}>💰</div>
                <h3 className="text-xl font-bold text-white">{t('home_for_owners')}</h3>
              </div>
              <div className="space-y-6">
                {[
                  { n: '01', t: 'Register', d: 'Add your car details and submit for review' },
                  { n: '02', t: 'Approval', d: 'Our team reviews and approves your listing within 24 hours' },
                  { n: '03', t: 'Earn',     d: 'Receive bookings and earn with zero effort' },
                ].map(step => (
                  <div key={step.n} className="flex items-start gap-4">
                    <span className="text-3xl font-black" style={{ color: 'rgba(34,197,94,0.3)', minWidth: '3rem' }}>{step.n}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{step.t}</h4>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      {featured.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">{t('home_featured')}</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('home_featured_sub')}</p>
              </div>
              <Link to="/cars" className="text-sm font-semibold" style={{ color: '#eab308', textDecoration: 'none' }}>{t('home_view_all')}</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(car => (
                <Link key={car.id} to={`/cars/${car.id}`} style={{ textDecoration: 'none' }}>
                  <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="h-48 overflow-hidden">
                      <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-white mb-1">{car.brand} {car.model}</h3>
                      <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{car.year} · {car.location || 'Cairo'}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg" style={{ color: '#eab308' }}>{car.daily_price} {t('cars_egp_day')}</span>
                        <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>{t('cars_available')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="py-20 px-4" style={{ background: 'rgba(234,179,8,0.03)', borderTop: '1px solid rgba(234,179,8,0.08)', borderBottom: '1px solid rgba(234,179,8,0.08)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '500+', l: t('home_stats_cars') },
            { n: '50+',  l: t('home_stats_cities') },
            { n: '200+', l: t('home_stats_owners') },
            { n: '98%',  l: t('home_stats_rate') },
          ].map(s => (
            <div key={s.l}>
              <div className="text-3xl font-black mb-1" style={{ color: '#eab308' }}>{s.n}</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Get Started for Free</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Create an account and enjoy the best car rental experience</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-xl font-bold text-black transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', textDecoration: 'none', fontFamily: 'Cairo, sans-serif' }}>
              {t('register_submit_user')}
            </Link>
            <Link to="/cars" className="px-8 py-4 rounded-xl font-bold transition-all" style={{ border: '1px solid rgba(234,179,8,0.3)', color: '#eab308', textDecoration: 'none', fontFamily: 'Cairo, sans-serif' }}>
              {t('nav_rent_car')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
