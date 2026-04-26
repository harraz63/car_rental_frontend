import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCarStore } from '@/store/carStore';
import { useT } from '@/i18n';
import { toast } from 'sonner';

export default function ListCar() {
  const { user } = useAuthStore();
  const { createCar } = useCarStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const t = useT();

  const [form, setForm] = useState({
    brand: '', model: '', year: new Date().getFullYear(), color: '',
    daily_price: '', location: '', description: '',
    seats: '', transmission: 'automatic', fuel_type: 'petrol', engine: '',
    images: ['', '', ''],
  });

  const setF = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));
  const setImg = (i: number, v: string) => { const imgs = [...form.images]; imgs[i] = v; setForm(prev => ({ ...prev, images: imgs })); };

  const handleSubmit = async () => {
    if (!form.brand || !form.model || !form.daily_price) { toast.error('Please fill in all required fields'); return; }
    if (!user) { toast.error('You must be signed in'); navigate('/login'); return; }
    const validImages = form.images.filter(img => img.trim());
    if (validImages.length === 0) { toast.error('Please add at least one image URL'); return; }
    setIsLoading(true);
    try {
      await createCar({
        brand: form.brand, model: form.model, year: Number(form.year), color: form.color,
        daily_price: Number(form.daily_price), location: form.location, description: form.description,
        images: validImages.length ? validImages : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'],
        specifications: { seats: Number(form.seats), transmission: form.transmission, fuel_type: form.fuel_type, engine: form.engine },
        is_available: true, listing_status: 'pending', owner_id: user.id,
        owner_name: user.full_name, owner_phone: user.phone,
      });
      toast.success('Listing submitted! It will be reviewed within 24 hours');
      navigate(user.role === 'owner' ? '/my-listings' : '/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit listing');
    } finally { setIsLoading(false); }
  };

  const inp = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none";
  const inpS = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Cairo, sans-serif' };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
        <div>
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('list_car_signin_required')}</h2>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('list_car_signin_sub')}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/register" className="px-6 py-3 rounded-xl font-bold text-black" style={{ background: '#eab308', textDecoration: 'none' }}>{t('list_car_create_account')}</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl font-bold" style={{ border: '1px solid rgba(234,179,8,0.3)', color: '#eab308', textDecoration: 'none' }}>{t('nav_sign_in')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">{t('list_car_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('list_car_sub')}</p>
        </div>

        <div className="flex items-center gap-2 mb-10 justify-center">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all" style={{ background: step >= s ? '#eab308' : 'rgba(255,255,255,0.1)', color: step >= s ? '#000' : 'rgba(255,255,255,0.4)' }}>{s}</div>
              {s < 3 && <div className="w-12 h-px" style={{ background: step > s ? '#eab308' : 'rgba(255,255,255,0.1)' }}></div>}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-6">{t('list_car_basic')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Brand *</label><input className={inp} style={inpS} placeholder="e.g. Toyota" value={form.brand} onChange={e => setF('brand', e.target.value)} /></div>
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Model *</label><input className={inp} style={inpS} placeholder="e.g. Camry" value={form.model} onChange={e => setF('model', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Year *</label><input type="number" className={inp} style={inpS} value={form.year} onChange={e => setF('year', e.target.value)} /></div>
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Color</label><input className={inp} style={inpS} placeholder="White" value={form.color} onChange={e => setF('color', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Daily Price (EGP) *</label><input type="number" className={inp} style={inpS} placeholder="250" value={form.daily_price} onChange={e => setF('daily_price', e.target.value)} /></div>
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Location</label><input className={inp} style={inpS} placeholder="Cairo" value={form.location} onChange={e => setF('location', e.target.value)} /></div>
              </div>
              <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Car Description</label><textarea className={inp} style={{ ...inpS, minHeight: '80px', resize: 'vertical' }} placeholder="Write a brief description of the car..." value={form.description} onChange={e => setF('description', e.target.value)} /></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-6">{t('list_car_specs')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Number of Seats</label><input type="number" className={inp} style={inpS} placeholder="5" value={form.seats} onChange={e => setF('seats', e.target.value)} /></div>
                <div><label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Engine</label><input className={inp} style={inpS} placeholder="2.5L" value={form.engine} onChange={e => setF('engine', e.target.value)} /></div>
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Transmission</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: 'automatic', l: 'Automatic' }, { v: 'manual', l: 'Manual' }].map(tr => (
                    <button key={tr.v} type="button" onClick={() => setF('transmission', tr.v)} className="py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: form.transmission === tr.v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', border: form.transmission === tr.v ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.08)', color: form.transmission === tr.v ? '#eab308' : 'rgba(255,255,255,0.5)' }}>{tr.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Fuel Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ v: 'petrol', l: 'Petrol' }, { v: 'diesel', l: 'Diesel' }, { v: 'hybrid', l: 'Hybrid' }].map(f => (
                    <button key={f.v} type="button" onClick={() => setF('fuel_type', f.v)} className="py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: form.fuel_type === f.v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', border: form.fuel_type === f.v ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.08)', color: form.fuel_type === f.v ? '#eab308' : 'rgba(255,255,255,0.5)' }}>{f.l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">{t('list_car_images')}</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('list_car_images_sub')}</p>
              {form.images.map((img, i) => (
                <div key={i}>
                  <label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Image {i + 1} URL {i === 0 ? '*' : '(optional)'}</label>
                  <input className={inp} style={inpS} placeholder="https://..." value={img} onChange={e => setImg(i, e.target.value)} />
                  {img && <div className="mt-2 h-32 rounded-lg overflow-hidden"><img src={img} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
                </div>
              ))}
              <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}><span style={{ color: '#eab308' }}>{t('list_car_note')} </span>{t('list_car_note_text')}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Cairo, sans-serif' }}>{t('list_car_prev')}</button>
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} className="px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', fontFamily: 'Cairo, sans-serif' }}>{t('list_car_next')}</button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading} className="px-8 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', fontFamily: 'Cairo, sans-serif' }}>
                {isLoading ? t('list_car_submitting') : t('list_car_submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
