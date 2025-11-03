import { BrandLogo } from '@/components/BrandLogo';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

export function Footer() {
  const { whiteLabel, isLoading } = useWhiteLabel();

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="h-8 w-32 bg-gray-700 animate-pulse rounded"></div>
            </div>
            <div className="text-sm text-gray-400">
              Loading...
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();
  const companyName = whiteLabel?.businessName || 'White Label Portal';

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <BrandLogo 
              size="sm" 
              className="text-white"
            />
          </div>
          <div className="text-sm text-gray-400">
            © {currentYear} {companyName}. All rights reserved.
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <a href="/privacy" className="hover:text-white mr-4">Privacy Policy</a>
              <a href="/terms" className="hover:text-white mr-4">Terms of Service</a>
              <a href="/support" className="hover:text-white">Support</a>
            </div>
            <div>
              Powered by White Label Portal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}