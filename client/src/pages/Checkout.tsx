import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

export default function Checkout() {
  console.log("Checkout component started rendering");

  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/checkout/:planId");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const planId = params?.planId ? parseInt(params.planId) : null;

  // Get plan details
  const {
    data: plan,
    isLoading: planLoading,
    error: planError,
  } = useQuery({
    queryKey: ["/api/plans", planId],
    queryFn: () =>
      apiRequest("GET", `/api/plans/${planId}`).then((res) => res.json()),
    enabled: !!planId,
  });

  // Debug logging
  console.log("Checkout Debug:", { planId, plan, planLoading, planError });
  console.log("Checkout component rendering - URL params:", params);

  // Early return to test if component is rendering
  if (!planId) {
    console.log("No planId found, returning early");
    return <div>No plan ID found</div>;
  }

  if (planLoading) {
    console.log("Plan is loading, showing loading state");
    return <div>Loading plan...</div>;
  }

  if (planError) {
    console.log("Plan error:", planError);
    return <div>Error loading plan</div>;
  }

  if (!plan) {
    console.log("No plan data found");
    return <div>Plan not found</div>;
  }

  console.log("Checkout component should render fully now");

  // Create payment intent when component loads
  useEffect(() => {
    if (plan && planId) {
      const createPaymentIntent = async () => {
        try {
          const response = await apiRequest(
            "POST",
            "/api/create-payment-intent",
            {
              planId: planId,
              amount: parseFloat(plan.monthlyPrice),
            },
          );
          const data = await response.json();
          setPaymentData(data);
        } catch (error) {
          console.error("Error creating payment intent:", error);
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      };

      createPaymentIntent();
    }
  }, [plan, planId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData || !plan) {
      toast({
        title: "Error",
        description: "Payment not initialized. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate NMI payment processing
      const paymentResult = {
        response: "1", // Success response
        responsetext: "SUCCESS",
        amount: plan.monthlyPrice,
        transactionid: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderid: paymentData.clientSecret,
      };

      // Confirm payment with backend
      const response = await apiRequest("POST", "/api/confirm-nmi-payment", {
        orderId: paymentData.clientSecret,
        planId: planId,
        userId: "user_" + Date.now(), // In real app, this would come from auth
        paymentResult: paymentResult,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Payment Successful!",
          description: `You have successfully purchased ${plan.name}. Your files are ready for download.`,
        });

        // Redirect to success page with download files
        sessionStorage.setItem("purchaseResult", JSON.stringify(result));
        setLocation("/purchase-success");
      } else {
        throw new Error(result.message || "Payment failed");
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

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Plan Not Found
            </CardTitle>
            <CardDescription className="text-center">
              The plan you're trying to purchase could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${plan.monthlyPrice}</div>
                  <div className="text-sm text-gray-500">one-time</div>
                </div>
              </div>

              {plan.features && (
                <div>
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {typeof plan.features === "object" &&
                    "products" in plan.features &&
                    Array.isArray(plan.features.products) ? (
                      plan.features.products.map(
                        (productId: number, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Digital Product #{productId}
                          </li>
                        ),
                      )
                    ) : (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Digital content and resources
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${plan.monthlyPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                Your payment information is encrypted and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    placeholder="John Doe"
                    value={formData.nameOnCard}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nameOnCard: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cardNumber"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d{4})(?=\d)/g, "$1 ");
                      setFormData((prev) => ({ ...prev, cardNumber: value }));
                    }}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        const limited = v.substring(0, 4);
                        const value =
                          limited.length >= 2
                            ? limited.substring(0, 2) +
                              "/" +
                              limited.substring(2)
                            : limited;
                        setFormData((prev) => ({ ...prev, expiryDate: value }));
                      }}
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
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData((prev) => ({ ...prev, cvv: value }));
                      }}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={formData.zip}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData((prev) => ({ ...prev, zip: value }));
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !paymentData}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Purchase - $${plan.monthlyPrice}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our terms of service
                  and privacy policy. Your payment is secured with 256-bit SSL
                  encryption.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
