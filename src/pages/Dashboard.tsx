import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCarStore } from '@/store/carStore';
import { useBookingStore } from '@/store/bookingStore';
import { useT } from '@/i18n';
import { toast } from 'sonner';
import type { Car } from '@/types';

type Tab = 'overview' | 'cars' | 'pending' | 'bookings';

const EMPTY_CAR = {
  brand: '', model: '', year: new Date().getFullYear(), color: '',
  daily_price: '', location: '', description: '',
  seats: 5, transmission: 'automatic', fuel_type: 'petrol', engine: '',
  is_available: true, images: ['', '', ''],
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { allCars, fetchAllCarsAdmin, createCar, updateCar, deleteCar, approveListing, rejectListing } = useCarStore();
  const { bookings, userBookings, fetchAllBookings, fetchUserBookings, updateBookingStatus } = useBookingStore();
  const navigate = useNavigate();
  const t = useT();

  const [tab, setTab] = useState<Tab>('overview');
  const [carModal, setCarModal] = useState<'add' | 'edit' | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ ...EMPTY_CAR });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imgTab, setImgTab] = useState(0);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'admin') { fetchAllCarsAdmin(); fetchAllBookings(); }
    else { fetchUserBookings(user.id); }
  }, [user]);

  if (!user) return null;

  // ---- USER DASHBOARD ----
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen py-20 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">{t('dashboard_my_bookings_title')}</h1>
          <p className="mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('dashboard_welcome')} {user.full_name}</p>
          {userBookings.length === 0 ? (
            <div className="text-center py-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('dashboard_no_bookings_yet')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>{t('dashboard_explore')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map(b => <BookingCard key={b.id} booking={b} isAdmin={false} onStatusChange={updateBookingStatus} t={t} />)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- ADMIN DASHBOARD ----
  const pending  = allCars.filter(c => c.listing_status === 'pending');
  const approved = allCars.filter(c => c.listing_status === 'approved');

  const openAdd = () => { setForm({ ...EMPTY_CAR }); setEditingCar(null); setCarModal('add'); setImgTab(0); };
  const openEdit = (car: Car) => {
    setEditingCar(car);
    setForm({ brand: car.brand, model: car.model, year: car.year, color: car.color || '', daily_price: String(car.daily_price), location: car.location || '', description: car.description || '', seats: car.specifications.seats || 5, transmission: car.specifications.transmission || 'automatic', fuel_type: car.specifications.fuel_type || 'petrol', engine: car.specifications.engine || '', is_available: car.is_available, images: [...car.images, '', ''].slice(0, 3) });
    setCarModal('edit'); setImgTab(0);
  };

  const handleSaveCar = async () => {
    if (!form.brand || !form.model || !form.daily_price) { toast.error('Please fill in all required fields'); return; }
    setIsSaving(true);
    try {
      const validImages = form.images.filter(i => i.trim());
      const carData = { brand: form.brand, model: form.model, year: Number(form.year), color: form.color, daily_price: Number(form.daily_price), location: form.location, description: form.description, images: validImages.length ? validImages : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'], specifications: { seats: Number(form.seats), transmission: form.transmission, fuel_type: form.fuel_type, engine: form.engine }, is_available: form.is_available, listing_status: 'approved' as const };
      if (carModal === 'add') { await createCar(carData); toast.success('Car added successfully'); }
      else if (editingCar) { await updateCar(editingCar.id, carData); toast.success('Car updated successfully'); }
      setCarModal(null); fetchAllCarsAdmin();
    } catch (err: any) { toast.error(err.response?.data?.message || err.message || 'Failed to save car'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await deleteCar(id);
      toast.success('Car deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete car');
    }
  };

  const handleApprove = async (id: string) => {
    try { await approveListing(id); toast.success('Listing approved and published'); fetchAllCarsAdmin(); }
    catch (err: any) { toast.error(err.message || 'Failed to approve'); }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try { await rejectListing(rejectingId, rejectReason || 'Does not meet requirements'); toast.error('Listing rejected'); setRejectingId(null); setRejectReason(''); fetchAllCarsAdmin(); }
    catch (err: any) { toast.error(err.message || 'Failed to reject'); }
  };

  const inp = "w-full px-3 py-2 rounded-lg text-white text-sm outline-none";
  const inpS = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Cairo, sans-serif' };

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: t('dashboard_overview') },
    { key: 'cars',     label: t('dashboard_manage'),  count: allCars.length },
    { key: 'pending',  label: t('dashboard_pending'), count: pending.length },
    { key: 'bookings', label: t('dashboard_bookings'), count: bookings.length },
  ];

  return (
    <div className="min-h-screen py-10 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">{t('dashboard_title')}</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{t('dashboard_sub')}</p>
          </div>
          <button onClick={openAdd} className="px-5 py-2.5 rounded-xl font-bold text-black text-sm" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)' }}>{t('dashboard_add_car')}</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('dashboard_total'),     value: allCars.length,  color: '#eab308' },
            { label: t('dashboard_published'), value: approved.length, color: '#22c55e' },
            { label: t('dashboard_review'),    value: pending.length,  color: '#f59e0b' },
            { label: t('dashboard_bookings'),  value: bookings.length, color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all" style={{ background: tab === tb.key ? 'rgba(234,179,8,0.15)' : 'transparent', color: tab === tb.key ? '#eab308' : 'rgba(255,255,255,0.5)', border: tab === tb.key ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent', fontWeight: tab === tb.key ? 600 : 400 }}>
              {tb.label}
              {tb.count !== undefined && <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{tb.count}</span>}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-bold text-white mb-4">{t('dashboard_latest_cars')}</h3>
              <div className="space-y-3">
                {allCars.slice(0, 5).map(car => (
                  <div key={car.id} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={car.images[0]} className="w-10 h-10 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">{car.brand} {car.model}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{car.daily_price} EGP/day</p>
                    </div>
                    <StatusBadge status={car.listing_status} t={t} />
                  </div>
                ))}
                {allCars.length === 0 && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('dashboard_no_cars')}</p>}
              </div>
            </div>
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-bold text-white mb-4">{t('dashboard_latest_bookings')}</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-sm text-white">{b.car?.brand} {b.car?.model}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{b.pickup_date} → {b.dropoff_date} · {b.total_price} EGP</p>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('dashboard_no_bookings')}</p>}
              </div>
            </div>
          </div>
        )}

        {tab === 'cars' && (
          <div className="space-y-3">
            {allCars.map(car => (
              <div key={car.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <img src={car.images[0]} className="w-16 h-14 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{car.brand} {car.model} {car.year}</h3>
                    <StatusBadge status={car.listing_status} t={t} />
                    {car.owner_name && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Owner: {car.owner_name}</span>}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{car.location || '—'} · {car.daily_price} EGP/day · {car.specifications.transmission} · {car.specifications.fuel_type}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(car)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>{t('dashboard_edit')}</button>
                  <button onClick={() => handleDelete(car.id)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{t('dashboard_delete')}</button>
                </div>
              </div>
            ))}
            {allCars.length === 0 && <EmptyState icon="🚗" msg={t('dashboard_no_cars')} />}
          </div>
        )}

        {tab === 'pending' && (
          <div className="space-y-4">
            {pending.map(car => (
              <div key={car.id} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div className="flex items-start gap-4">
                  <div className="grid grid-cols-3 gap-2 w-48 flex-shrink-0">
                    {car.images.slice(0, 3).map((img, i) => <img key={i} src={img} className="rounded-lg object-cover h-16 w-full" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'; }} />)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg mb-1">{car.brand} {car.model} {car.year}</h3>
                    <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{car.location} · {car.daily_price} EGP/day · {car.specifications.seats} seats · {car.specifications.transmission} · {car.specifications.fuel_type}</p>
                    {car.owner_name && <p className="text-sm" style={{ color: '#60a5fa' }}>📞 Owner: {car.owner_name} — {car.owner_phone || '—'}</p>}
                    {car.description && <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{car.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => handleApprove(car.id)} className="px-5 py-2 rounded-lg text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>{t('dashboard_approve')}</button>
                  <button onClick={() => { setRejectingId(car.id); setRejectReason(''); }} className="px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{t('dashboard_reject')}</button>
                  <button onClick={() => openEdit(car)} className="px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>{t('dashboard_edit_publish')}</button>
                </div>
                {rejectingId === car.id && (
                  <div className="mt-4 flex items-center gap-3">
                    <input className={inp} style={{ ...inpS, flex: 1 }} placeholder={t('dashboard_reject_ph')} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                    <button onClick={handleReject} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#ef4444', color: '#fff' }}>{t('dashboard_confirm_reject')}</button>
                    <button onClick={() => setRejectingId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{t('cancel')}</button>
                  </div>
                )}
              </div>
            ))}
            {pending.length === 0 && <EmptyState icon="✅" msg="No pending requests" />}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.map(b => <BookingCard key={b.id} booking={b} isAdmin onStatusChange={updateBookingStatus} t={t} />)}
            {bookings.length === 0 && <EmptyState icon="📋" msg={t('dashboard_no_bookings')} />}
          </div>
        )}
      </div>

      {carModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: '#0a0a14', border: '1px solid rgba(234,179,8,0.2)', fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">{carModal === 'add' ? 'Add New Car' : 'Edit Car Details'}</h2>
              <button onClick={() => setCarModal(null)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem', lineHeight: 1 }}>✕</button>
            </div>
            <div className="mb-6">
              <label className="text-sm font-semibold text-white mb-3 block">Car Images</label>
              <div className="flex gap-2 mb-3">
                {[0,1,2].map(i => <button key={i} onClick={() => setImgTab(i)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: imgTab === i ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.05)', color: imgTab === i ? '#eab308' : 'rgba(255,255,255,0.5)', border: imgTab === i ? '1px solid rgba(234,179,8,0.4)' : '1px solid transparent' }}>Image {i+1}{i===0?' *':''}</button>)}
              </div>
              <input className={inp} style={inpS} placeholder="https://..." value={form.images[imgTab]} onChange={e => { const imgs = [...form.images]; imgs[imgTab] = e.target.value; setForm(f => ({ ...f, images: imgs })); }} />
              {form.images[imgTab] && <div className="mt-2 h-40 rounded-xl overflow-hidden"><img src={form.images[imgTab]} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} /></div>}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Brand *"><input className={inp} style={inpS} value={form.brand} onChange={e => setForm(f=>({...f,brand:e.target.value}))} placeholder="Toyota" /></Field>
              <Field label="Model *"><input className={inp} style={inpS} value={form.model} onChange={e => setForm(f=>({...f,model:e.target.value}))} placeholder="Camry" /></Field>
              <Field label="Year"><input type="number" className={inp} style={inpS} value={form.year} onChange={e => setForm(f=>({...f,year:Number(e.target.value)}))} /></Field>
              <Field label="Color"><input className={inp} style={inpS} value={form.color} onChange={e => setForm(f=>({...f,color:e.target.value}))} placeholder="White" /></Field>
              <Field label="Daily Price (EGP) *"><input type="number" className={inp} style={inpS} value={form.daily_price} onChange={e => setForm(f=>({...f,daily_price:e.target.value}))} placeholder="250" /></Field>
              <Field label="Location"><input className={inp} style={inpS} value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))} placeholder="Cairo" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Seats"><input type="number" className={inp} style={inpS} value={form.seats} onChange={e => setForm(f=>({...f,seats:Number(e.target.value)}))} /></Field>
              <Field label="Engine"><input className={inp} style={inpS} value={form.engine} onChange={e => setForm(f=>({...f,engine:e.target.value}))} placeholder="2.5L" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Transmission">
                <select className={inp} style={inpS} value={form.transmission} onChange={e => setForm(f=>({...f,transmission:e.target.value}))}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </Field>
              <Field label="Fuel Type">
                <select className={inp} style={inpS} value={form.fuel_type} onChange={e => setForm(f=>({...f,fuel_type:e.target.value}))}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Field>
            </div>
            <Field label="Car Description"><textarea className={inp} style={{ ...inpS, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description..." /></Field>
            <div className="flex items-center gap-3 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_available} onChange={e => setForm(f=>({...f,is_available:e.target.checked}))} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Available for booking</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={handleSaveCar} disabled={isSaving} className="flex-1 py-3 rounded-xl font-bold text-black disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)' }}>
                {isSaving ? 'Saving...' : carModal === 'add' ? 'Add Car' : 'Save Changes'}
              </button>
              <button onClick={() => setCarModal(null)} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</label>{children}</div>;
}

function StatusBadge({ status, t }: { status: string; t: (k: any) => string }) {
  const MAP: any = {
    approved: { l: t('status_published'), c: '#22c55e', b: 'rgba(34,197,94,0.1)' },
    pending:  { l: t('status_pending'),   c: '#f59e0b', b: 'rgba(245,158,11,0.1)' },
    rejected: { l: t('status_rejected'),  c: '#ef4444', b: 'rgba(239,68,68,0.1)' },
  };
  const s = MAP[status] || MAP.pending;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.b, color: s.c }}>{s.l}</span>;
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-5xl mb-3">{icon}</div>
      <p style={{ color: 'rgba(255,255,255,0.4)' }}>{msg}</p>
    </div>
  );
}

function BookingCard({ booking, isAdmin, onStatusChange, t }: { booking: any; isAdmin: boolean; onStatusChange: (id: string, status: any) => void; t: (k: any) => string }) {
  const STATUS_COLORS: any = { pending: '#f59e0b', confirmed: '#22c55e', completed: '#60a5fa', cancelled: '#ef4444' };
  const STATUS_LABELS: any = { pending: t('status_pending'), confirmed: t('status_confirmed'), completed: t('status_completed'), cancelled: t('status_cancelled') };
  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start gap-4">
        <img src={booking.car?.images?.[0]} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'; }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-sm">{booking.car?.brand} {booking.car?.model}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: `${STATUS_COLORS[booking.status]}20`, color: STATUS_COLORS[booking.status] }}>{STATUS_LABELS[booking.status]}</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{booking.pickup_date} → {booking.dropoff_date} · {booking.total_price} EGP · {booking.payment_method === 'cash' ? 'Cash' : 'Online'}</p>
          {isAdmin && booking.user && <p className="text-xs mt-1" style={{ color: '#60a5fa' }}>Client: {booking.user.full_name}</p>}
        </div>
        {isAdmin && booking.status === 'pending' && (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => onStatusChange(booking.id, 'confirmed')} className="px-3 py-1.5 rounded-lg text-xs font-bold text-black" style={{ background: '#22c55e' }}>{t('dashboard_booking_confirm')}</button>
            <button onClick={() => onStatusChange(booking.id, 'cancelled')} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{t('dashboard_booking_cancel')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
