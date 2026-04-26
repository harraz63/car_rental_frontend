import { useT } from '@/i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  data: {
    carName: string;
    pickupDate: string;
    dropoffDate: string;
    days: number;
    totalPrice: number;
    dailyPrice: number;
    isLoading?: boolean;
  };
}

export default function ConfirmModal({ isOpen, onConfirm, onCancel, data }: ConfirmModalProps) {
  const t = useT();

  if (!isOpen) return null;

  const { carName, pickupDate, dropoffDate, days, totalPrice, dailyPrice, isLoading } = data;

  return (
    /* Backdrop — same glass style used throughout the app */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      {/* Modal card — stop click propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: '#0a0a14',
          border: '1px solid rgba(234,179,8,0.25)',
          fontFamily: 'Cairo, sans-serif',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-lg font-black text-white mb-5">{t('confirm_modal_title')}</h2>

        {/* Details rows */}
        <div
          className="rounded-xl p-4 mb-5 space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Row label={t('confirm_modal_car')}     value={carName} />
          <Row label={t('confirm_modal_from')}    value={pickupDate} />
          <Row label={t('confirm_modal_to')}      value={dropoffDate} />
          <Row label={t('confirm_modal_days')}    value={`${days} ${days === 1 ? 'day' : 'days'}`} />
          {/* Total price — highlighted */}
          <div
            className="flex justify-between items-center pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {t('confirm_modal_total')}
            </span>
            <span className="font-black text-base" style={{ color: '#eab308' }}>
              {totalPrice} EGP
            </span>
          </div>
          {/* Price breakdown hint */}
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {dailyPrice} EGP × {days} {days === 1 ? 'day' : 'days'}
          </p>
        </div>

        {/* Action buttons — same style as existing buttons in the app */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)' }}
          >
            {isLoading ? `${t('car_sending')}` : t('confirm_modal_confirm')}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
          >
            {t('confirm_modal_cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
