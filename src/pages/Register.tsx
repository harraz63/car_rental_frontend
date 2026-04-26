import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useT } from '@/i18n';
import { toast } from 'sonner';

export default function Register() {
  const { signUp, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'owner'>('user');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const t = useT();

  const [carForm, setCarForm] = useState({
    brand: '', model: '', year: new Date().getFullYear(),
    color: '', dailyPrice: '', location: '',
    description: '', numberOfSeats: '', engine: '',
    transmission: 'automatic' as 'automatic' | 'manual',
    fuelType: 'petrol' as 'petrol' | 'diesel' | 'hybrid',
    images: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) { toast.error('Please fill in all required fields'); return; }
    if (role === 'owner') {
      if (!carForm.brand || !carForm.model || !carForm.dailyPrice) { toast.error('Please fill in required car details (brand, model, price)'); return; }
      const validImages = carForm.images.filter(i => i.trim());
      if (validImages.length === 0) { toast.error('Please add at least one car image URL'); return; }
    }
    try {
      if (role === 'owner') {
        const validImages = carForm.images.filter(i => i.trim());
        await signUp(form.email, form.password, form.full_name, form.phone, 'owner', {
          brand: carForm.brand, model: carForm.model, year: Number(carForm.year),
          color: carForm.color || undefined, dailyPrice: Number(carForm.dailyPrice),
          location: carForm.location || undefined, description: carForm.description || undefined,
          numberOfSeats: carForm.numberOfSeats ? Number(carForm.numberOfSeats) : undefined,
          engine: carForm.engine || undefined, transmission: carForm.transmission,
          fuelType: carForm.fuelType, images: validImages,
        });
      } else {
        await signUp(form.email, form.password, form.full_name, form.phone, 'user');
      }
      toast.success('Account created successfully!');
      navigate(role === 'owner' ? '/my-listings' : '/cars');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  const inp = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Cairo, sans-serif' };
  const inpFocus = { borderColor: 'rgba(234,179,8,0.5)' };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex text-4xl mb-4">🚗</div>
          <h1 className="text-3xl font-black text-white mb-2">{t('register_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('register_have_account')} <Link to="/login" style={{ color: '#eab308', textDecoration: 'none' }}>{t('register_sign_in')}</Link></p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="mb-6">
            <p className="text-sm font-semibold text-white mb-3">{t('register_i_want')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('user')} className="p-4 rounded-xl text-center transition-all" style={{ background: role === 'user' ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', border: role === 'user' ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.08)', color: role === 'user' ? '#eab308' : 'rgba(255,255,255,0.5)' }}>
                <div className="text-2xl mb-1">🚗</div>
                <div className="text-sm font-semibold">{t('register_rent')}</div>
              </button>
              <button type="button" onClick={() => setRole('owner')} className="p-4 rounded-xl text-center transition-all" style={{ background: role === 'owner' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)', border: role === 'owner' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)', color: role === 'owner' ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm font-semibold">{t('register_list')}</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('register_name')}</label>
              <input className={inp} style={inpStyle} placeholder={t('register_name_ph')} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} onFocus={e => Object.assign(e.target.style, inpFocus)} onBlur={e => Object.assign(e.target.style, inpStyle)} />
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('register_email')}</label>
              <input type="email" className={inp} style={inpStyle} placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => Object.assign(e.target.style, inpFocus)} onBlur={e => Object.assign(e.target.style, inpStyle)} />
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('register_phone')}</label>
              <input className={inp} style={inpStyle} placeholder="01xxxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={e => Object.assign(e.target.style, inpFocus)} onBlur={e => Object.assign(e.target.style, inpStyle)} />
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('register_password')}</label>
              <input type="password" className={inp} style={inpStyle} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={e => Object.assign(e.target.style, inpFocus)} onBlur={e => Object.assign(e.target.style, inpStyle)} />
            </div>

            {role === 'owner' && (
              <div className="pt-4 mt-2 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-semibold text-white">{t('register_car_section')} <span style={{ color: '#eab308' }}>*</span></p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('register_car_required_note')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Brand *</label>
                    <input className={inp} style={{ ...inpStyle, padding: '10px 12px' }} placeholder="Toyota" value={carForm.brand} onChange={e => setCarForm({ ...carForm, brand: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Model *</label>
                    <input className={inp} style={{ ...inpStyle, padding: '10px 12px' }} placeholder="Camry" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Year</label>
                    <input type="number" className={inp} style={{ ...inpStyle, padding: '10px 12px' }} value={carForm.year} onChange={e => setCarForm({ ...carForm, year: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Daily Price (EGP) *</label>
                    <input type="number" className={inp} style={{ ...inpStyle, padding: '10px 12px' }} placeholder="250" value={carForm.dailyPrice} onChange={e => setCarForm({ ...carForm, dailyPrice: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Location</label>
                  <input className={inp} style={{ ...inpStyle, padding: '10px 12px' }} placeholder="Cairo" value={carForm.location} onChange={e => setCarForm({ ...carForm, location: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Transmission</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([['automatic', 'Automatic'], ['manual', 'Manual']] as const).map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setCarForm({ ...carForm, transmission: v })} className="py-2 rounded-lg text-sm transition-all" style={{ background: carForm.transmission === v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', border: carForm.transmission === v ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.08)', color: carForm.transmission === v ? '#eab308' : 'rgba(255,255,255,0.5)' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Fuel Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([['petrol', 'Petrol'], ['diesel', 'Diesel'], ['hybrid', 'Hybrid']] as const).map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setCarForm({ ...carForm, fuelType: v })} className="py-2 rounded-lg text-xs transition-all" style={{ background: carForm.fuelType === v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', border: carForm.fuelType === v ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.08)', color: carForm.fuelType === v ? '#eab308' : 'rgba(255,255,255,0.5)' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Car Image URL *</label>
                  <input className={inp} style={{ ...inpStyle, padding: '10px 12px' }} placeholder="https://..." value={carForm.images[0]} onChange={e => setCarForm({ ...carForm, images: [e.target.value] })} />
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl font-bold text-black transition-all hover:opacity-90 disabled:opacity-50 mt-2" style={{ background: role === 'owner' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #eab308, #f59e0b)', fontFamily: 'Cairo, sans-serif' }}>
              {isLoading ? t('register_loading') : role === 'owner' ? t('register_submit_owner') : t('register_submit_user')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
