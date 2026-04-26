import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarStore } from '@/store/carStore';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { useT } from '@/i18n';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'sonner';

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const { selectedCar, fetchCarById, isLoading } = useCarStore();
  const { createBooking } = useBookingStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const t = useT();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [payment, setPayment] = useState<'cash' | 'online'>('cash');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  // ── Confirmation modal state ──────────────────────────────────────────────
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { if (id) fetchCarById(id); }, [id]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>Loading...</div>
    </div>
  );

  if (!selectedCar) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div>
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-white mb-4">Car not found</h2>
        <button onClick={() => navigate('/cars')} className="px-6 py-3 rounded-xl font-bold text-black" style={{ background: '#eab308' }}>Go Back</button>
      </div>
    </div>
  );

  const car = selectedCar;
  const days = pickup && dropoff
    ? Math.max(1, Math.ceil((new Date(dropoff).getTime() - new Date(pickup).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = days * car.daily_price;

  // ── Step 1: validate, then open confirm modal (no API call yet) ───────────
  const handleBookClick = () => {
    if (!user) { toast.error('You must be signed in to book'); navigate('/login'); return; }
    if (!pickup || !dropoff) { toast.error('Please select pickup and return dates'); return; }
    if (new Date(dropoff) <= new Date(pickup)) { toast.error('Return date must be after pickup date'); return; }
    setShowConfirm(true);
  };

  // ── Step 2: user confirmed → send API request ─────────────────────────────
  const handleConfirm = async () => {
    setBooking(true);
    try {
      await createBooking({
        user_id: user!.id, user_name: user!.full_name, user_phone: user!.phone,
        car_id: car.id,
        pickup_date: pickup,
        dropoff_date: dropoff,
        total_price: total, payment_method: payment, status: 'pending', notes,
      });
      setShowConfirm(false);
      toast.success('Booking request sent! Confirmation coming soon');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Booking failed. Please try again.');
    } finally { setBooking(false); }
  };

  const inp = "w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none";
  const inpS = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Cairo, sans-serif' };

  return (
    <div className="min-h-screen py-20 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {t('car_back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Car Info */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ height: '360px' }}>
              <img src={car.images[activeImg] || car.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }} />
            </div>
            {car.images.length > 1 && (
              <div className="flex gap-3 mb-6">
                {car.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all" style={{ opacity: activeImg === i ? 1 : 0.5, border: activeImg === i ? '2px solid #eab308' : '2px solid transparent' }}>
                    <img src={img} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'; }} />
                  </button>
                ))}
              </div>
            )}

            {/* Car Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">{car.brand} {car.model}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>{car.year} · {car.color} · {car.location || 'Cairo'}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black" style={{ color: '#eab308' }}>{car.daily_price}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('car_egp_day')}</div>
                </div>
              </div>
              {car.owner_id && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <span className="text-blue-400">👤</span>
                  <span className="text-sm" style={{ color: '#93c5fd' }}>{t('car_private_owner')} — {car.owner_name}</span>
                </div>
              )}
              {car.description && <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{car.description}</p>}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: '💺', label: t('car_seats'),        val: car.specifications.seats },
                { icon: '⚙️', label: t('car_transmission'), val: car.specifications.transmission },
                { icon: '⛽', label: t('car_fuel'),          val: car.specifications.fuel_type },
                { icon: '🔧', label: t('car_engine'),        val: car.specifications.engine },
                { icon: '📍', label: t('car_location'),      val: car.location },
                { icon: '📅', label: t('car_year'),          val: car.year },
              ].filter(s => s.val).map(spec => (
                <div key={spec.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xl mb-1">{spec.icon}</div>
                  <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{spec.label}</div>
                  <div className="text-sm font-semibold text-white">{spec.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Booking Form */}
          <div>
            <div className="rounded-2xl p-6 sticky top-20" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <h2 className="text-xl font-bold text-white mb-5">{t('car_book_now')}</h2>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('car_pickup_date')}</label>
                  <input type="date" className={inp} style={inpS} value={pickup} min={new Date().toISOString().split('T')[0]} onChange={e => setPickup(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('car_return_date')}</label>
                  <input type="date" className={inp} style={inpS} value={dropoff} min={pickup || new Date().toISOString().split('T')[0]} onChange={e => setDropoff(e.target.value)} />
                </div>

                <div>
                  <label className="text-xs mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('car_payment')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ v: 'cash' as const, l: t('car_cash') }, { v: 'online' as const, l: t('car_online') }].map(p => (
                      <button key={p.v} onClick={() => setPayment(p.v)} className="py-2.5 rounded-xl text-sm transition-all" style={{ background: payment === p.v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.04)', color: payment === p.v ? '#eab308' : 'rgba(255,255,255,0.5)', border: payment === p.v ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('car_notes')}</label>
                  <textarea className={inp} style={{ ...inpS, minHeight: '60px', resize: 'none' }} placeholder={t('car_notes_ph')} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              {/* Price Summary */}
              {days > 0 && (
                <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{car.daily_price} EGP × {days} day{days !== 1 ? 's' : ''}</span>
                    <span className="text-white">{total} EGP</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: '#eab308' }}>{t('car_total')}</span>
                    <span style={{ color: '#eab308', fontSize: '1.1rem' }}>{total} EGP</span>
                  </div>
                </div>
              )}

              {/* "Confirm Booking" now opens the modal instead of calling API directly */}
              <button
                onClick={handleBookClick}
                disabled={booking || !car.is_available}
                className="w-full py-3.5 rounded-xl font-bold text-black text-sm disabled:opacity-50 transition-all hover:opacity-90"
                style={{ background: car.is_available ? 'linear-gradient(135deg, #eab308, #f59e0b)' : 'rgba(255,255,255,0.1)', color: car.is_available ? '#000' : 'rgba(255,255,255,0.3)', fontFamily: 'Cairo, sans-serif' }}
              >
                {!car.is_available ? t('car_not_available') : t('car_confirm_booking')}
              </button>

              {!user && (
                <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t('car_sign_in_to_book')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation modal ─────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        data={{
          carName: `${car.brand} ${car.model}`,
          pickupDate: pickup,
          dropoffDate: dropoff,
          days,
          totalPrice: total,
          dailyPrice: car.daily_price,
          isLoading: booking,
        }}
      />
    </div>
  );
}
