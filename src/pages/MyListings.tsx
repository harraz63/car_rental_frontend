import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCarStore } from '@/store/carStore';
import { useT } from '@/i18n';
import { toast } from 'sonner';

export default function MyListings() {
  const { user } = useAuthStore();
  const { cars, fetchOwnerCars, deleteCar } = useCarStore();
  const navigate = useNavigate();
  const t = useT();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const STATUS_MAP = {
    pending:  { label: t('my_listings_pending'),  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
    approved: { label: t('my_listings_approved'), color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)' },
    rejected: { label: t('my_listings_rejected'), color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)' },
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOwnerCars(user.id);
  }, [user]);

  if (!user) return null;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    setDeletingId(id);
    try {
      await deleteCar(id);
      toast.success('Car deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete car');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">{t('my_listings_title')}</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('my_listings_sub')}</p>
          </div>
          <Link to="/list-car" className="px-6 py-3 rounded-xl font-bold text-black text-sm" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', textDecoration: 'none' }}>
            {t('my_listings_add')}
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">{t('my_listings_empty_title')}</h3>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('my_listings_empty_sub')}</p>
            <Link to="/list-car" className="px-6 py-3 rounded-xl font-bold text-black text-sm" style={{ background: '#eab308', textDecoration: 'none' }}>
              {t('my_listings_add_car')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map(car => {
              const st = STATUS_MAP[car.listing_status] || STATUS_MAP.pending;
              return (
                <div key={car.id} className="rounded-2xl p-6 flex items-center gap-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={car.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg">{car.brand} {car.model} {car.year}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{car.location || '—'} · {car.daily_price} EGP/day</p>
                    {car.rejection_reason && (
                      <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{t('my_listings_rejection_reason')} {car.rejection_reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                    {/* Delete button — owner can delete their own car */}
                    <button
                      onClick={() => handleDelete(car.id)}
                      disabled={deletingId === car.id}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      {deletingId === car.id ? '...' : t('dashboard_delete')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

