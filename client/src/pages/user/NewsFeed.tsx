import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Heart, MessageCircle, Share2, Search, Calendar, User, X, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  attachments?: any[];
  createdAt: string;
  authorName: string;
  authorImage?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  userLiked: boolean;
  comments?: Comment[];
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorProfileImage?: string;
  createdAt: string;
}

export default function NewsFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, params] = useRoute('/:domain/user/:page?');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [commentsData, setCommentsData] = useState<{[key: number]: Comment[]}>({});
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [commentText, setCommentText] = useState<string>('');
  const [selectedAnnouncementForComments, setSelectedAnnouncementForComments] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState<number | null>(null);
  const [highlightedAnnouncementId, setHighlightedAnnouncementId] = useState<number | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: boolean}>({});
  const [imageErrorStates, setImageErrorStates] = useState<{[key: number]: boolean}>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['user-announcements', user?.id, params?.domain],
    queryFn: async () => {
      const response = await fetch(`/api/affiliate/announcements?domain=${params?.domain}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
    enabled: !!user?.id && !!params?.domain
  });

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#announcement-')) {
        const announcementId = parseInt(hash.replace('#announcement-', ''));
        if (!isNaN(announcementId)) {
          setHighlightedAnnouncementId(announcementId);
          // Scroll to the announcement after a short delay to ensure it's rendered
          setTimeout(() => {
            const element = document.getElementById(`announcement-${announcementId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedAnnouncementId(null);
          }, 3000);
        }
      }
    };

    // Check hash on component mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [announcements]);

  // Like mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      const response = await fetch(`/api/announcements/${announcementId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      return response.json();
    },
    onMutate: async (announcementId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user-announcements'] });

      // Snapshot the previous value
      const previousAnnouncements = queryClient.getQueryData(['user-announcements', user?.id, params?.domain]);

      // Optimistically update the cache
      queryClient.setQueryData(['user-announcements', user?.id, params?.domain], (old: Announcement[] = []) => {
        return old.map(announcement => {
          if (announcement.id === announcementId) {
            return {
              ...announcement,
              userLiked: !announcement.userLiked,
              likesCount: announcement.userLiked 
                ? announcement.likesCount - 1 
                : announcement.likesCount + 1
            };
          }
          return announcement;
        });
      });

      // Return a context object with the snapshotted value
      return { previousAnnouncements };
    },
    onError: (err, announcementId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAnnouncements) {
        queryClient.setQueryData(['user-announcements', user?.id, params?.domain], context.previousAnnouncements);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['user-announcements'] });
    }
  });

  const handleLike = (announcementId: number) => {
    likeMutation.mutate(announcementId);
  };

  // Fetch comments for a specific announcement
  const fetchComments = async (announcementId: number) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/comments`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const comments = await response.json();
      setCommentsData(prev => ({ ...prev, [announcementId]: comments }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
    const commentMutation = useMutation({
    mutationFn: async ({ announcementId, content }: { announcementId: number; content: string }) => {
      const response = await fetch(`/api/announcements/${announcementId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-announcements'] });
      // Refresh comments for this announcement
      fetchComments(variables.announcementId);
    }
  });

  const handleComment = (announcementId: number) => {
    const content = commentInputs[announcementId]?.trim();
    if (!content) return;

    commentMutation.mutate({ announcementId, content });
    setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
  };

  const handleShare = (announcement: Announcement) => {
    setShowShareModal(announcement.id);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareToSocialMedia = (platform: string, url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">News Feed</h1>
          <p className="text-gray-600">Stay updated with the latest announcements</p>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No announcements yet</h3>
              <p>Check back later for updates and news.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <Card 
              key={announcement.id} 
              id={`announcement-${announcement.id}`}
              className={`transition-all duration-300 ${
                highlightedAnnouncementId === announcement.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {announcement.authorImage ? (
                        <img 
                          src={announcement.authorImage} 
                          alt={announcement.authorName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{announcement.authorName}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{announcement.title}</h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {announcement.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {(() => {
                  // Handle attachments that might be stored as JSON strings in the database
                  let attachments = announcement.attachments;
                  
                  // If attachments is a string, try to parse it as JSON
                  if (typeof attachments === 'string') {
                    try {
                      attachments = JSON.parse(attachments);
                    } catch (error) {
                      console.error('Failed to parse attachments JSON:', error);
                      attachments = [];
                    }
                  }
                  
                  // Ensure attachments is an array
                  if (!Array.isArray(attachments)) {
                    attachments = [];
                  }

                  // Find the first image attachment
                  const imageAttachment = attachments.find(attachment => 
                    attachment.type?.startsWith('image/') || 
                    attachment.type === 'image' || 
                    attachment.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                  );

                  return imageAttachment ? (
                    <div className="rounded-lg overflow-hidden bg-gray-100 relative">
                      {imageLoadingStates[announcement.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      )}
                      {imageErrorStates[announcement.id] ? (
                        <div className="flex items-center justify-center h-48 bg-gray-200 text-gray-500">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm">Image could not be loaded</p>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={imageAttachment.url} 
                          alt={imageAttachment.name || announcement.title}
                          className="w-full h-auto max-h-96 object-cover transition-opacity duration-300"
                          onLoad={() => {
                            setImageLoadingStates(prev => ({ ...prev, [announcement.id]: false }));
                          }}
                          onLoadStart={() => {
                            setImageLoadingStates(prev => ({ ...prev, [announcement.id]: true }));
                          }}
                          onError={() => {
                            setImageLoadingStates(prev => ({ ...prev, [announcement.id]: false }));
                            setImageErrorStates(prev => ({ ...prev, [announcement.id]: true }));
                          }}
                        />
                      )}
                    </div>
                  ) : null;
                })()}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(announcement.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        announcement.userLiked 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          announcement.userLiked ? 'fill-current' : ''
                        }`} 
                      />
                      <span>{announcement.likesCount}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowComments(prev => ({ 
                          ...prev, 
                          [announcement.id]: !prev[announcement.id] 
                        }));
                        // Fetch comments when opening comments section
                        if (!showComments[announcement.id]) {
                          fetchComments(announcement.id);
                        }
                      }}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{announcement.commentsCount}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(announcement)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-green-600 hover:bg-green-50"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {showComments[announcement.id] && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {user?.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.firstName || user.email}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={commentInputs[announcement.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ 
                            ...prev, 
                            [announcement.id]: e.target.value 
                          }))}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleComment(announcement.id)}
                            disabled={!commentInputs[announcement.id]?.trim() || commentMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {commentsData[announcement.id] && commentsData[announcement.id].length > 0 && (
                      <div className="space-y-3">
                        {commentsData[announcement.id].map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {comment.authorProfileImage ? (
                                <img 
                                  src={comment.authorProfileImage} 
                                  alt={comment.authorName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.authorName}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Announcement</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Copy Link Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copy Link
                </label>
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      copyToClipboard(`${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`);
                    }}
                    className={`${copiedLink ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copiedLink && (
                  <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
                )}
              </div>

              {/* Social Media Sharing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const announcement = announcements.find(a => a.id === showShareModal);
                      if (announcement) {
                        shareToSocialMedia('whatsapp', `${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`, announcement.title);
                      }
                    }}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">WhatsApp</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => {
                      const announcement = announcements.find(a => a.id === showShareModal);
                      if (announcement) {
                        shareToSocialMedia('twitter', `${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`, announcement.title);
                      }
                    }}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Twitter</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const announcement = announcements.find(a => a.id === showShareModal);
                      if (announcement) {
                        shareToSocialMedia('facebook', `${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`, announcement.title);
                      }
                    }}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Facebook</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      const announcement = announcements.find(a => a.id === showShareModal);
                      if (announcement) {
                        shareToSocialMedia('linkedin', `${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`, announcement.title);
                      }
                    }}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">LinkedIn</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => {
                      const announcement = announcements.find(a => a.id === showShareModal);
                      if (announcement) {
                        shareToSocialMedia('telegram', `${window.location.origin}${window.location.pathname}#announcement-${showShareModal}`, announcement.title);
                      }
                    }}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Telegram</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}