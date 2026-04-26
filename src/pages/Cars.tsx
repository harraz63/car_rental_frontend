import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarStore } from '@/store/carStore';
import { useT } from '@/i18n';

export default function Cars() {
  const { cars, fetchCars, isLoading } = useCarStore();
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [transmission, setTransmission] = useState('');
  const [location, setLocation] = useState('');
  const t = useT();

  useEffect(() => { fetchCars(); }, []);

  const applyFilters = () => {
    fetchCars({
      availableOnly: true,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      transmission: transmission || undefined,
      location: location || undefined,
    });
  };

  const filtered = cars.filter(car =>
    !search || `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(search.toLowerCase())
  );

  const inp = "w-full px-3 py-2 rounded-lg text-white text-sm outline-none";
  const inpS = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Cairo, sans-serif' };

  return (
    <div className="min-h-screen py-20 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-2">{t('cars_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('cars_sub')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="rounded-2xl p-5 sticky top-20" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-bold text-white mb-4">{t('cars_filter')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('cars_location')}</label>
                  <input className={inp} style={inpS} placeholder={t('cars_location_ph')} value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('cars_max_price')}</label>
                  <input type="number" className={inp} style={inpS} placeholder="500" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('cars_transmission')}</label>
                  <div className="flex gap-2">
                    {[
                      { v: '', l: t('cars_all') },
                      { v: 'automatic', l: t('cars_auto') },
                      { v: 'manual', l: t('cars_manual') },
                    ].map(tr => (
                      <button key={tr.v} onClick={() => setTransmission(tr.v)} className="flex-1 py-1.5 rounded-lg text-xs transition-all" style={{ background: transmission === tr.v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.04)', color: transmission === tr.v ? '#eab308' : 'rgba(255,255,255,0.5)', border: transmission === tr.v ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent' }}>
                        {tr.l}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={applyFilters} className="w-full py-2.5 rounded-lg text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)' }}>
                  {t('cars_apply')}
                </button>
                <button onClick={() => { setMaxPrice(''); setTransmission(''); setLocation(''); fetchCars(); }} className="w-full py-2 rounded-lg text-xs" style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {t('cars_reset')}
                </button>
              </div>
            </div>
          </div>

          {/* Car Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <input className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={{ ...inpS, fontSize: '0.9rem' }} placeholder={t('cars_search_ph')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: '280px' }}></div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">{t('cars_no_results')}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)' }}>{t('cars_no_results_sub')}</p>
              </div>
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{filtered.length} {t('cars_available')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(car => (
                    <Link key={car.id} to={`/cars/${car.id}`} style={{ textDecoration: 'none' }}>
                      <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="relative h-48 overflow-hidden">
                          <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }} />
                          {car.owner_id && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(96,165,250,0.9)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                              {t('cars_private_owner')}
                            </div>
                          )}
                          {!car.is_available && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                              <span className="text-white font-bold text-lg">{t('cars_unavailable')}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-white mb-1">{car.brand} {car.model}</h3>
                          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {car.year} · {car.location || 'Cairo'} · {car.specifications.transmission}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xl" style={{ color: '#eab308' }}>{car.daily_price} <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('cars_egp_day')}</span></span>
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              <span>💺 {car.specifications.seats}</span>
                              <span>⛽ {car.specifications.fuel_type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
