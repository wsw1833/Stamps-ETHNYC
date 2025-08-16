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
import pinata from '@/images/pinata.svg';
import Image from 'next/image';

interface voucherStampProps {
  tokenId?: string;
  voucherType?: string;
  priceOffer?: string;
  validUntil?: string;
  ipfs?: string;
  status?: string;
  className?: string;
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

const VoucherStamp = ({
  voucherType,
  priceOffer,
  validUntil,
  ipfs,
  className,
  variant = 'subway',
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

  const ipfsHandler = () => {
    window.open(
      `turquoise-perfect-caterpillar-941.mypinata.cloud/ipfs/${ipfs}`,
      '_blank'
    );
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

  return (
    <div
      className={cn(
        'relative inline-block w-full aspect-[4/5] border-4 border-solid',
        'shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-2',
        'min-h-[280px] max-w-[320px] mx-auto ',
        'sm:min-h-[300px] lg:min-h-[320px]',
        variants[variant],
        className
      )}
    >
      {/* Corner squares */}
      <div className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-2 border-current"></div>
      <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-2 border-current"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-2 border-current"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-2 border-current"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-3 sm:inset-4 border border-current opacity-20"></div>
      <div className="absolute inset-6 sm:inset-8 border border-current opacity-10"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-6 text-center space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-wider font-sans uppercase leading-tight">
          {voucherType}
        </h2>

        <div className="flex items-center justify-center">{getIcon()}</div>

        <div className="w-full border-t-2 border-current opacity-50 my-1 sm:my-2"></div>

        <div className="text-lg sm:text-3xl lg:text-4xl font-black text-center leading-none">
          {priceOffer}
        </div>

        <div className="w-full border-t-2 border-current opacity-50 my-1 sm:my-2"></div>

        <div className="text-xs sm:text-sm uppercase tracking-wider font-medium opacity-90">
          VALID UNTIL
        </div>

        <div className="text-sm sm:text-base lg:text-lg font-bold tracking-wide">
          {validUntil}
        </div>

        {/* IPFS Button */}
        <button
          onClick={ipfsHandler}
          className="mt-3 p-1.5 bg-current/10 border border-current rounded-full hover:bg-current/70 transition-colors duration-200 flex items-center"
        >
          <Image
            src={pinata}
            alt="pinata"
            className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
          />
        </button>

        {/* Bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 bg-current opacity-20"></div>
      </div>

      {/* Side perforations effect - responsive positioning */}
      <div className="absolute left-0 top-6 sm:top-8 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute left-0 top-16 sm:top-20 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute left-0 bottom-16 sm:bottom-20 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute left-0 bottom-6 sm:bottom-8 w-1 h-6 sm:h-8 bg-current opacity-30"></div>

      <div className="absolute right-0 top-6 sm:top-8 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute right-0 top-16 sm:top-20 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute right-0 bottom-16 sm:bottom-20 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
      <div className="absolute right-0 bottom-6 sm:bottom-8 w-1 h-6 sm:h-8 bg-current opacity-30"></div>
    </div>
  );
};

export default VoucherStamp;
