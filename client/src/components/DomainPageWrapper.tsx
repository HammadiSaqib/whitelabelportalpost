import { useState, useEffect } from 'react';
import DomainCheckoutModal from './DomainCheckoutModal';

interface CheckoutData {
  plan: {
    id: string;
    name: string;
    price: string;
    description: string;
  };
  domainPath: string;
}

export default function DomainPageWrapper({ children }: { children: React.ReactNode }) {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    console.log('DomainPageWrapper mounted, setting up event listeners');
    
    // Listen for checkout modal events from server-generated pages
    const handleCheckoutModal = (event: CustomEvent<CheckoutData>) => {
      console.log('Checkout modal event received:', event.detail);
      setCheckoutData(event.detail);
      setCheckoutModalOpen(true);
    };

    window.addEventListener('openCheckoutModal', handleCheckoutModal as EventListener);
    
    // Initialize server-side checkout functionality
    if (window.initializeCheckoutModal) {
      window.initializeCheckoutModal();
    }
    
    // Test event system with a simple test event
    setTimeout(() => {
      console.log('Testing event system...');
      const testEvent = new CustomEvent('test-event', { detail: 'test' });
      window.dispatchEvent(testEvent);
    }, 1000);
    
    // Listen for test event
    const testHandler = (e: any) => console.log('Test event received:', e.detail);
    window.addEventListener('test-event', testHandler);
    
    // Test event system
    console.log('Event listener setup complete');

    return () => {
      console.log('DomainPageWrapper unmounting, removing event listeners');
      window.removeEventListener('openCheckoutModal', handleCheckoutModal as EventListener);
      window.removeEventListener('test-event', testHandler);
    };
  }, []);

  const handleCloseModal = () => {
    setCheckoutModalOpen(false);
    setCheckoutData(null);
  };

  return (
    <>
      {children}
      {checkoutData && (
        <DomainCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={handleCloseModal}
          plan={checkoutData.plan}
          domainPath={checkoutData.domainPath}
        />
      )}
    </>
  );
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    initializeCheckoutModal?: () => void;
  }
}