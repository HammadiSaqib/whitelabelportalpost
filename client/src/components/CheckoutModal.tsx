import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Lock, CheckCircle, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  referralCode?: string;
}

export default function CheckoutModal({ isOpen, onClose, plan, referralCode }: CheckoutModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    referralCode: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  // Update referral code when prop changes
  useEffect(() => {
    if (referralCode && formData.referralCode !== referralCode) {
      setFormData(prev => ({ ...prev, referralCode }));
    }
  }, [referralCode, formData.referralCode]);

  // Create payment intent when modal opens
  useEffect(() => {
    console.log('CheckoutModal useEffect triggered:', { isOpen, plan });
    if (isOpen && plan && plan.monthlyPrice) {
      const createPaymentIntent = async () => {
        try {
          console.log('Creating payment intent for plan:', plan);
          const response = await apiRequest('/api/create-payment-intent', 'POST', {
            planId: plan.id,
            amount: parseFloat(plan.monthlyPrice)
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
    // Remove all non-digits and limit to 4 digits max (MMYY)
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 4);
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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

    setLoading(true);
    try {
      // Prepare payment data for NMI endpoint
      const paymentPayload = {
        planId: plan.id,
        amount: plan.monthlyPrice,
        cardNumber: formData.cardNumber.replace(/\s/g, ''), // Remove spaces
        expirationDate: formData.expiryDate,
        cvv: formData.cvv,
        firstName: formData.nameOnCard.split(' ')[0] || formData.nameOnCard,
        lastName: formData.nameOnCard.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        referralCode: formData.referralCode || ''
      };

      const response = await apiRequest('/api/confirm-nmi-payment', 'POST', paymentPayload);

      const result = await response.json();
      
      if (result.success) {
        // Track purchase activity for white-label client dashboard
        try {
          await apiRequest('/api/end-users/track-activity', 'POST', {
            userId: result.userId || 'guest-' + Date.now(),
            whiteLabelId: result.whiteLabelId,
            activityType: 'purchase',
            description: `Purchased plan: ${plan.name}`,
            metadata: {
              planId: plan.id,
              planName: plan.name,
              amount: result.amount || plan.monthlyPrice,
              paymentMethod: 'NMI Gateway',
              transactionId: result.transactionId,
              subscriptionId: result.subscriptionId
            }
          });
        } catch (error) {
          console.warn('Failed to track purchase activity:', error);
        }

        toast({
          title: "Payment Successful!",
          description: `You have successfully purchased ${plan.name}. Transaction ID: ${result.transactionId}`,
        });

        // Close modal and show success
        onClose();
        
        // Store purchase result and redirect to success page
        sessionStorage.setItem('purchaseResult', JSON.stringify({
          ...result,
          planName: plan.name,
          planDescription: plan.description
        }));
        window.location.href = '/purchase-success';
      } else {
        throw new Error(result.message || result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  const displayPrice = plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 
    ? `$${plan.monthlyPrice}` 
    : 'Contact for Pricing';

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Your Purchase</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Summary */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-primary mb-4">
                  {displayPrice}
                  {plan.monthlyPrice && <span className="text-lg text-muted-foreground">/month</span>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Full access to platform
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Premium support included
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Money-back guarantee
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              Secure 256-bit SSL encryption
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Referral code field hidden from UI but kept in code for functionality */}
                  {false && (
                    <div style={{ display: 'none' }}>
                      <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                      <Input
                        id="referralCode"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleInputChange}
                        placeholder="Enter referral code"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Billing Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="NY"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      placeholder="10001"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Complete Purchase - ${displayPrice}`
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-4">Contact us for pricing</h3>
                <p className="text-gray-600 mb-6">
                  This plan requires custom pricing. Our team will contact you with a personalized quote.
                </p>
                <Button 
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Quote
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}