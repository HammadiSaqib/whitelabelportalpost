import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, DollarSign, Calendar, Mail, User, Eye, TrendingUp, ShoppingCart, CreditCard, Upload, FileImage, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AffiliatesPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  const [showAffiliateDetails, setShowAffiliateDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAffiliateForPayment, setSelectedAffiliateForPayment] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);

  // Payment History Modal State
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedAffiliateForHistory, setSelectedAffiliateForHistory] = useState<any>(null);

  // Query for all platform affiliates (Super Admin and White Label Client view)
  const { data: affiliates = [], isLoading: affiliatesLoading } = useQuery({
    queryKey: ['/api/affiliates'],
    enabled: !!user && isAuthenticated && (user.role === 'super_admin' || user.role === 'white_label_client'),
  });

  // Query for top affiliates
  const { data: topAffiliates = [], isLoading: topAffiliatesLoading } = useQuery({
    queryKey: ['/api/top-affiliates'],
    enabled: !!user && isAuthenticated,
  });

  // Query for affiliate payment summary (replaces commission data)
  const { data: paymentSummary = [], isLoading: paymentSummaryLoading } = useQuery({
    queryKey: ['/api/affiliate-payment-summary'],
    enabled: !!user && isAuthenticated && (user.role === 'super_admin' || user.role === 'super_admin_affiliate' || user.role === 'white_label_client'),
  });

  // Query for commission data (still needed for affiliate details modal)
  const { data: commissionData = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/commissions'],
    enabled: !!user && isAuthenticated,
  });

  // Query for detailed affiliate data when one is selected
  const { data: affiliateDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['/api/affiliate-details', selectedAffiliate?.id],
    queryFn: () => selectedAffiliate ? apiRequest(`/api/affiliate-details/${selectedAffiliate.id}`) : null,
    enabled: !!selectedAffiliate?.id,
  });

  // Query for affiliate payment account details when payment modal is open
  const { data: paymentAccount, isLoading: paymentAccountLoading } = useQuery({
    queryKey: ['/api/affiliate-payment-account', selectedAffiliateForPayment?.id],
    queryFn: async () => {
      if (!selectedAffiliateForPayment) return null;
      console.log('🔍 React Query fetching payment account for:', selectedAffiliateForPayment.id);
      const response = await apiRequest(`/api/affiliate-payment-account/${selectedAffiliateForPayment.id}`);
      const data = await response.json();
      console.log('📥 Raw API Response Data:', data);
      return data;
    },
    enabled: !!selectedAffiliateForPayment?.id && showPaymentModal,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the response
  });

  // Query for affiliate payment history when history modal is open
  const { data: paymentHistory, isLoading: paymentHistoryLoading } = useQuery({
    queryKey: ['/api/affiliate-payments', selectedAffiliateForHistory?.id],
    queryFn: async () => {
      if (!selectedAffiliateForHistory) return null;
      console.log('📜 Fetching payment history for affiliate:', selectedAffiliateForHistory.id);
      const response = await apiRequest(`/api/affiliate-payments/${selectedAffiliateForHistory.id}`);
      const data = await response.json();
      console.log('📜 Payment History Data:', data);
      return data;
    },
    enabled: !!selectedAffiliateForHistory?.id && showPaymentHistoryModal,
    staleTime: 0,
    cacheTime: 0,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'super_admin_affiliate':
        return 'Super Admin Affiliate';
      case 'white_label_affiliate':
        return 'White Label Affiliate';
      case 'end_user':
        return 'End User';
      default:
        return role;
    }
  };

  if (!isAuthenticated || !user) {
    return <div>Please log in to access this page.</div>;
  }

  const handleViewDetails = (affiliate: any) => {
    setSelectedAffiliate(affiliate);
    setShowAffiliateDetails(true);
  };

  const handlePayAffiliate = (affiliate: any) => {
    console.log('🎯 Payment modal opening for affiliate:', affiliate.id, affiliate.name);
    setSelectedAffiliateForPayment(affiliate);
    setPaymentAmount(affiliate.needToPay.toString());
    setShowPaymentModal(true);
    // Force invalidate any cached payment account data
    queryClient.invalidateQueries({ queryKey: ['/api/affiliate-payment-account'] });
  };

  const handleViewPaymentHistory = (affiliate: any) => {
    setSelectedAffiliateForHistory(affiliate);
    setShowPaymentHistoryModal(true);
  };

  const handleExportPaymentHistory = async (affiliate: any) => {
    try {
      if (!affiliate?.id) return;
      
      // Fetch payment history for export
      const response = await apiRequest(`/api/affiliate-payments/${affiliate.id}`);
      const historyData = await response.json();
      
      if (!historyData || historyData.length === 0) {
        toast({
          title: "No Payment History",
          description: "This affiliate has no payment history to export.",
          variant: "destructive",
        });
        return;
      }

      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // PDF Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Payment History Report', 20, 25);
      
      doc.setFontSize(14);
      doc.text(`Affiliate: ${affiliate.name}`, 20, 35);
      doc.text(`Email: ${affiliate.email}`, 20, 43);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 51);
      
      // Summary Statistics
      const totalAmount = historyData.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount || 0), 0);
      const totalPayments = historyData.length;
      
      doc.setFontSize(12);
      doc.text(`Total Payments: ${totalPayments}`, 20, 65);
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 73);
      
      // Add a line separator
      doc.setLineWidth(0.5);
      doc.line(20, 80, 190, 80);
      
      let yPosition = 95;
      
      // Payment Records
      for (let i = 0; i < historyData.length; i++) {
        const payment = historyData[i];
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 25;
        }
        
        // Payment details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Payment #${i + 1}`, 20, yPosition);
        
        doc.setFontSize(10);
        doc.text(`Date: ${formatDate(payment.createdAt)}`, 20, yPosition + 8);
        doc.text(`Amount: $${parseFloat(payment.amount || 0).toFixed(2)}`, 20, yPosition + 16);
        doc.text(`Method: ${payment.paymentMethod || 'Bank Transfer'}`, 20, yPosition + 24);
        doc.text(`Status: ${payment.status || 'Completed'}`, 20, yPosition + 32);
        
        if (payment.description) {
          doc.text(`Description: ${payment.description}`, 20, yPosition + 40);
        }
        
        // Add transfer details with historical bank information
        if (payment.historicalBankName && payment.historicalAccountNumber) {
          const transferText = `Transfer To: ${payment.historicalBankName} ${payment.historicalAccountNumber}`;
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(transferText, 20, yPosition + (payment.description ? 48 : 40));
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
        }
        
        // Add proof image if available
        if (payment.transactionProofUrl || payment.receiptImageUrl) {
          const imageUrl = payment.transactionProofUrl || payment.receiptImageUrl;
          try {
            // Create an image element to load the image
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                try {
                  // Create canvas to convert image to base64
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  
                  const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                  
                  // Add image to PDF (much smaller size)
                  const imgWidth = 30;
                  const imgHeight = (img.height / img.width) * imgWidth;
                  
                  // Check if image fits on current page
                  if (yPosition + 50 + imgHeight > 280) {
                    doc.addPage();
                    yPosition = 25;
                  }
                  
                  doc.addImage(dataURL, 'JPEG', 150, yPosition + 8, imgWidth, imgHeight);
                  doc.text('Proof:', 150, yPosition);
                  
                  resolve(null);
                } catch (error) {
                  console.error('Error processing image:', error);
                  doc.text('Proof Image: Available', 120, yPosition);
                  resolve(null);
                }
              };
              
              img.onerror = () => {
                doc.text('Proof Image: Available', 120, yPosition);
                resolve(null);
              };
              
              img.src = imageUrl;
            });
          } catch (error) {
            console.error('Error loading image:', error);
            doc.text('Proof: Available', 150, yPosition);
          }
        } else {
          doc.text('Proof: Not Available', 150, yPosition);
        }
        
        // Add separator line
        yPosition += 60;
        doc.setLineWidth(0.2);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
      }
      
      // Save the PDF
      doc.save(`${affiliate.name}_payment_history.pdf`);

      toast({
        title: "Export Successful",
        description: `Payment history PDF exported for ${affiliate.name}`,
      });
    } catch (error) {
      console.error('Error exporting payment history:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export payment history PDF.",
        variant: "destructive",
      });
    }
  };

  // Mutation for creating affiliate payment
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      let proofImageUrl = null;
      
      // Upload proof image if provided
      if (proofFile) {
        const formData = new FormData();
        formData.append('proofImage', proofFile);
        
        const uploadResponse = await fetch('/api/upload-payment-proof', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          proofImageUrl = uploadResult.imageUrl;
        } else {
          const errorData = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(`Failed to upload proof image: ${errorData.error || 'Unknown error'}`);
        }
      }
      
      // Include proof image URL in payment data
      const finalPaymentData = {
        ...paymentData,
        transactionProofUrl: proofImageUrl,
      };
      
      return await apiRequest('/api/affiliate-payment', 'POST', finalPaymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-payment-summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-payments'] });
      setShowPaymentModal(false);
      setSelectedAffiliateForPayment(null);
      setPaymentAmount('');
      setPaymentDescription('');
      setProofFile(null);
      toast({
        title: "Success",
        description: "Payment recorded successfully with proof image",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliate Partners</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Look at your top performing affiliate partners</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="pay">Pay</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
                  <Users className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>{affiliates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active affiliate partners
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lifetime Sales</CardTitle>
                  <DollarSign className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: secondaryColor || '#10b981' }}>
                    ${commissionData.reduce((sum: number, item: any) => sum + (item.totalRevenue || 0), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total referral revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>
                    {commissionData.reduce((sum: number, item: any) => sum + (item.totalReferrals || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Users referred by affiliates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Clean Top Performers List */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  🏆 Top Performers (Lifetime)
                </CardTitle>
                <CardDescription>Your affiliate partners will appear here once they start referring customers</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionsLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <div style={{ color: primaryColor || '#3b82f6' }}>Loading top affiliates...</div>
                  </div>
                ) : commissionData.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4" style={{ color: primaryColor || '#3b82f6', opacity: 0.3 }} />
                    <p className="font-medium text-lg" style={{ color: primaryColor || '#3b82f6' }}>No Affiliates Yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Your affiliate partners will appear here once they start referring customers
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {commissionData
                      .filter((commission: any) => commission.totalCommissions > 0)
                      .sort((a: any, b: any) => b.totalCommissions - a.totalCommissions)
                      .slice(0, 5)
                      .map((commission: any, index: number) => (
                      <div key={commission.affiliateId} className="flex items-center justify-between p-4 rounded-lg border" 
                           style={{ 
                             borderColor: `${primaryColor || '#3b82f6'}20`,
                             backgroundColor: 'white'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.backgroundColor = `${primaryColor || '#3b82f6'}05`;
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.backgroundColor = 'white';
                           }}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" 
                               style={{ 
                                 backgroundColor: `${primaryColor || '#3b82f6'}20`,
                                 color: primaryColor || '#3b82f6'
                               }}>
                            <span className="font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: primaryColor || '#3b82f6' }}>{commission.affiliateName}</p>
                            <p className="text-sm" style={{ color: secondaryColor || '#10b981' }}>{commission.affiliateEmail}</p>
                            <Badge variant="outline" className="text-xs mt-1" 
                                   style={{ 
                                     backgroundColor: `${secondaryColor || '#10b981'}20`,
                                     color: secondaryColor || '#10b981',
                                     borderColor: secondaryColor || '#10b981'
                                   }}>
                              {formatRole(commission.role)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-4">
                          <div>
                            <p className="font-bold text-lg" style={{ color: secondaryColor || '#10b981' }}>${commission.totalCommissions.toFixed(2)}</p>
                            <p className="text-sm" style={{ color: primaryColor || '#3b82f6' }}>${commission.totalRevenue.toFixed(2)} revenue</p>
                            <p className="text-xs" style={{ color: `${primaryColor || '#3b82f6'}80` }}>{commission.totalReferrals} referrals</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ 
                              borderColor: secondaryColor || '#10b981',
                              color: secondaryColor || '#10b981'
                            }}
                            onClick={() => handleViewDetails(commission.affiliateId)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🌟 Affiliate Partners</CardTitle>
                <CardDescription>All affiliate partners across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {affiliatesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500 dark:text-gray-400">Loading affiliates...</div>
                  </div>
                ) : affiliates.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4" style={{ color: primaryColor || '#3b82f6', opacity: 0.3 }} />
                    <p className="font-medium" style={{ color: primaryColor || '#3b82f6' }}>No Active Affiliates</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Affiliate partners who refer customers to your plans will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {affiliates.map((affiliate: any) => {
                      // Find commission data for this affiliate
                      const commissionInfo = commissionData.find((c: any) => c.affiliateId === affiliate.id);
                      return (
                        <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryColor || '#10b981'}20` }}>
                                <User className="w-5 h-5" style={{ color: secondaryColor || '#10b981' }} />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{affiliate.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail className="w-3 h-3 mr-1" style={{ color: primaryColor || '#3b82f6' }} />
                                {affiliate.email}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${primaryColor || '#3b82f6'}20`, color: primaryColor || '#3b82f6' }}>
                                  {formatRole(affiliate.role)}
                                </Badge>
                                {affiliate.whiteLabelBusiness && (
                                  <Badge variant="outline" className="text-xs" style={{ borderColor: secondaryColor || '#10b981', color: secondaryColor || '#10b981' }}>
                                    {affiliate.whiteLabelBusiness}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" style={{ color: primaryColor || '#3b82f6' }} />
                              {formatDate(affiliate.joinDate)}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {commissionInfo?.totalReferrals || 0} sales • ${commissionInfo?.totalRevenue?.toFixed(2) || '0.00'}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails({...affiliate, ...commissionInfo})}
                              className="mt-2 text-xs"
                              style={{ borderColor: primaryColor || '#3b82f6', color: primaryColor || '#3b82f6' }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pay" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>💳 Affiliate Payments</CardTitle>
                <CardDescription>Manage affiliate commission payments and track payment status</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentSummaryLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading payment data...</div>
                  </div>
                ) : paymentSummary.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4" style={{ color: primaryColor || '#3b82f6', opacity: 0.3 }} />
                    <p className="font-medium" style={{ color: primaryColor || '#3b82f6' }}>No Affiliates Found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Affiliate payment data will appear once affiliates start generating sales
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentSummary.map((affiliate: any) => (
                      <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor || '#3b82f6'}20` }}>
                              <CreditCard className="w-5 h-5" style={{ color: primaryColor || '#3b82f6' }} />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{affiliate.name}</p>
                            <p className="text-sm text-gray-500">{affiliate.email}</p>
                            <Badge variant="secondary" className="text-xs mt-1" style={{ backgroundColor: `${secondaryColor || '#10b981'}20`, color: secondaryColor || '#10b981' }}>
                              {formatRole(affiliate.role)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-gray-500">Total Commission</p>
                              <p className="font-medium" style={{ color: secondaryColor || '#10b981' }}>
                                ${affiliate.totalCommission.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Paid</p>
                              <p className="font-medium" style={{ color: primaryColor || '#3b82f6' }}>
                                ${affiliate.totalPaid.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Need to Pay</p>
                              <p className={`font-medium ${affiliate.needToPay > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                                ${affiliate.needToPay.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex flex-col space-y-2 justify-center">
                              {affiliate.needToPay > 0 ? (
                                <Button
                                  size="sm"
                                  onClick={() => handlePayAffiliate(affiliate)}
                                  className="text-xs"
                                  style={{ backgroundColor: secondaryColor || '#10b981', color: 'white' }}
                                  disabled={createPaymentMutation.isPending}
                                >
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Make Payment
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-400">Paid Up</span>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewPaymentHistory(affiliate)}
                                className="text-xs"
                                style={{ borderColor: primaryColor || '#3b82f6', color: primaryColor || '#3b82f6' }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Payment History
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Affiliate Details Dialog */}
      <Dialog open={showAffiliateDetails} onOpenChange={setShowAffiliateDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{selectedAffiliate?.name || 'Affiliate Details'}</span>
            </DialogTitle>
            <DialogDescription>
              Complete affiliate performance and earnings breakdown
            </DialogDescription>
          </DialogHeader>
          
          {detailsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading affiliate details...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Affiliate Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium">{selectedAffiliate?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <Badge variant="secondary">{formatRole(selectedAffiliate?.role)}</Badge>
                </div>
              </div>

              {/* Simplified Analytics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2" style={{ color: primaryColor || '#3b82f6' }} />
                      Total Purchases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>
                      {(() => {
                        // Find the commission data for this affiliate
                        const commissionInfo = commissionData.find((c: any) => c.affiliateId === selectedAffiliate?.id);
                        return commissionInfo?.totalReferrals || 0;
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Purchases from referrals
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" style={{ color: secondaryColor || '#10b981' }} />
                      Revenue Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" style={{ color: secondaryColor || '#10b981' }}>
                      ${(() => {
                        // Find the commission data for this affiliate
                        const commissionInfo = commissionData.find((c: any) => c.affiliateId === selectedAffiliate?.id);
                        return commissionInfo?.totalRevenue?.toFixed(2) || '0.00';
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Total referral revenue
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" style={{ color: primaryColor || '#3b82f6' }} />
                      Referrals Made
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" style={{ color: primaryColor || '#8b5cf6' }}>
                      {(() => {
                        // Find the commission data for this affiliate
                        const commissionInfo = commissionData.find((c: any) => c.affiliateId === selectedAffiliate?.id);
                        return commissionInfo?.totalReferrals || 0;
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Users referred
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" style={{ color: primaryColor || '#3b82f6' }} />
              <span>Make Payment to {selectedAffiliateForPayment?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Process commission payment for affiliate
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Affiliate Account Information */}

            {paymentAccountLoading ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading account details...</span>
                </div>
              </div>
            ) : paymentAccount ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm">
                {(() => {
                  console.log('💳 Payment Account Data Received by React:', paymentAccount);
                  console.log('🔍 PaymentAccount Fields:', {
                    bankName: paymentAccount.bankName,
                    accountOwnerName: paymentAccount.accountOwnerName,
                    accountNumber: paymentAccount.accountNumber,
                    accountType: paymentAccount.accountType
                  });
                  return null;
                })()}
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                    <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Affiliate bank account information</p>
                  </div>
                </div>


                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bank Name</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{paymentAccount?.bankName || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Owner</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{paymentAccount?.accountOwnerName || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Number</span>
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">{paymentAccount?.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Type</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{paymentAccount?.accountType?.replace('_', ' ') || 'Not specified'}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Account Verified</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">Complete account details available for secure money transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-red-200 dark:border-red-800 rounded-xl p-6 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-3">
                    <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Account Required</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">Bank details needed for payment processing</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-medium text-sm">This Affiliate Not Add an Account Details</p>
                  <p className="text-red-700 text-xs mt-1">
                    This affiliate needs to add their bank account information before payments can be processed.
                  </p>
                </div>
              </div>
            )}

            {/* Need To Pay Amount */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-center">
                <p className="text-green-700 font-medium text-sm">Need To Pay</p>
                <p className="text-3xl font-bold text-green-800">
                  ${selectedAffiliateForPayment?.needToPay?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">How Much You Are Paying ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 text-lg font-semibold"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Add Proof of Payment Transaction</label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
                    className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      proofFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        setProofFile(files[0]);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="text-center">
                      {proofFile ? (
                        <div className="space-y-2">
                          <FileImage className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-600">{proofFile.name}</p>
                          <p className="text-xs text-green-500">File uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="text-sm font-medium text-gray-600">Drag & drop receipt here</p>
                          <p className="text-xs text-gray-500">or click to browse (Images & PDF)</p>
                        </div>
                      )}
                    </div>
                  </label>
                  {proofFile && (
                    <button
                      type="button"
                      onClick={() => setProofFile(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Remove file
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Notes (Optional)</label>
                <Textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g., Commission payment for Q4 2024"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                disabled={createPaymentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
                    toast({
                      title: "Error",
                      description: "Please enter a valid payment amount",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  // Check if affiliate has payment account details
                  if (!selectedAffiliateForPayment?.hasAccountDetails) {
                    toast({
                      title: "Account Required",
                      description: `${selectedAffiliateForPayment.name} must add their bank account details before receiving payments. Please ask them to update their payment information first.`,
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  createPaymentMutation.mutate({
                    affiliateId: selectedAffiliateForPayment.id,
                    amount: parseFloat(paymentAmount),
                    description: paymentDescription.trim() || undefined,
                  });
                }}
                disabled={createPaymentMutation.isPending || !selectedAffiliateForPayment?.hasAccountDetails}
                className={`${!selectedAffiliateForPayment?.hasAccountDetails 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'}`}
              >
                {createPaymentMutation.isPending ? 'Processing Payment...' : 'Complete Payment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={showPaymentHistoryModal} onOpenChange={setShowPaymentHistoryModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Payment History - {selectedAffiliateForHistory?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportPaymentHistory(selectedAffiliateForHistory)}
                className="text-xs"
                disabled={paymentHistoryLoading}
              >
                <Download className="w-3 h-3 mr-1" />
                Export Lifetime History
              </Button>
            </DialogTitle>
            <DialogDescription>
              Complete payment history with proof images and transaction details for {selectedAffiliateForHistory?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {paymentHistoryLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading payment history...</div>
              </div>
            ) : !paymentHistory || paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No Payment History</p>
                <p className="text-sm text-gray-400 mt-2">
                  No payments have been made to this affiliate yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Payments</p>
                    <p className="text-2xl font-bold text-green-700">{paymentHistory.length}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Amount Paid</p>
                    <p className="text-2xl font-bold text-blue-700">
                      ${paymentHistory.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Last Payment</p>
                    <p className="text-lg font-bold text-purple-700">
                      {paymentHistory.length > 0 ? formatDate(paymentHistory[0].createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Payment History Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b">
                    <h3 className="font-medium text-gray-900">Payment Records</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {paymentHistory.map((payment: any, index: number) => (
                      <div key={payment.id || index} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="bg-green-100 p-2 rounded-full">
                                <DollarSign className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-lg">${parseFloat(payment.amount || 0).toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Payment Method</p>
                                <p className="font-medium">{payment.paymentMethod || 'Bank Transfer'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Status</p>
                                <Badge variant="secondary" className="text-xs">
                                  {payment.status || 'Completed'}
                                </Badge>
                              </div>
                            </div>
                            
                            {payment.description && (
                              <div className="mt-3">
                                <p className="text-gray-500 text-sm">Description</p>
                                <p className="text-gray-900">{payment.description}</p>
                              </div>
                            )}
                            
                            {payment.historicalBankName && payment.historicalAccountNumber && (
                              <div className="mt-3">
                                <p className="text-gray-500 text-sm">Transfer Details</p>
                                <p className="text-gray-900 font-medium">
                                  Transfer To: {payment.historicalBankName} {payment.historicalAccountNumber}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Transaction Proof Images */}
                          <div className="ml-6">
                            {payment.transactionProofUrl ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">Transaction Proof</p>
                                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                  <img
                                    src={payment.transactionProofUrl}
                                    alt="Transaction Proof"
                                    className="w-32 h-32 object-cover cursor-pointer hover:opacity-80"
                                    onClick={() => window.open(payment.transactionProofUrl, '_blank')}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 text-center">Click to view full size</p>
                              </div>
                            ) : payment.receiptImageUrl ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">Receipt</p>
                                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                  <img
                                    src={payment.receiptImageUrl}
                                    alt="Payment Receipt"
                                    className="w-32 h-32 object-cover cursor-pointer hover:opacity-80"
                                    onClick={() => window.open(payment.receiptImageUrl, '_blank')}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 text-center">Click to view full size</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">No Proof Image</p>
                                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <FileImage className="w-8 h-8 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPaymentHistoryModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}