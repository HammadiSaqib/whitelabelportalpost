import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, FileText, Video, Music, Globe, BookOpen, Package, Zap } from 'lucide-react';

interface DownloadFile {
  id: number;
  name: string;
  type: string;
  contentUrl: string;
  description: string;
}

interface PurchaseResult {
  success: boolean;
  purchase: any;
  downloadFiles: DownloadFile[];
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <FileText className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'audio':
      return <Music className="h-5 w-5" />;
    case 'website_link':
      return <Globe className="h-5 w-5" />;
    case 'lms_course':
      return <BookOpen className="h-5 w-5" />;
    case 'digital_product':
      return <Zap className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

export default function PurchaseSuccess() {
  const [, setLocation] = useLocation();
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);

  useEffect(() => {
    // Get purchase result from session storage
    const storedResult = sessionStorage.getItem('purchaseResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setPurchaseResult(result);
        // Clean up session storage
        sessionStorage.removeItem('purchaseResult');
      } catch (error) {
        console.error('Error parsing purchase result:', error);
      }
    }
  }, []);

  const handleDownload = (file: DownloadFile) => {
    // In a real app, this would handle secure file downloads
    // For now, we'll open the content URL
    if (file.type === 'website_link') {
      window.open(file.contentUrl, '_blank');
    } else {
      // For files, we'd implement a secure download endpoint
      const link = document.createElement('a');
      link.href = file.contentUrl;
      link.download = file.name;
      link.click();
    }
  };

  if (!purchaseResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-orange-600">No Purchase Found</CardTitle>
            <CardDescription className="text-center">
              No recent purchase was found. Please complete a purchase first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/')} className="w-full">
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
        {/* Success Header */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <CardDescription className="text-green-700">
              Your purchase has been completed and your digital files are ready for download.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Purchase Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{purchaseResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">${purchaseResult.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span>{purchaseResult.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Files */}
        {purchaseResult.downloadFiles && purchaseResult.downloadFiles.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Your Digital Files ({purchaseResult.downloadFiles.length})
              </CardTitle>
              <CardDescription>
                Click on any file below to download or access your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseResult.downloadFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-gray-600">{file.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {file.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {file.type === 'website_link' ? (
                        <>
                          <Globe className="h-4 w-4" />
                          Open
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>No Files Available</CardTitle>
              <CardDescription>
                This plan doesn't include downloadable files, but your purchase is complete.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Important Information */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 space-y-2 text-sm">
            <p>• Your files will remain available for download for 30 days</p>
            <p>• A receipt has been sent to your email address</p>
            <p>• For support, please contact us with your transaction ID</p>
            <p>• Files are for personal use only and subject to our terms of service</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            size="lg"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}