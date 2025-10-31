import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Share2, 
  Copy, 
  X,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Send
} from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  size?: number;
}



interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  qrCodeDataUrl?: string;
}

function ShareModal({ isOpen, onClose, url, title, qrCodeDataUrl }: ShareModalProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Referral URL copied to clipboard",
    });
  };

  const shareToWhatsApp = () => {
    const message = `Check out ${title}: ${url}`;
    // Direct WhatsApp sharing - opens WhatsApp directly
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToTwitter = () => {
    const message = `Check out ${title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTelegram = () => {
    const message = `Check out ${title}: ${url}`;
    // Direct Telegram sharing - opens Telegram directly
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      copyToClipboard();
      return;
    }

    const message = `Check out ${title}: ${url}`;

    try {
      // Try to share with QR code image if available and supported
      if (qrCodeDataUrl) {
        try {
          const response = await fetch(qrCodeDataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'referral-qr-code.png', { type: 'image/png' });
          
          const shareDataWithFile = {
            title: title,
            text: message,
            files: [file],
          };

          if ('canShare' in navigator && (navigator as any).canShare(shareDataWithFile)) {
            await navigator.share(shareDataWithFile);
            return;
          }
        } catch (fileError) {
          console.log('File sharing not supported, trying without files');
        }
      }

      // Fallback to sharing without files
      await navigator.share({
        title: title,
        text: message,
        url: url,
      });
    } catch (error) {
      console.log('Share failed:', error);
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Share Referral URL</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{title}</p>
            <p className="text-xs text-gray-500 break-all">{url}</p>
          </div>

          {/* Copy Link */}
          <Button 
            onClick={copyToClipboard} 
            variant="outline" 
            className="w-full justify-start"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={shareToWhatsApp}
              variant="outline" 
              className="justify-start"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </Button>

            <Button 
              onClick={shareToTwitter}
              variant="outline" 
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </Button>

            <Button 
              onClick={shareToFacebook}
              variant="outline" 
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>

            <Button 
              onClick={shareToLinkedIn}
              variant="outline" 
              className="justify-start"
            >
              <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
              LinkedIn
            </Button>

            <Button 
              onClick={shareToTelegram}
              variant="outline" 
              className="justify-start"
            >
              <Send className="h-4 w-4 mr-2 text-blue-500" />
              Telegram
            </Button>

            {typeof navigator !== 'undefined' && navigator.share && (
              <Button 
                onClick={handleNativeShare}
                variant="outline" 
                className="justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                More Apps
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function QRCodeGenerator({ url, title = "Referral URL", size = 200 }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [url, size]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `referral-qr-code-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded!",
      description: "QR code saved to gallery",
    });
  };

  const shareQRCode = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QR Code</CardTitle>
          <p className="text-sm text-gray-600">
            Share your referral URL easily with QR code
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <canvas
                ref={canvasRef}
                style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
              />
              {!qrCodeDataUrl && (
                <div 
                  className="flex items-center justify-center bg-gray-100 rounded"
                  style={{ width: size, height: size }}
                >
                  <span className="text-gray-500">Generating QR Code...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              disabled={!qrCodeDataUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Save to Gallery
            </Button>
            
            <Button
              onClick={shareQRCode}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Scan this QR code to access your referral link directly
          </p>
        </CardContent>
      </Card>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={url}
        title={title}
        qrCodeDataUrl={qrCodeDataUrl}
      />
    </>
  );
}