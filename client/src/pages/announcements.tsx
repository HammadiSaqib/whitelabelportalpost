import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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
  Menu,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  id: number;
  userId: string;
  title?: string;
  content: string;
  attachments: Array<{url: string, type: string, name: string}>;
  visibility: 'public' | 'clients' | 'affiliates' | 'admins';
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

interface Comment {
  id: number;
  content: string;
  parentCommentId?: number;
  createdAt: string;
  authorName: string;
  authorEmail: string;
  authorProfileImage?: string;
  userId: string;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    visibility: 'public' as const
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/announcements', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement posted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setShowCreateForm(false);
      setNewPost({ title: '', content: '', visibility: 'public' });
      setUploadedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive"
      });
    }
  });

  // Like announcement mutation
  const likeMutation = useMutation({
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
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async ({ announcementId, content }: { announcementId: number, content: string }) => {
      return await apiRequest(`/api/announcements/${announcementId}/comments`, 'POST', { content });
    },
    onSuccess: (_, { announcementId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
    }
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      return await apiRequest(`/api/announcements/${announcementId}/share`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement shared successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    }
  });

  // Update announcement mutation
  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormData }) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update announcement');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setEditingAnnouncement(null);
      setNewPost({ title: '', content: '', visibility: 'public' });
      setUploadedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive"
      });
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      
      if (!response.ok) throw new Error('Failed to delete announcement');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  });

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

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Post content is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('visibility', newPost.visibility); // Fixed: Send visibility instead of isPublic
      
      // Add file attachment if present (only one file supported currently)
      if (uploadedFiles.length > 0) {
        formData.append('attachment', uploadedFiles[0]);
      }
      
      if (editingAnnouncement) {
        // Update existing announcement
        updateAnnouncementMutation.mutate({ id: editingAnnouncement.id, data: formData });
      } else {
        // Create new announcement
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
        setNewPost({ title: '', content: '', visibility: 'public' });
        setUploadedFiles([]);
        setShowCreateForm(false);
        
        // Refresh announcements
        queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
        
        toast({
          title: "Success",
          description: "Announcement created successfully"
        });
      }
      
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewPost({
      title: announcement.title || '',
      content: announcement.content,
      visibility: announcement.visibility
    });
    setUploadedFiles([]);
    setShowCreateForm(true);
  };

  const handleLike = (announcementId: number) => {
    likeMutation.mutate(announcementId);
  };

  const handleComment = (announcementId: number) => {
    const content = commentInputs[announcementId]?.trim();
    if (!content) return;

    commentMutation.mutate({ announcementId, content });
  };

  const handleShare = (announcementId: number) => {
    shareMutation.mutate(announcementId);
  };

  const toggleComments = (announcementId: number) => {
    setShowComments(prev => ({
      ...prev,
      [announcementId]: !prev[announcementId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Hamburger Menu */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600"
            >
              <Menu className="h-6 w-6" style={{ color: 'var(--secondary-color, #6366f1)' }} />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Announcements</h1>
            <div className="w-10"></div>
          </div>

          <Header 
            title="Announcements" 
            subtitle="Community updates and news"
          />
          <div className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">Loading announcements...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" style={{ color: 'var(--secondary-color, #6366f1)' }} />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Announcements</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="Announcements"
          subtitle="Community updates and news"
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Create Post Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-gray-500"
                  onClick={() => setShowCreateForm(true)}
                >
                  What's on your mind?
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Create Post Modal */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAnnouncement(null);
                      setNewPost({ title: '', content: '', visibility: 'public' });
                      setUploadedFiles([]);
                    }}
                  >
                    <X className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
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
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="affiliates">Affiliates</SelectItem>
                          <SelectItem value="admins">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Input
                  placeholder="Title (optional)"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                />

                <Textarea
                  placeholder="What's happening?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drop files here to upload, or{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-600"
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
                          <X className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                      Attach
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingAnnouncement(null);
                        setNewPost({ title: '', content: '', visibility: 'public' });
                        setUploadedFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                    >
                      {createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending 
                        ? (editingAnnouncement ? 'Updating...' : 'Posting...') 
                        : (editingAnnouncement ? 'Update' : 'Post')
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements Feed */}
          <div className="space-y-6">
            {announcements.map((announcement: Announcement) => (
              <Card key={announcement.id} className={announcement.isPinned ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10' : ''}>
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
                          <Pin className="h-4 w-4 text-blue-500" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getVisibilityIcon(announcement.visibility)}
                          <span className="ml-1 capitalize">{announcement.visibility}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(announcement.createdAt))} ago
                      </p>
                    </div>
                    {/* Only show 3-dot menu if user owns the announcement or is super admin */}
                    {(String(announcement.userId) === String(user?.id) || user?.role === 'super_admin') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEditAnnouncement(announcement)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                            Edit Announcement
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setAnnouncementToDelete(announcement);
                              setDeleteConfirmOpen(true);
                            }}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Announcement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {announcement.title && (
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  )}
                  
                  <p className="whitespace-pre-wrap">{announcement.content}</p>

                  {/* Attachments */}
                  {announcement.attachments && Array.isArray(announcement.attachments) && announcement.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {announcement.attachments.map((attachment, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          {attachment.type.startsWith('image/') ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <div className="p-4 flex items-center space-x-2">
                              {getFileIcon(attachment.type)}
                              <span className="text-sm truncate">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Engagement Bar */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center space-x-1 ${announcement.userLiked ? 'text-red-500' : 'text-gray-500'}`}
                        onClick={() => handleLike(announcement.id)}
                      >
                        <Heart className={`h-4 w-4 ${announcement.userLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                        <span>{announcement.likesCount}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => toggleComments(announcement.id)}
                      >
                        <MessageCircle className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                        <span>{announcement.commentsCount}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleShare(announcement.id)}
                      >
                        <Share2 className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                        <span>{announcement.sharesCount}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Comment Section */}
                  {showComments[announcement.id] && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImageUrl} />
                          <AvatarFallback className="text-xs">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
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
                          >
                            <Send className="h-4 w-4" style={{ color: 'var(--secondary-color, #6366f1)' }} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {announcements.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <MessageCircle className="h-full w-full" style={{ color: 'var(--secondary-color, #6366f1)' }} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No announcements yet
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to share an announcement with the community.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create First Announcement
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{announcementToDelete?.title || 'this announcement'}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
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
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}