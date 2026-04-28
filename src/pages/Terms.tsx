import { useLangStore, useT } from '@/i18n';

const leftSectionItems = [
  {
    labelKey: 'terms_left_item_1_label',
    contentKey: 'terms_left_item_1_content',
  },
  {
    labelKey: 'terms_left_item_2_label',
    contentKey: 'terms_left_item_2_content',
  },
  {
    labelKey: 'terms_left_item_3_label',
    contentKey: 'terms_left_item_3_content',
  },
  {
    labelKey: 'terms_left_item_4_label',
    contentKey: 'terms_left_item_4_content',
  },
  {
    labelKey: 'terms_left_item_5_label',
    contentKey: 'terms_left_item_5_content',
  },
] as const;

const rightSectionItems = [
  {
    labelKey: 'terms_right_item_1_label',
    contentKey: 'terms_right_item_1_content',
  },
  {
    labelKey: 'terms_right_item_2_label',
    contentKey: 'terms_right_item_2_content',
  },
  {
    labelKey: 'terms_right_item_3_label',
    contentKey: 'terms_right_item_3_content',
  },
  {
    labelKey: 'terms_right_item_4_label',
    contentKey: 'terms_right_item_4_content',
  },
  {
    labelKey: 'terms_right_item_5_label',
    contentKey: 'terms_right_item_5_content',
  },
] as const;

export default function Terms() {
  const { lang } = useLangStore();
  const t = useT();
  const isArabic = lang === 'ar';
  const contentDirection = isArabic ? 'rtl' : 'ltr';
  const contentAlign = isArabic ? 'right' : 'left';

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{ fontFamily: 'Cairo, sans-serif', direction: contentDirection }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10" style={{ textAlign: contentAlign }}>
          <h1 className="text-3xl font-black text-white mb-2">{t('terms_page_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{t('terms_page_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ direction: 'ltr' }}>
          <section
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              direction: contentDirection,
              textAlign: contentAlign,
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2">{t('terms_left_title')}</h2>
              <p className="text-sm font-semibold" style={{ color: '#eab308' }}>
                {t('terms_left_subtitle')}
              </p>
            </div>

            <ol className="space-y-4">
              {leftSectionItems.map((item) => (
                <li
                  key={item.labelKey}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(234,179,8,0.05)',
                    border: '1px solid rgba(234,179,8,0.12)',
                  }}
                >
                  <span className="block text-sm font-bold mb-1" style={{ color: '#fff' }}>
                    {t(item.labelKey)}
                  </span>
                  <span className="text-sm leading-7" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t(item.contentKey)}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              direction: contentDirection,
              textAlign: contentAlign,
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2">{t('terms_right_title')}</h2>
              <p className="text-sm font-semibold" style={{ color: '#eab308' }}>
                {t('terms_right_subtitle')}
              </p>
            </div>

            <ol className="space-y-4">
              {rightSectionItems.map((item) => (
                <li
                  key={item.labelKey}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(34,197,94,0.05)',
                    border: '1px solid rgba(34,197,94,0.12)',
                  }}
                >
                  <span className="block text-sm font-bold mb-1" style={{ color: '#fff' }}>
                    {t(item.labelKey)}
                  </span>
                  <span className="text-sm leading-7" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t(item.contentKey)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
