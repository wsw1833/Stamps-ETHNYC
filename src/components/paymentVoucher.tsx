import { cn } from '@/lib/utils';
import {
  MapPin,
  Train,
  Building2,
  Coffee,
  Utensils,
  Wine,
  Bed,
  Crown,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
import walrus from '@/images/walrus.png';

interface voucherStampProps {
  tokenId?: string;
  voucherType?: string;
  priceOffer?: string;
  validUntil?: string;
  ipfs?: string;
  status?: string;
  className?: string;
  applyVoucher?: () => void;
  variant?:
    | 'taxi'
    | 'subway'
    | 'manhattan'
    | 'coffee'
    | 'restaurant'
    | 'bar'
    | 'hotel'
    | 'luxury';
}

const PaymentVoucher = ({
  voucherType = 'NYC METRO VOUCHER',
  priceOffer = '50% OFF',
  validUntil = 'DEC 31, 2024',
  ipfs,
  status,
  className,
  variant = 'subway',
  applyVoucher,
}: voucherStampProps) => {
  const variants = {
    taxi: 'bg-nyc-taxi text-nyc-black border-nyc-black',
    subway: 'bg-nyc-subway text-nyc-white border-nyc-white',
    manhattan:
      'bg-gradient-to-br from-nyc-manhattan to-nyc-manhattan/80 text-nyc-white border-nyc-white',
    coffee: 'bg-food-coffee text-nyc-white border-nyc-white',
    restaurant: 'bg-food-pizza text-nyc-white border-nyc-white',
    bar: 'bg-food-wine text-nyc-white border-nyc-white',
    hotel: 'bg-hotel-luxury text-nyc-white border-nyc-white',
    luxury:
      'bg-gradient-to-br from-hotel-luxury to-hotel-gold text-nyc-white border-hotel-gold',
  };

  const getIcon = () => {
    switch (variant) {
      case 'taxi':
        return <Building2 className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'subway':
        return <Train className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'manhattan':
        return <MapPin className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'coffee':
        return <Coffee className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'restaurant':
        return <Utensils className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'bar':
        return <Wine className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'hotel':
        return <Bed className="sm:w-8 sm:h-8 w-6 h-6" />;
      case 'luxury':
        return <Crown className="sm:w-8 sm:h-8 w-6 h-6" />;
      default:
        return <Globe className="sm:w-8 sm:h-8 w-6 h-6" />;
    }
  };

  const ipfsHandler = () => {
    window.open(ipfs, '_blank');
  };

  return (
    <div
      className={cn(
        'relative inline-block w-full border-4 border-solid',
        'h-32 sm:h-40 md:h-48',
        'max-w-sm sm:max-w-md md:max-w-lg',
        'shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-1',
        variants[variant],
        className
      )}
      onClick={applyVoucher}
    >
      {/* Corner squares - responsive sizing */}
      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-current"></div>
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-current"></div>
      <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-current"></div>
      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-current"></div>

      {/* Grid pattern overlay - responsive insets */}
      <div className="absolute inset-2 sm:inset-3 md:inset-4 border border-current opacity-20"></div>
      <div className="absolute inset-3 sm:inset-4 md:inset-6 border border-current opacity-10"></div>

      {/* Content - Horizontal Layout */}
      <div className="relative z-10 h-full flex items-center p-2 sm:p-3 md:p-4 text-center">
        {/* Left Section - Icon and Type */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          <div className="flex items-center justify-center scale-75 sm:scale-90 md:scale-100">
            {getIcon()}
          </div>
          <h2 className="text-xs sm:text-sm md:text-sm font-bold tracking-wider font-sans uppercase leading-tight px-1">
            {voucherType}
          </h2>
        </div>

        {/* Vertical divider */}
        <div className="h-16 sm:h-20 md:h-24 border-l-2 border-current opacity-50 mx-2 sm:mx-3"></div>

        {/* Center Section - Price Offer */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-lg sm:text-xl md:text-2xl font-black text-center leading-none">
            {priceOffer}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-16 sm:h-20 md:h-24 border-l-2 border-current opacity-50 mx-2 sm:mx-3"></div>

        {/* Right Section - Valid Until and IPFS */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          <div className="text-xs sm:text-xs uppercase tracking-wider font-medium opacity-90 px-1">
            VALID UNTIL
          </div>
          <div className="text-xs sm:text-sm md:text-sm font-bold tracking-wide">
            {validUntil}
          </div>

          {/* IPFS Button */}
          <button
            onClick={ipfsHandler}
            className="mt-2 p-1.5 bg-current/10 border border-current rounded-full hover:bg-current/70 transition-colors duration-200 flex items-center"
          >
            <Image
              src={walrus}
              alt="walrus"
              className="sm:w-8 sm:h-8 w-6 h-6 rounded-full"
            />
          </button>
        </div>

        {/* Bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-current opacity-20"></div>
      </div>

      {/* Top and bottom perforations effect - responsive positioning */}
      <div className="absolute top-0 left-4 sm:left-6 md:left-8 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute top-0 left-12 sm:left-16 md:left-20 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute top-0 right-12 sm:right-16 md:right-20 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute top-0 right-4 sm:right-6 md:right-8 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>

      <div className="absolute bottom-0 left-4 sm:left-6 md:left-8 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute bottom-0 left-12 sm:left-16 md:left-20 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute bottom-0 right-12 sm:right-16 md:right-20 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
      <div className="absolute bottom-0 right-4 sm:right-6 md:right-8 w-4 sm:w-6 md:w-8 h-1 bg-current opacity-30"></div>
    </div>
  );
};

export default PaymentVoucher;
