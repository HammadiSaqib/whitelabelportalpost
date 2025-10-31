import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Lock, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface DomainCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: string;
    description?: string;
  };
  domainPath: string;
  referralCode?: string;
}

export default function DomainCheckoutModal({ isOpen, onClose, plan, domainPath, referralCode }: DomainCheckoutModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Create payment intent when modal opens
  useEffect(() => {
    console.log('DomainCheckoutModal useEffect triggered:', { isOpen, plan });
    if (isOpen && plan) {
      const createPaymentIntent = async () => {
        try {
          console.log('Creating payment intent for plan:', plan);
          const response = await apiRequest('POST', '/api/create-payment-intent', {
            planId: parseInt(plan.id),
            amount: parseFloat(plan.price) || 0
          });
          const data = await response.json();
          console.log('Payment intent created:', data);
          setPaymentData(data);
        } catch (error) {
          console.error('Error creating payment intent:', error);
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      };
      createPaymentIntent();
    }
  }, [isOpen, plan, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '');
    
    // Limit to 4 digits (MMYY)
    const limited = v.substring(0, 4);
    
    // Add slash after 2 digits
    if (limited.length >= 2) {
      return limited.substring(0, 2) + '/' + limited.substring(2);
    }
    return limited;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan) {
      toast({
        title: "Error",
        description: "Plan not found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const requiredFields = [
      { field: 'email', value: formData.email, label: 'Email' },
      { field: 'nameOnCard', value: formData.nameOnCard, label: 'Name on Card' },
      { field: 'cardNumber', value: formData.cardNumber.replace(/\s/g, ''), label: 'Card Number' },
      { field: 'expiryDate', value: formData.expiryDate, label: 'Expiry Date' },
      { field: 'cvv', value: formData.cvv, label: 'CVV' },
      { field: 'address', value: formData.address, label: 'Address' },
      { field: 'city', value: formData.city, label: 'City' },
      { field: 'state', value: formData.state, label: 'State' },
      { field: 'zipCode', value: formData.zipCode, label: 'ZIP Code' }
    ];

    const missingFields = requiredFields.filter(field => !field.value?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in the following fields: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Additional validation for card number (basic length check)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number.",
        variant: "destructive",
      });
      return;
    }

    // Validate CVV length
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV (3-4 digits).",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 CLIENT: Starting payment process', {
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        domainPath,
        referralCode,
        timestamp: new Date().toISOString()
      });

      // Prepare payment data for NMI endpoint
      const paymentPayload = {
        planId: plan.id,
        amount: plan.price,
        cardNumber: cleanCardNumber,
        expirationDate: formData.expiryDate.replace('/', ''),
        cvv: formData.cvv,
        firstName: formData.nameOnCard.split(' ')[0] || formData.nameOnCard,
        lastName: formData.nameOnCard.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        referralCode: referralCode || ''
      };

      console.log('💳 CLIENT: Payment payload prepared', {
        planId: paymentPayload.planId,
        amount: paymentPayload.amount,
        cardNumberMasked: paymentPayload.cardNumber.replace(/\d(?=\d{4})/g, '*'),
        expirationDate: paymentPayload.expirationDate,
        firstName: paymentPayload.firstName,
        lastName: paymentPayload.lastName,
        email: paymentPayload.email,
        hasReferralCode: !!paymentPayload.referralCode,
        timestamp: new Date().toISOString()
      });

      console.log('📤 CLIENT: Sending payment request to server...');
      const response = await apiRequest('/api/confirm-nmi-payment', 'POST', paymentPayload);
      
      console.log('📥 CLIENT: Received response from server', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });

      const result = await response.json();
      
      console.log('🔍 CLIENT: Parsed response data', {
        success: result.success,
        transactionId: result.transactionId,
        error: result.error,
        message: result.message,
        details: result.details,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        console.log('✅ CLIENT: Payment successful!', {
          transactionId: result.transactionId,
          planName: plan.name,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Payment Successful!",
          description: `You have successfully purchased ${plan.name}. Transaction ID: ${result.transactionId}`,
        });

        // Reset form
        setFormData({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          nameOnCard: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        });

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        console.error('❌ CLIENT: Payment failed from server', {
          error: result.error,
          message: result.message,
          details: result.details,
          planId: plan.id,
          amount: plan.price,
          timestamp: new Date().toISOString()
        });
        throw new Error(result.message || result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('❌ CLIENT: Payment processing error', {
        error: error.message,
        stack: error.stack,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        domainPath,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 CLIENT: Payment process completed', {
        timestamp: new Date().toISOString()
      });
    }
  };

  const planPrice = parseFloat(plan.price) || 0;
  const displayPrice = planPrice > 0 ? `$${planPrice.toFixed(2)}` : 'Free';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{displayPrice}</div>
                  <div className="text-sm text-gray-500">one-time</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Domain:</strong> {domainPath}
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Doe"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                  name="nameOnCard"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                  <CreditCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    name="cvv"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  name="address"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    name="city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                    name="state"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    name="zipCode"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Your payment information is secure and encrypted</span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Purchase {displayPrice}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}