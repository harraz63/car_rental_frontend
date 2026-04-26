import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Car, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal/15 rounded-full blur-[80px] animate-pulse animation-delay-2000" />
        
        {/* Floating car silhouettes */}
        <div className="absolute top-1/3 left-10 opacity-10 animate-float">
          <Car className="w-32 h-32 text-cyan" />
        </div>
        <div className="absolute bottom-1/4 right-20 opacity-10 animate-float animation-delay-3000">
          <Car className="w-24 h-24 text-teal" />
        </div>
      </div>

      <div className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="text-sm text-slate-300">نظام تأجير السيارات المتكامل</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">استأجر سيارتك</span>
                <br />
                <span className="gradient-text">بكل سهولة وأمان</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                اكتشف مجموعتنا الواسعة من السيارات الفاخرة والاقتصادية. 
                احجز الآن واستمتع بتجربة قيادة لا مثيل لها مع أفضل الأسعار.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/cars">
                  <Button size="lg" className="btn-primary text-lg px-8">
                    استعرض السيارات
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="btn-secondary text-lg px-8">
                    سجل الآن
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-cyan/20">
                <div className="text-center lg:text-right">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">+50</div>
                  <div className="text-sm text-slate-400">سيارة متاحة</div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">+1000</div>
                  <div className="text-sm text-slate-400">عميل سعيد</div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">24/7</div>
                  <div className="text-sm text-slate-400">دعم فني</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="glass-card-strong p-6 relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
                    alt="Luxury Car"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  
                  {/* Overlay info */}
                  <div className="absolute bottom-10 right-6 left-6 glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">مرسيدس بنز S-Class</h3>
                        <p className="text-sm text-slate-400">فئة فاخرة</p>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold gradient-text">450 ر.س</div>
                        <div className="text-xs text-slate-400">/يوم</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating feature cards */}
                <div className="absolute -top-6 -right-6 glass-card p-4 animate-float">
                  <Shield className="w-8 h-8 text-cyan mb-2" />
                  <div className="text-sm font-medium text-white">تأمين شامل</div>
                  <div className="text-xs text-slate-400">على جميع السيارات</div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass-card p-4 animate-float animation-delay-2000">
                  <Clock className="w-8 h-8 text-teal mb-2" />
                  <div className="text-sm font-medium text-white">استلام فوري</div>
                  <div className="text-xs text-slate-400">خلال 30 دقيقة</div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan/20 to-teal/20 rounded-2xl blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  );
};

export default HeroSection;
