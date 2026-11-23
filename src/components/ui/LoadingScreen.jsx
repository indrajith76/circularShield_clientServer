import BrandLogo from '../common/BrandLogo';

export const LoadingScreen = ({ message = 'Verifying security credentials...' }) => {
  return (
    <div className="min-h-screen w-full bg-[#F7F9FA] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="space-y-6 max-w-sm flex flex-col items-center">
        {/* Animated Brand Shield Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#087F70]/20 rounded-full blur-xl animate-pulse pointer-events-none" />
          <BrandLogo size="lg" showTagline={false} />
        </div>

        {/* Loading Spinner & Status Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087F70] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#102C3A] animate-bounce" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#102C3A]">
            {message}
          </p>
          <p className="text-[11px] text-[#64748B]">
            CircularShield Cryptographic Threat Engine Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
