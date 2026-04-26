import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="glass-card overflow-hidden group glow-effect transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Availability badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
          car.is_available 
            ? 'bg-teal/20 text-teal border border-teal/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {car.is_available ? 'متاح' : 'غير متاح'}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3 glass-card px-3 py-1">
          <span className="text-cyan font-bold">{car.daily_price}</span>
          <span className="text-slate-400 text-sm mr-1">ر.س/يوم</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
          {car.brand} {car.model}
        </h3>
        
        {/* Year */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>موديل {car.year}</span>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {car.specifications.seats && (
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-dark-navy/30">
              <Users className="w-4 h-4 text-cyan" />
              <span className="text-xs text-slate-400">{car.specifications.seats} مقاعد</span>
            </div>
          )}
          {car.specifications.transmission && (
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-dark-navy/30">
              <Settings className="w-4 h-4 text-cyan" />
              <span className="text-xs text-slate-400">{car.specifications.transmission}</span>
            </div>
          )}
          {car.specifications.fuel_type && (
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-dark-navy/30">
              <Fuel className="w-4 h-4 text-cyan" />
              <span className="text-xs text-slate-400">{car.specifications.fuel_type}</span>
            </div>
          )}
        </div>

        {/* Action button */}
        <Link to={`/cars/${car.id}`}>
          <Button 
            className="w-full btn-primary"
            disabled={!car.is_available}
          >
            {car.is_available ? 'احجز الآن' : 'غير متاح'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
