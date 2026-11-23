import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#DC4B4B] flex items-center justify-center shadow-xs">
        <ShieldAlert size={36} />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102C3A]">
          404 — Page Not Found
        </h2>
        <p className="text-sm text-[#64748B] max-w-sm mx-auto">
          The requested verification route or resource does not exist or has been relocated.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          leftIcon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="secondary"
          size="md"
          leftIcon={Home}
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
