import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { createIconStyle } from '@/utils/iconColors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Package, Bell, MessageSquare, Heart, Share2, ThumbsUp, Eye, EyeOff, Calendar, Home, Edit2, Check, X, LogOut, FileText, Copy, QrCode, CreditCard, History, Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function SuperAdminAffiliateDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { primaryColor, secondaryColor } = useTheme();

  // Helper functions
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportPaymentHistory = async () => {
    try {
      if (!paymentHistory || paymentHistory.length === 0) {
        toast({
          title: "No Payment History",
          description: "You have no payment history to export.",
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
      doc.text(`Affiliate: ${user?.firstName || 'Super Admin Affiliate'}`, 20, 35);
      doc.text(`Email: ${user?.email || 'No email'}`, 20, 43);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 51);
      
      // Summary Statistics
      const totalAmount = paymentHistory.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount || 0), 0);
      const totalPayments = paymentHistory.length;
      
      doc.setFontSize(12);
      doc.text(`Total Payments: ${totalPayments}`, 20, 65);
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 73);
      
      // Add a line separator
      doc.setLineWidth(0.5);
      doc.line(20, 80, 190, 80);
      
      let yPosition = 95;
      
      // Payment Records
      for (let i = 0; i < paymentHistory.length; i++) {
        const payment = paymentHistory[i];
        
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
      doc.save(`${user?.firstName || 'affiliate'}_payment_history.pdf`);

      toast({
        title: "Export Successful",
        description: `Payment history PDF exported successfully!`,
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
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showAnnouncementDetails, setShowAnnouncementDetails] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommissionDetails, setShowCommissionDetails] = useState<number | null>(null);
  const [isEditingReferralCode, setIsEditingReferralCode] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralCodeStatus, setReferralCodeStatus] = useState<'available' | 'unavailable' | 'current' | null>(null);
  const [referralCodeMessage, setReferralCodeMessage] = useState<string | null>(null);
  
  // Payment account states
  const [isEditingPaymentAccount, setIsEditingPaymentAccount] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    bankName: '',
    accountOwnerName: '',
    accountNumber: '',
    accountType: 'checking' as 'checking' | 'savings' | 'business_checking' | 'business_savings'
  });

  // Payment history states
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Query for Super Admin main site plans (isMainSitePlan = true)
  const { data: mainSitePlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/plans'],
    enabled: !!user && isAuthenticated,
  });

  // Query for Super Admin announcements only
  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/announcements'],
    enabled: !!user && isAuthenticated,
  });

  // Query for commission data on main site plans
  const { data: commissionData, isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/commissions'],
    enabled: !!user && isAuthenticated,
  });

  // Query for referral data
  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/referrals'],
    enabled: !!user && isAuthenticated,
  });

  // Query for referral code
  const { data: referralCodeData, isLoading: referralCodeLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/referral-code'],
    enabled: !!user && isAuthenticated,
  });

  // Query for payment account
  const { data: paymentAccount, isLoading: paymentAccountLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/payment-account'],
    enabled: !!user && isAuthenticated,
  });

  // Query for payment history
  const { data: paymentHistory = [], isLoading: paymentHistoryLoading } = useQuery({
    queryKey: ['/api/super-admin-affiliate/payment-history'],
    enabled: !!user && isAuthenticated,
  });

  // Query for announcement comments
  const { data: announcementComments = [] } = useQuery({
    queryKey: [`/api/announcements/${selectedAnnouncement?.id}/comments`],
    enabled: !!selectedAnnouncement?.id,
    refetchOnWindowFocus: false,
  });

  // Toggle plan visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ planId, isVisible }: { planId: number; isVisible: boolean }) => {
      return await apiRequest(`/api/super-admin-affiliate/plans/${planId}/toggle-visibility`, 'POST', { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/commissions'] });
      toast({
        title: "Success",
        description: "Plan visibility updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update plan visibility. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like announcement mutation
  const likeAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      return await apiRequest(`/api/announcements/${announcementId}/like`, 'POST');
    },
    onMutate: async (announcementId) => {
      await queryClient.cancelQueries({ queryKey: ['/api/announcements'] });
      
      const previousAnnouncements = queryClient.getQueryData(['/api/announcements']);
      
      queryClient.setQueryData(['/api/announcements'], (old: any[]) => {
        return old?.map((announcement: any) => {
          if (announcement.id === announcementId) {
            return {
              ...announcement,
              userLiked: !announcement.userLiked,
              likesCount: announcement.userLiked ? announcement.likesCount - 1 : announcement.likesCount + 1
            };
          }
          return announcement;
        });
      });
      
      return { previousAnnouncements };
    },
    onError: (error: any, announcementId, context: any) => {
      queryClient.setQueryData(['/api/announcements'], context.previousAnnouncements);
      toast({
        title: "Error",
        description: error.message || "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ announcementId, comment }: { announcementId: number; comment: string }) => {
      return await apiRequest(`/api/super-admin-affiliate/announcements/${announcementId}/comment`, 'POST', { comment });
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/announcements'] });
      queryClient.invalidateQueries({ queryKey: [`/api/announcements/${selectedAnnouncement?.id}/comments`] });
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
  });

  // Check referral code availability mutation
  const checkReferralCodeMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      const response = await apiRequest('/api/super-admin-affiliate/check-referral-code', 'POST', { referralCode });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setReferralCodeStatus(data.status);
      setReferralCodeMessage(data.message);
    },
  });

  // Update referral code mutation
  const updateReferralCodeMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      return await apiRequest('/api/super-admin-affiliate/referral-code', 'PUT', { referralCode });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/referral-code'] });
      setIsEditingReferralCode(false);
      setReferralCodeInput('');
      toast({
        title: "Success",
        description: data.message || "Referral code updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update referral code",
        variant: "destructive",
      });
    },
  });

  // Create payment account mutation
  const createPaymentAccountMutation = useMutation({
    mutationFn: async (accountData: typeof paymentFormData) => {
      return await apiRequest('/api/super-admin-affiliate/payment-account', 'POST', accountData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/payment-account'] });
      setIsEditingPaymentAccount(false);
      setPaymentFormData({ bankName: '', accountOwnerName: '', accountNumber: '', accountType: 'checking' });
      toast({
        title: "Success",
        description: "Payment account created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment account",
        variant: "destructive",
      });
    },
  });

  // Update payment account mutation
  const updatePaymentAccountMutation = useMutation({
    mutationFn: async (accountData: typeof paymentFormData) => {
      return await apiRequest('/api/super-admin-affiliate/payment-account', 'PUT', accountData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin-affiliate/payment-account'] });
      setIsEditingPaymentAccount(false);
      toast({
        title: "Success",
        description: "Payment account updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment account",
        variant: "destructive",
      });
    },
  });

  const copyAffiliateLink = (referralCode?: string) => {
    const code = referralCode || referralCodeData?.referralCode;
    if (!code) return;
    
    const affiliateLink = `${window.location.origin}/pricing?${code}`;
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Referral URL Copied!",
      description: "Your referral URL has been copied to clipboard",
    });
  };

  const handleReferralCodeChange = (value: string) => {
    setReferralCodeInput(value);
    setReferralCodeStatus(null);
    setReferralCodeMessage(null);
    
    if (value.trim().length >= 3) {
      checkReferralCodeMutation.mutate(value.trim());
    }
  };

  const handleReferralCodeSave = () => {
    if (referralCodeInput.trim().length >= 3 && referralCodeStatus === 'available') {
      updateReferralCodeMutation.mutate(referralCodeInput.trim());
    }
  };

  const startEditingReferralCode = () => {
    setIsEditingReferralCode(true);
    setReferralCodeInput(referralCodeData?.referralCode || '');
    setReferralCodeStatus(null);
  };

  const cancelEditingReferralCode = () => {
    setIsEditingReferralCode(false);
    setReferralCodeInput('');
    setReferralCodeStatus(null);
  };

  // Payment account helper functions
  const startEditingPaymentAccount = () => {
    if (paymentAccount) {
      setPaymentFormData({
        bankName: paymentAccount.bankName,
        accountOwnerName: paymentAccount.accountOwnerName,
        accountNumber: paymentAccount.accountNumber,
        accountType: paymentAccount.accountType
      });
    }
    setIsEditingPaymentAccount(true);
  };

  const cancelEditingPaymentAccount = () => {
    setIsEditingPaymentAccount(false);
    setPaymentFormData({ bankName: '', accountOwnerName: '', accountNumber: '', accountType: 'checking' });
  };

  const handlePaymentFormSubmit = () => {
    if (!paymentFormData.bankName || !paymentFormData.accountOwnerName || !paymentFormData.accountNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (paymentAccount) {
      updatePaymentAccountMutation.mutate(paymentFormData);
    } else {
      createPaymentAccountMutation.mutate(paymentFormData);
    }
  };



  if (isLoading || plansLoading || announcementsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Super Admin Affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Super Admin Affiliate Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Welcome back, {user?.firstName || user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center">
              <Button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => {
                      window.location.href = '/';
                    })
                    .catch(console.error);
                }}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs sm:text-sm">Referrals</TabsTrigger>
            <TabsTrigger value="commissions" className="text-xs sm:text-sm">Commissions</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{referrals?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">All time referrals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(commissionData?.reduce((total: number, item: any) => total + (item.metrics?.affiliateCommission || 0), 0) || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Your total commission earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Main Site Plans</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mainSitePlans?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Available plans</p>
                </CardContent>
              </Card>
            </div>

            {/* Your Referral URL */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Your Referral URL
                  </CardTitle>
                  <CardDescription>
                    Create and manage your unique referral URL for commission tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditingReferralCode ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {referralCodeData?.hasReferralCode ? (
                          <>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <div className="flex-1 w-full px-3 py-2 bg-green-50 border border-green-200 rounded-md font-mono text-sm break-all">
                                {window.location.origin}/pricing?{referralCodeData.referralCode}
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  onClick={() => copyAffiliateLink()}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Your Current Referral URL
                              </Badge>
                              <Button 
                                onClick={startEditingReferralCode}
                                size="sm"
                                variant="outline"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500">
                              No referral URL set
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-gray-600">
                                Not Available
                              </Badge>
                              <Button 
                                onClick={startEditingReferralCode}
                                size="sm"
                                variant="outline"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Create
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch border rounded-md">
                          <div className="px-3 py-2 bg-gray-50 text-gray-600 text-sm border-b sm:border-b-0 sm:border-r">
                            {window.location.origin}/pricing?
                          </div>
                          <Input
                            value={referralCodeInput}
                            onChange={(e) => handleReferralCodeChange(e.target.value)}
                            placeholder="Enter referral code (min 3 characters)"
                            className="border-0 focus:ring-0 rounded-l-none"
                            disabled={updateReferralCodeMutation.isPending}
                          />
                        </div>
                        {referralCodeStatus && (
                          <Badge 
                            variant={referralCodeStatus === 'available' ? 'default' : 
                                    referralCodeStatus === 'current' ? 'secondary' : 'destructive'}
                            className={
                              referralCodeStatus === 'available' ? 'bg-green-100 text-green-800' :
                              referralCodeStatus === 'current' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {referralCodeMessage || (
                              referralCodeStatus === 'available' ? 'Available' :
                              referralCodeStatus === 'current' ? 'Your Current Referral URL' :
                              'Not Available'
                            )}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={handleReferralCodeSave}
                          size="sm"
                          disabled={!referralCodeInput.trim() || referralCodeStatus !== 'available' || updateReferralCodeMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {updateReferralCodeMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          onClick={cancelEditingReferralCode}
                          size="sm"
                          variant="outline"
                          disabled={updateReferralCodeMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Generator */}
              {referralCodeData?.hasReferralCode && (
                <QRCodeGenerator
                  url={`${window.location.origin}/pricing?${referralCodeData.referralCode}`}
                  title="Referral URL"
                  size={180}
                />
              )}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Platform announcement posted</p>
                        <p className="text-sm text-gray-500">Check announcements for latest updates</p>
                      </div>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Management</CardTitle>
                <CardDescription>Track your white-label client referrals and earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">


                {referrals?.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4" style={createIconStyle('Users', { primaryColor, secondaryColor })} />
                    <p className="text-gray-500">No referrals yet</p>
                    <p className="text-sm text-gray-400">Start sharing your referral link to earn commissions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referrals?.map((referral: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">
                                {referral.business?.businessName || `${referral.purchaser?.firstName || ''} ${referral.purchaser?.lastName || ''}`.trim() || referral.purchaser?.email}
                              </h4>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                {referral.purchaser?.role === 'white_label_client' ? 'White-Label Client' : 'Customer'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Email:</span> {referral.purchaser?.email}
                              </div>
                              <div>
                                <span className="font-medium">Plans Purchased:</span> {referral.planSummary}
                              </div>
                              <div>
                                <span className="font-medium">Total Purchases:</span> {referral.totalPurchases}
                              </div>
                              <div>
                                <span className="font-medium">Last Purchase:</span> {formatDate(referral.lastPurchaseDate)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(parseFloat(referral.totalCommission) || 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Commission Earned</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Overview</CardTitle>
                <CardDescription>Track your earnings from main site plan referrals</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : commissionData?.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4" style={createIconStyle('DollarSign', { primaryColor, secondaryColor })} />
                    <p className="text-gray-500">No commissions yet</p>
                    <p className="text-sm text-gray-400">Commissions will appear here once your referrals make purchases</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commissionData?.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{item.plan?.name}</h3>
                            <p className="text-gray-600 text-sm">{item.plan?.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCommissionDetails(showCommissionDetails === index ? null : index)}
                          >
                            {showCommissionDetails === index ? 'Hide' : 'View'} Details
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {item.metrics?.totalPurchases || 0}
                            </div>
                            <div className="text-sm text-gray-600">Total Purchases</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(item.metrics?.affiliateCommission || 0)}
                            </div>
                            <div className="text-sm text-gray-600">Your Commission</div>
                          </div>
                        </div>

                        {showCommissionDetails === index && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium mb-2">Commission Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Plan Price:</span>
                                <span className="ml-2 font-medium">{formatCurrency(parseFloat(item.plan?.monthlyPrice || 0))}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Commission Rate:</span>
                                <span className="ml-2 font-medium">{item.plan?.affiliateCommissionPercentage || 0}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Announcements</CardTitle>
                <CardDescription>Stay updated with latest platform news and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : announcements?.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4" style={createIconStyle('Bell', { primaryColor, secondaryColor })} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
                    <p className="text-gray-600">Platform announcements will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements?.map((announcement: any) => (
                      <div key={announcement.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-base sm:text-lg flex-1 min-w-0">{announcement.title}</h3>
                              <Badge variant={announcement.type === 'info' ? 'default' : announcement.type === 'success' ? 'secondary' : 'destructive'} className="text-xs">
                                {announcement.type}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">{announcement.content}</p>
                            
                            {/* Display Attachments/Images */}
                            {announcement.attachments && Array.isArray(announcement.attachments) && announcement.attachments.length > 0 && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 gap-3">
                                  {announcement.attachments.map((attachment: any, index: number) => {
                                    const isImage = attachment.type?.startsWith('image/') || 
                                                   attachment.type === 'image' || 
                                                   attachment.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
                                    const isVideo = attachment.type?.startsWith('video/') || 
                                                   attachment.type === 'video' || 
                                                   attachment.name?.match(/\.(mp4|webm|ogg|mov|avi)$/i);
                                    
                                    return (
                                      <div key={index} className="rounded-lg overflow-hidden border">
                                        {isImage ? (
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.name || 'Announcement image'}
                                            className="w-full h-40 sm:h-48 object-cover cursor-pointer"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                            onError={(e) => {
                                              console.error('Failed to load image:', attachment.url);
                                              e.currentTarget.style.display = 'none';
                                              e.currentTarget.parentElement!.innerHTML = `
                                                <div class="p-3 sm:p-4 bg-gray-50 flex items-center">
                                                  <p class="text-xs text-gray-500">Failed to load image: ${attachment.name}</p>
                                                </div>
                                              `;
                                            }}
                                          />
                                        ) : isVideo ? (
                                          <video 
                                            controls 
                                            className="w-full h-40 sm:h-48"
                                            src={attachment.url}
                                          />
                                        ) : (
                                          <div className="p-3 sm:p-4 bg-gray-50 flex items-center">
                                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-3" style={{ color: secondaryColor || '#8B5CF6' }} />
                                            <div>
                                              <p className="font-medium text-xs sm:text-sm">{attachment.name}</p>
                                              <p className="text-xs text-gray-500">File attachment</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {formatDate(announcement.createdAt)}
                              </span>
                            </div>
                          </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant={announcement.userLiked ? "default" : "outline"}
                              size="sm"
                              onClick={() => likeAnnouncementMutation.mutate(announcement.id)}
                              disabled={likeAnnouncementMutation.isPending}
                              className="text-xs sm:text-sm"
                              data-testid={`button-like-${announcement.id}`}
                              style={announcement.userLiked ? { backgroundColor: primaryColor || '#3b82f6', borderColor: primaryColor || '#3b82f6' } : {}}
                            >
                              <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${announcement.userLiked ? 'fill-current' : ''}`} />
                              Like ({announcement.likesCount || 0})
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setShowAnnouncementDetails(true);
                              }}
                              className="text-xs sm:text-sm"
                            >
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Comments ({announcement.commentsCount || 0})
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

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Account
                </CardTitle>
                <CardDescription>
                  Manage your payment account information for commission payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentAccountLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading payment account...</div>
                  </div>
                ) : !paymentAccount && !isEditingPaymentAccount ? (
                  // No account exists - show "Add Account" option
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 mx-auto mb-4" style={createIconStyle('CreditCard', { primaryColor, secondaryColor })} />
                    <h3 className="font-medium text-lg mb-2">Add Account To Get Your Commission</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Set up your payment account information to receive commission payouts
                    </p>
                    <Button onClick={() => setIsEditingPaymentAccount(true)}>
                      Add Account
                    </Button>
                  </div>
                ) : isEditingPaymentAccount ? (
                  // Show form for add/edit
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">
                      {paymentAccount ? 'Edit Account Information' : 'Add Account Information'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bank Name</label>
                        <Input
                          placeholder="Enter bank name"
                          value={paymentFormData.bankName}
                          onChange={(e) => setPaymentFormData({...paymentFormData, bankName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account Owner Name</label>
                        <Input
                          placeholder="Full name on account"
                          value={paymentFormData.accountOwnerName}
                          onChange={(e) => setPaymentFormData({...paymentFormData, accountOwnerName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account Number</label>
                        <Input
                          placeholder="Account number"
                          value={paymentFormData.accountNumber}
                          onChange={(e) => setPaymentFormData({...paymentFormData, accountNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account Type</label>
                        <Select
                          value={paymentFormData.accountType}
                          onValueChange={(value: 'checking' | 'savings' | 'business_checking' | 'business_savings') => 
                            setPaymentFormData({...paymentFormData, accountType: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Personal Checking</SelectItem>
                            <SelectItem value="savings">Personal Savings</SelectItem>
                            <SelectItem value="business_checking">Business Checking</SelectItem>
                            <SelectItem value="business_savings">Business Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handlePaymentFormSubmit}
                        disabled={createPaymentAccountMutation.isPending || updatePaymentAccountMutation.isPending}
                      >
                        {createPaymentAccountMutation.isPending || updatePaymentAccountMutation.isPending ? 'Saving...' : 
                         paymentAccount ? 'Update Account' : 'Add Account'}
                      </Button>
                      <Button variant="outline" onClick={cancelEditingPaymentAccount}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Show existing account info with edit option
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Account Information</h3>
                      <Button variant="outline" onClick={startEditingPaymentAccount}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Bank Name</label>
                        <p className="font-medium">{paymentAccount?.bankName}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Account Owner Name</label>
                        <p className="font-medium">{paymentAccount?.accountOwnerName}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Account Number</label>
                        <p className="font-medium">****{paymentAccount?.accountNumber?.slice(-4)}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Account Type</label>
                        <p className="font-medium capitalize">
                          {paymentAccount?.accountType?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Account Ready for Payouts</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Your payment account is set up and ready to receive commission payouts.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Transaction History Section */}
            {paymentAccount && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Payment Transaction History
                  </CardTitle>
                  <CardDescription>
                    Track your commission payments and transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistoryLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-500">Loading payment history...</div>
                    </div>
                  ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">No Payment History</h3>
                      <p className="text-sm text-gray-500">
                        Your payment transaction history will appear here once payments are made.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Show recent payments (up to 3) */}
                      {paymentHistory.slice(0, 3).map((payment: any, index: number) => (
                        <div key={payment.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-lg font-semibold text-green-600">
                                ${parseFloat(payment.amount || '0').toFixed(2)}
                              </div>
                              <Badge 
                                variant={payment.status === 'completed' ? 'default' : 
                                        payment.status === 'pending' ? 'secondary' : 'destructive'}
                                className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {payment.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Payment Method:</span> {payment.paymentMethod || 'Bank Transfer'}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {formatDate(payment.createdAt)}
                              </div>
                              {payment.description && (
                                <div className="col-span-2">
                                  <span className="font-medium">Description:</span> {payment.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {payment.transactionProofUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(payment.transactionProofUrl, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Proof
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* View Lifetime Button */}
                      {paymentHistory.length > 0 && (
                        <div className="flex justify-center pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowPaymentHistoryModal(true)}
                            className="flex items-center gap-2"
                          >
                            <History className="w-4 h-4" style={createIconStyle('History', { primaryColor, secondaryColor })} />
                            View Lifetime History ({paymentHistory.length} transactions)
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Announcement Details Dialog */}
      <Dialog open={showAnnouncementDetails} onOpenChange={setShowAnnouncementDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              Posted on {selectedAnnouncement?.createdAt ? formatDate(selectedAnnouncement.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p>{selectedAnnouncement?.content}</p>
            </div>
            
            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Comments</h4>
              {!announcementComments || announcementComments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                <div className="space-y-3">
                  {announcementComments.map((comment: any, index: number) => (
                    <div key={comment.id || index} className="flex gap-3 p-3 bg-white border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.authorName || 'Anonymous'}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Comment Form */}
              <div className="flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={() => addCommentMutation.mutate({
                    announcementId: selectedAnnouncement?.id,
                    comment: commentText
                  })}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment History Modal */}
      <Dialog open={showPaymentHistoryModal} onOpenChange={setShowPaymentHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Lifetime Payment History
            </DialogTitle>
            <DialogDescription>
              Complete payment transaction history and records
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {paymentHistory.length}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {paymentHistory.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => exportPaymentHistory()}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {paymentHistory.map((payment: any, index: number) => (
                <div key={payment.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-lg font-semibold text-green-600">
                        ${parseFloat(payment.amount || '0').toFixed(2)}
                      </div>
                      <Badge 
                        variant={payment.status === 'completed' ? 'default' : 
                                payment.status === 'pending' ? 'secondary' : 'destructive'}
                        className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Payment Method:</span> {payment.paymentMethod || 'Bank Transfer'}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(payment.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Transaction ID:</span> {payment.id}
                      </div>
                      <div>
                        <span className="font-medium">Bank:</span> {payment.historicalBankName || 'N/A'}
                      </div>
                      {payment.description && (
                        <div className="col-span-2">
                          <span className="font-medium">Description:</span> {payment.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {payment.transactionProofUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(payment.transactionProofUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Proof
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {paymentHistory.length === 0 && (
              <div className="text-center py-8">
                <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No Payment History</h3>
                <p className="text-sm text-gray-500">
                  Your payment transaction history will appear here once payments are made.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}