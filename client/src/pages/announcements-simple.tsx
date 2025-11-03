import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import AIDescriptionGenerator from "@/components/AIDescriptionGenerator";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Music, 
  Pin,
  MoreHorizontal,
  Send,
  Paperclip,
  Globe,
  Users,
  Shield,
  X,
  ExternalLink,
  Copy,
  MessageSquare,
  Menu,
  Clock,
  CheckCircle,
  FileEdit,
  ChevronDown,
  BarChart,
  Eye,
  MousePointer,
  Search,
  PenTool,
  File,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorProfileImage?: string;
  createdAt: string;
}

interface Announcement {
  id: number;
  userId: string;
  title: string;
  content?: string;
  attachments: Array<{url: string, type: string, name: string}>;
  visibility: 'public' | 'clients' | 'affiliates' | 'admins';
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string;
  publishedAt?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorEmail: string;
  authorProfileImage?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  userLiked: boolean;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const { toast } = useToast();
  const params = useParams();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyNews, setShowMyNews] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    visibility: 'clients' as 'public' | 'clients' | 'affiliates' | 'admins',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    scheduledAt: '',
    targetingType: 'everyone' as 'everyone' | 'by_plan',
    targetedPlanIds: [] as number[]
  });
  const [selectedAction, setSelectedAction] = useState<'publish' | 'draft' | 'schedule'>('publish');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [commentsData, setCommentsData] = useState<{[key: number]: Comment[]}>({});
  const [selectedAnnouncementForAnalytics, setSelectedAnnouncementForAnalytics] = useState<Announcement | null>(null);
  const [analyticsData, setAnalyticsData] = useState<{
    views: number;
    clicks: number;
    conversions: number;
    viewsData: any[];
    clicksData: any[];
    conversionsData: any[];
  } | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  
  const queryClient = useQueryClient();
  
  // Function to fetch comments for a specific announcement
  const fetchComments = async (announcementId: number) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/comments`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const comments = await response.json();
      setCommentsData(prev => ({
        ...prev,
        [announcementId]: comments
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  // Function to toggle comments visibility and fetch if needed
  const toggleComments = (announcementId: number) => {
    const isCurrentlyShowing = showComments[announcementId];
    setShowComments(prev => ({
      ...prev,
      [announcementId]: !isCurrentlyShowing
    }));
    
    // If we're showing comments and haven't fetched them yet, fetch them
    if (!isCurrentlyShowing && !commentsData[announcementId]) {
      fetchComments(announcementId);
    }
  };
  
  // Fetch announcements from API
  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: async () => {
      const response = await fetch('/api/announcements', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    }
  });

  // Fetch user's plans for targeting dropdown
  const { data: userPlans = [] } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: async () => {
      const response = await fetch('/api/plans', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    }
  });

  // Filter announcements based on search query and "My News" filter
  const filteredAnnouncements = announcements.filter((announcement: Announcement) => {
    // Filter by search query (search in title)
    const matchesSearch = !searchQuery || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by "My News" (only user's own news)
    const matchesMyNews = !showMyNews || String(announcement.userId) === String(user?.id);
    
    return matchesSearch && matchesMyNews;
  });

  // Note: createAnnouncementMutation is now handled directly in handleCreatePost function

  // Like announcement mutation
  const likeAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      const response = await fetch(`/api/announcements/${announcementId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ announcementId, content }: { announcementId: number, content: string }) => {
      const response = await fetch(`/api/announcements/${announcementId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: (data, { announcementId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      // Refresh comments for this specific announcement
      fetchComments(announcementId);
      // Clear the comment input
      setCommentInputs(prev => ({
        ...prev,
        [announcementId]: ''
      }));
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({
        title: "Success",
        description: "News deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete news",
        variant: "destructive",
      });
    }
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userInfo = user as any;

  // Handle URL parameters for specific announcements
  useEffect(() => {
    if (params.id) {
      const announcementId = parseInt(params.id);
      // If we have an announcement ID in URL, auto-scroll to it or show it prominently
      setTimeout(() => {
        const element = document.getElementById(`announcement-${announcementId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
        }
      }, 500);
    }
  }, [params.id]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'clients': return <Users className="h-4 w-4" />;
      case 'affiliates': return <Users className="h-4 w-4" />;
      case 'admins': return <Shield className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const handleCreatePost = async (actionType: 'draft' | 'published' | 'scheduled' = 'draft') => {
    if (!newPost.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    // Validate scheduled date if scheduling
    if (actionType === 'scheduled' && !newPost.scheduledAt) {
      toast({
        title: "Error",
        description: "Please select a date and time for scheduling",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content || '');
      formData.append('visibility', newPost.visibility);
      formData.append('status', actionType);
      formData.append('targetingType', newPost.targetingType);
      formData.append('targetedPlanIds', JSON.stringify(newPost.targetedPlanIds));
      
      if (actionType === 'scheduled' && newPost.scheduledAt) {
        formData.append('scheduledAt', new Date(newPost.scheduledAt).toISOString());
      }
      
      // Add file attachment if present (only one file supported currently)
      if (uploadedFiles.length > 0) {
        formData.append('attachment', uploadedFiles[0]);
      }
      
      // Make direct fetch request to handle FormData properly
      const response = await fetch('/api/announcements', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create announcement');
      }
      
      const result = await response.json();
      
      // Reset form
      setNewPost({ 
        title: '', 
        content: '', 
        visibility: 'clients', 
        status: 'draft', 
        scheduledAt: '',
        targetingType: 'everyone',
        targetedPlanIds: []
      });
      setUploadedFiles([]);
      setShowCreateForm(false);
      
      // Refresh announcements
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      
      const statusMessage = actionType === 'draft' ? 'saved as draft' : 
                          actionType === 'scheduled' ? 'scheduled successfully' : 'published successfully';
      
      toast({
        title: "Success",
        description: `Announcement ${statusMessage}`
      });
      
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  const handleLike = (announcementId: number) => {
    likeAnnouncementMutation.mutate(announcementId);
  };

  const handleComment = (announcementId: number) => {
    const content = commentInputs[announcementId]?.trim();
    if (!content) return;

    addCommentMutation.mutate(
      { announcementId, content },
      {
        onSuccess: () => {
          setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
          toast({
            title: "Success",
            description: "Comment added successfully"
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add comment",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleShare = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShareDialogOpen(true);
  };

  const copyAnnouncementLink = (announcementId: number) => {
    const url = `${window.location.origin}/news/${announcementId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "News link copied to clipboard"
    });
  };

  const shareToSocial = (platform: string, announcement: Announcement) => {
    const url = `${window.location.origin}/news/${announcement.id}`;
    const text = `Check out this news: ${announcement.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Update share count by refetching announcements
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    }
    
    setShareDialogOpen(false);
  };

  // Analytics functions
  const fetchAnalytics = async (announcementId: number) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/analytics`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    }
  };

  // Track analytics events
  const trackAnalyticsEvent = async (announcementId: number, eventType: 'view' | 'click' | 'conversion', eventData?: any) => {
    try {
      await fetch(`/api/announcements/${announcementId}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventData }),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  // Handle hover events for view tracking
  const handleCardHover = (announcementId: number) => {
    trackAnalyticsEvent(announcementId, 'view');
  };

  // Handle clicks for click tracking  
  const handleCardClick = (announcementId: number, elementClicked: string) => {
    trackAnalyticsEvent(announcementId, 'click', { elementClicked });
  };

  // Handle conversions
  const handleConversion = (announcementId: number, conversionType: string, targetData?: any) => {
    trackAnalyticsEvent(announcementId, 'conversion', { 
      conversionType,
      ...targetData
    });
  };

  const openAnalyticsModal = (announcement: Announcement) => {
    setSelectedAnnouncementForAnalytics(announcement);
    fetchAnalytics(announcement.id);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewPost({
      title: announcement.title,
      content: announcement.content || '',
      visibility: announcement.visibility,
      status: announcement.status,
      scheduledAt: announcement.scheduledAt ? new Date(announcement.scheduledAt).toISOString().slice(0, 16) : '',
      targetingType: (announcement as any).targetingType || 'everyone',
      targetedPlanIds: (announcement as any).targetedPlanIds || []
    });
    
    // Set the selected action based on current status
    if (announcement.status === 'draft') {
      setSelectedAction('draft');
    } else if (announcement.status === 'scheduled') {
      setSelectedAction('schedule');
    } else {
      setSelectedAction('publish');
    }
    
    setShowCreateForm(true);
  };

  const handleUpdateAnnouncement = async (actionType: 'draft' | 'published' | 'scheduled' = 'draft') => {
    if (!editingAnnouncement) return;
    
    if (!newPost.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    // Validate scheduled date if scheduling
    if (actionType === 'scheduled' && !newPost.scheduledAt) {
      toast({
        title: "Error",
        description: "Please select a date and time for scheduling",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content || '');
      formData.append('visibility', newPost.visibility);
      formData.append('status', actionType);
      formData.append('targetingType', newPost.targetingType);
      formData.append('targetedPlanIds', JSON.stringify(newPost.targetedPlanIds));
      
      if (actionType === 'scheduled' && newPost.scheduledAt) {
        formData.append('scheduledAt', new Date(newPost.scheduledAt).toISOString());
      }
      
      // Add file attachment if present
      if (uploadedFiles.length > 0) {
        formData.append('attachment', uploadedFiles[0]);
      }
      
      const response = await fetch(`/api/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update announcement');
      }
      
      // Reset form
      setNewPost({ 
        title: '', 
        content: '', 
        visibility: 'clients', 
        status: 'draft', 
        scheduledAt: '',
        targetingType: 'everyone',
        targetedPlanIds: []
      });
      setUploadedFiles([]);
      setShowCreateForm(false);
      setEditingAnnouncement(null);
      
      // Refresh announcements
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      
      const statusMessage = actionType === 'draft' ? 'saved as draft' : 
                          actionType === 'scheduled' ? 'scheduled successfully' : 'published successfully';
      
      toast({
        title: "Success",
        description: `Announcement updated and ${statusMessage}`
      });
      
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update announcement",
        variant: "destructive"
      });
    }
  };



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">News</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="News"
          subtitle="Community updates and news"
        />
        
        <div className="flex-1 overflow-y-auto">
        
          <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Create Post Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={userInfo?.profileImageUrl} />
                  <AvatarFallback>
                    {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-gray-500 hover-glow-blue hover-float"
                  onClick={() => setShowCreateForm(true)}
                >
                  <PenTool className="h-4 w-4 mr-3 hover-bounce" style={{ color: secondaryColor || '#10b981' }} />
                  What's on your mind?
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant={showMyNews ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMyNews(!showMyNews)}
                  className={`shrink-0 ${!showMyNews ? 'hover-glow-purple hover-float' : ''}`}
                  style={showMyNews ? { 
                    background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}, ${secondaryColor || '#10b981'})`,
                    color: 'white',
                    border: 'none'
                  } : {}}
                >
                  My News
                </Button>
                <Input
                  type="text"
                  placeholder="Search news by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 hover-glow-blue transition-all duration-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Create Post Modal */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingAnnouncement ? 'Edit News' : 'Create News'}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAnnouncement(null);
                      setNewPost({ 
                        title: '', 
                        content: '', 
                        visibility: 'clients', 
                        status: 'draft', 
                        scheduledAt: '',
                        targetingType: 'everyone',
                        targetedPlanIds: []
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={userInfo?.profileImageUrl} />
                    <AvatarFallback>
                      {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userInfo?.firstName} {userInfo?.lastName}</p>
                    <div className="flex items-center space-x-2">
                      {getVisibilityIcon(newPost.visibility)}
                      <Select 
                        value={newPost.visibility} 
                        onValueChange={(value: any) => setNewPost(prev => ({ ...prev, visibility: value }))}
                      >
                        <SelectTrigger className="w-auto border-none p-0 h-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="affiliates">Affiliates</SelectItem>
                          <SelectItem value="admins">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Input
                  id="news-title"
                  placeholder="Title (required)"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="news-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      What's happening? (optional)
                    </label>
                    <AIDescriptionGenerator
                      titleFieldId="news-title"
                      descriptionFieldId="news-content"
                      contentType="news"
                      onContentGenerated={(content) => 
                        setNewPost(prev => ({ ...prev, content }))
                      }
                    />
                  </div>
                  <Textarea
                    id="news-content"
                    placeholder="What's happening? (optional)"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? `bg-blue-50 dark:bg-blue-900/20` 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    borderColor: dragActive ? (primaryColor || '#3b82f6') : undefined
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drop files here to upload, or{' '}
                    <button
                      type="button"
                      className="hover:opacity-80"
                      style={{ color: primaryColor || '#3b82f6' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Support for images, videos, audio, and documents (max 5 files)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Targeting Options */}
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium">Targeting Options</h3>
                  <RadioGroup
                    value={newPost.targetingType}
                    onValueChange={(value: 'everyone' | 'by_plan') => setNewPost(prev => ({ 
                      ...prev, 
                      targetingType: value,
                      targetedPlanIds: value === 'everyone' ? [] : prev.targetedPlanIds 
                    }))}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="everyone" id="everyone" />
                      <Label htmlFor="everyone" className="text-sm cursor-pointer">
                        Everyone (Public visibility)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="by_plan" id="by_plan" />
                      <Label htmlFor="by_plan" className="text-sm cursor-pointer">
                        By Plan (Restrict to selected plan purchasers)
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Plan Selection - only show when targeting by plan */}
                  {newPost.targetingType === 'by_plan' && (
                    <div className="space-y-2 pl-6">
                      <Label className="text-sm font-medium">Select Plans</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {userPlans.map((plan: any) => (
                          <div key={plan.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`plan-${plan.id}`}
                              checked={newPost.targetedPlanIds.includes(plan.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewPost(prev => ({
                                    ...prev,
                                    targetedPlanIds: [...prev.targetedPlanIds, plan.id]
                                  }));
                                } else {
                                  setNewPost(prev => ({
                                    ...prev,
                                    targetedPlanIds: prev.targetedPlanIds.filter(id => id !== plan.id)
                                  }));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`plan-${plan.id}`} 
                              className="text-sm cursor-pointer flex-1"
                            >
                              {plan.name} - ${plan.monthlyPrice || '0'}/month
                            </Label>
                          </div>
                        ))}
                      </div>
                      {newPost.targetedPlanIds.length === 0 && (
                        <p className="text-xs text-red-500">Please select at least one plan for targeting</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Scheduling Input - only show when action is schedule */}
                {selectedAction === 'schedule' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Schedule Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={newPost.scheduledAt}
                      onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingAnnouncement(null);
                        setNewPost({ 
                          title: '', 
                          content: '', 
                          visibility: 'clients', 
                          status: 'draft', 
                          scheduledAt: '',
                          targetingType: 'everyone',
                          targetedPlanIds: []
                        });
                        setSelectedAction('publish');
                      }}
                    >
                      Cancel
                    </Button>
                    
                    {/* Main Action Button with Dropdown */}
                    <div className="flex border border-input rounded-md">
                      <Button 
                        onClick={() => {
                          const status = selectedAction === 'publish' ? 'published' : 
                                       selectedAction === 'schedule' ? 'scheduled' : 'draft';
                          
                          if (selectedAction === 'schedule' && !newPost.scheduledAt) {
                            toast({
                              title: "Schedule time required",
                              description: "Please select a date and time for scheduling",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          editingAnnouncement ? handleUpdateAnnouncement(status) : handleCreatePost(status);
                        }}
                        className="rounded-r-none border-0 border-r border-input/50"
                        style={{ 
                          background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}, ${secondaryColor || '#10b981'})`,
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        {selectedAction === 'publish' ? (editingAnnouncement ? 'Update' : 'Add News') :
                         selectedAction === 'schedule' ? 'Schedule' : 'Draft'}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-l-none border-0 px-2 h-full"
                            style={{ 
                              background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}, ${secondaryColor || '#10b981'})`,
                              color: 'white',
                              border: 'none'
                            }}
                          >
                            <ChevronDown className="h-4 w-4" style={{ color: 'white' }} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {selectedAction !== 'publish' && (
                            <DropdownMenuItem 
                              onClick={() => setSelectedAction('publish')}
                              className="cursor-pointer"
                            >
                              {editingAnnouncement ? 'Update' : 'Add News'}
                            </DropdownMenuItem>
                          )}
                          {selectedAction !== 'draft' && (
                            <DropdownMenuItem 
                              onClick={() => setSelectedAction('draft')}
                              className="cursor-pointer"
                            >
                              Save as Draft
                            </DropdownMenuItem>
                          )}
                          {selectedAction !== 'schedule' && (
                            <DropdownMenuItem 
                              onClick={() => setSelectedAction('schedule')}
                              className="cursor-pointer"
                            >
                              Schedule for Later
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements Feed */}
          <div className="space-y-6">
            {filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">
                    {searchQuery || showMyNews 
                      ? "No news found matching your filters." 
                      : "No news posts yet. Be the first to share something!"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement: Announcement) => (
              <Card 
                key={announcement.id} 
                id={`announcement-${announcement.id}`} 
                className={announcement.isPinned ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                style={{
                  borderColor: announcement.isPinned ? (primaryColor || '#3b82f6') : undefined
                }}
                onMouseEnter={() => handleCardHover(announcement.id)}
                onClick={() => handleCardClick(announcement.id, 'card')}
              >
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={announcement.authorProfileImage} />
                      <AvatarFallback>
                        {announcement.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{announcement.authorName}</h4>
                        {announcement.isPinned && (
                          <Pin className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                        )}
                        {announcement.visibility !== 'public' && (
                          <Badge variant="info" className="text-xs">
                            {getVisibilityIcon(announcement.visibility)}
                            <span className="ml-1 capitalize">{announcement.visibility}</span>
                          </Badge>
                        )}
                        {(announcement.status === 'scheduled' || announcement.status === 'draft') && (
                          <Badge 
                            variant={announcement.status === 'scheduled' ? 'warning' : 'purple'} 
                            className="text-xs flex items-center gap-1"
                          >
                            {announcement.status === 'scheduled' ? (
                              <>
                                <Clock className="h-3 w-3" />
                                Scheduled
                              </>
                            ) : (
                              <>
                                <FileEdit className="h-3 w-3" />
                                Draft
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(announcement.createdAt))} ago
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/news/${announcement.id}`);
                          toast({
                            title: "Link copied",
                            description: "News link copied to clipboard"
                          });
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {(String(announcement.userId) === String(user?.id) || user?.role === 'super_admin' || user?.role === 'white_label_client') ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="cursor-pointer"
                            >
                              Edit News
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openAnalyticsModal(announcement)}
                              className="cursor-pointer"
                            >
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setAnnouncementToDelete(announcement);
                                setDeleteConfirmOpen(true);
                              }}
                              className="cursor-pointer text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete News
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => copyAnnouncementLink(announcement.id)}
                              className="cursor-pointer"
                            >
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyAnnouncementLink(announcement.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {announcement.title && (
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  )}
                  
                  <p className="whitespace-pre-wrap">{announcement.content}</p>

                  {/* Attachments */}
                  {(() => {
                    // Handle attachments that might be stored as JSON strings in the database
                    let attachments = announcement.attachments;
                    
                    // If attachments is a string, try to parse it as JSON
                    if (typeof attachments === 'string') {
                      try {
                        attachments = JSON.parse(attachments);
                        console.log('Parsed attachments from JSON string:', attachments);
                      } catch (error) {
                        console.error('Failed to parse attachments JSON:', error);
                        attachments = [];
                      }
                    }
                    
                    // Ensure attachments is an array
                    if (!Array.isArray(attachments)) {
                      attachments = [];
                    }
                    
                    return attachments && attachments.length > 0 ? (
                      <div className="space-y-3">
                        {attachments.map((attachment, index) => {
                        // Check if it's an image (handle both full MIME types and simple 'image' type)
                        const isImage = attachment.type.startsWith('image/') || 
                                      attachment.type === 'image' || 
                                      attachment.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        
                        return (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            {isImage ? (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name}
                                className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-800 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConversion(announcement.id, 'image_open', { fileName: attachment.name, targetUrl: attachment.url });
                                  window.open(attachment.url, '_blank');
                                }}
                                onError={(e) => {
                                  // Fallback to file icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="p-4 flex items-center space-x-2">
                                        <span class="text-sm truncate">${attachment.name}</span>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className="p-4 flex items-center space-x-2">
                                {getFileIcon(attachment.type)}
                                <span className="text-sm truncate">{attachment.name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    ) : null;
                  })()}

                  {/* Engagement Bar */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(announcement.id, 'like');
                          handleLike(announcement.id);
                        }}
                      >
                        <Heart 
                          className="h-4 w-4"
                          fill={announcement.userLiked ? (primaryColor || '#3b82f6') : 'none'}
                          color={announcement.userLiked ? (primaryColor || '#3b82f6') : (secondaryColor || '#10b981')}
                        />
                        <span style={{ color: secondaryColor || '#10b981' }}>{announcement.likesCount}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(announcement.id, 'comment');
                          toggleComments(announcement.id);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                        <span style={{ color: secondaryColor || '#10b981' }}>{announcement.commentsCount}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(announcement.id, 'share');
                          handleShare(announcement);
                        }}
                      >
                        <Share2 className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                        <span style={{ color: secondaryColor || '#10b981' }}>Share</span>
                      </Button>

                    </div>
                  </div>

                  {/* Comment Section */}
                  {showComments[announcement.id] && (
                    <div className="space-y-3 pt-4 border-t">
                      {/* Existing Comments */}
                      {commentsData[announcement.id] && commentsData[announcement.id].length > 0 && (
                        <div className="space-y-3 mb-4">
                          {commentsData[announcement.id].map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.authorProfileImage} />
                                <AvatarFallback className="text-xs">
                                  {comment.authorName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                  <p className="font-medium text-sm">{comment.authorName}</p>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add Comment */}
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userInfo?.profileImageUrl} />
                          <AvatarFallback className="text-xs">
                            {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentInputs[announcement.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({
                              ...prev,
                              [announcement.id]: e.target.value
                            }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(announcement.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleComment(announcement.id)}
                            disabled={!commentInputs[announcement.id]?.trim()}
                            style={{ 
                              background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}, ${secondaryColor || '#10b981'})`,
                              color: 'white',
                              border: 'none'
                            }}
                          >
                            <Send className="h-4 w-4" style={{ color: 'white' }} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
            )}
          </div>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Announcement</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-sm">{selectedAnnouncement.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  By {selectedAnnouncement.authorName}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Copy className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Copy link</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyAnnouncementLink(selectedAnnouncement.id)}
                  >
                    Copy
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('whatsapp', selectedAnnouncement)}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>WhatsApp</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('twitter', selectedAnnouncement)}
                    className="flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Twitter</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('facebook', selectedAnnouncement)}
                    className="flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('linkedin', selectedAnnouncement)}
                    className="flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('telegram', selectedAnnouncement)}
                    className="flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span>Telegram</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={!!selectedAnnouncementForAnalytics} onOpenChange={() => setSelectedAnnouncementForAnalytics(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Analytics - {selectedAnnouncementForAnalytics?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {analyticsData && (
            <div className="space-y-6 overflow-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-8 w-8" style={{ color: primaryColor || '#3b82f6' }} />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>{analyticsData.views}</p>
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="text-xs text-gray-400">Hover interactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <MousePointer className="h-8 w-8" style={{ color: secondaryColor || '#10b981' }} />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: secondaryColor || '#10b981' }}>{analyticsData.clicks}</p>
                        <p className="text-sm text-gray-500">Clicks</p>
                        <p className="text-xs text-gray-400">All interactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{analyticsData.conversions}</p>
                        <p className="text-sm text-gray-500">Conversions</p>
                        <p className="text-xs text-gray-400">Images, files, links</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Activity</h3>
                
                {analyticsData.viewsData?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h4 className="font-medium flex items-center space-x-2">
                        <Eye className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                        <span>Recent Views</span>
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {analyticsData.viewsData.slice(0, 10).map((view, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">User viewed news</span>
                            <span className="text-gray-400">
                              {formatDistanceToNow(new Date(view.createdAt))} ago
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analyticsData.clicksData?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h4 className="font-medium flex items-center space-x-2">
                        <MousePointer className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                        <span>Recent Clicks</span>
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {analyticsData.clicksData.slice(0, 10).map((click, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Clicked on {click.eventData?.elementClicked || 'news'}
                            </span>
                            <span className="text-gray-400">
                              {formatDistanceToNow(new Date(click.createdAt))} ago
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analyticsData.conversionsData?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h4 className="font-medium flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-purple-500" />
                        <span>Recent Conversions</span>
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {analyticsData.conversionsData.slice(0, 10).map((conversion, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {conversion.eventData?.conversionType === 'image_open' ? 'Opened image' : 
                               conversion.eventData?.conversionType === 'link_click' ? 'Clicked link' : 
                               'Downloaded file'}
                              {conversion.eventData?.fileName && `: ${conversion.eventData.fileName}`}
                            </span>
                            <span className="text-gray-400">
                              {formatDistanceToNow(new Date(conversion.createdAt))} ago
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {(!analyticsData.viewsData?.length && !analyticsData.clicksData?.length && !analyticsData.conversionsData?.length) && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No detailed activity data yet. Analytics will appear as users interact with your news.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          
          {!analyticsData && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete News</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{announcementToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setAnnouncementToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (announcementToDelete) {
                  deleteAnnouncementMutation.mutate(announcementToDelete.id);
                  setDeleteConfirmOpen(false);
                  setAnnouncementToDelete(null);
                }
              }}
              disabled={deleteAnnouncementMutation.isPending}
            >
              {deleteAnnouncementMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}