/**
 * Icon Color Management System
 * Provides contextual coloring for different types of icons to create visual hierarchy
 */

export interface IconColorConfig {
  primaryColor?: string;
  secondaryColor?: string;
}

export type IconType = 
  | 'status-success' 
  | 'status-warning' 
  | 'status-error' 
  | 'status-info'
  | 'action-primary' 
  | 'action-secondary' 
  | 'action-destructive'
  | 'navigation' 
  | 'decorative' 
  | 'neutral'
  | 'financial'
  | 'user'
  | 'content';

/**
 * Get appropriate color for an icon based on its type and context
 */
export function getIconColor(type: IconType, config: IconColorConfig = {}): string {
  const { primaryColor, secondaryColor } = config;

  switch (type) {
    // Status indicators - use semantic colors
    case 'status-success':
      return '#10b981'; // Green for success
    case 'status-warning':
      return '#f59e0b'; // Amber for warnings
    case 'status-error':
      return '#ef4444'; // Red for errors
    case 'status-info':
      return '#3b82f6'; // Blue for info

    // Primary actions - use brand primary color
    case 'action-primary':
      return primaryColor || '#3b82f6';

    // Secondary actions - use brand secondary or muted color
    case 'action-secondary':
      return secondaryColor || '#64748b';

    // Destructive actions - always red
    case 'action-destructive':
      return '#ef4444';

    // Navigation - use brand colors with fallback
    case 'navigation':
      return primaryColor || '#6366f1';

    // Financial/money related - green
    case 'financial':
      return '#10b981';

    // User/people related - use primary brand color
    case 'user':
      return primaryColor || '#8b5cf6';

    // Content related - neutral with slight brand tint
    case 'content':
      return secondaryColor || '#64748b';

    // Decorative - subtle neutral
    case 'decorative':
      return '#9ca3af';

    // Default neutral
    case 'neutral':
    default:
      return '#6b7280';
  }
}

/**
 * Icon type mappings for common Lucide icons
 */
export const iconTypeMap: Record<string, IconType> = {
  // Status icons
  'CheckCircle': 'status-success',
  'AlertCircle': 'status-warning',
  'XCircle': 'status-error',
  'Info': 'status-info',
  'AlertTriangle': 'status-warning',

  // User/People icons
  'Users': 'user',
  'User': 'user',
  'UserCheck': 'user',
  'UserX': 'user',
  'UserPlus': 'user',

  // Financial icons
  'DollarSign': 'financial',
  'CreditCard': 'financial',
  'Banknote': 'financial',
  'Coins': 'financial',
  'TrendingUp': 'financial',
  'TrendingDown': 'financial',

  // Navigation icons
  'Home': 'navigation',
  'Menu': 'navigation',
  'ChevronLeft': 'navigation',
  'ChevronRight': 'navigation',
  'ArrowLeft': 'navigation',
  'ArrowRight': 'navigation',

  // Action icons
  'Plus': 'action-primary',
  'Edit': 'action-secondary',
  'Trash': 'action-destructive',
  'Delete': 'action-destructive',
  'Save': 'action-primary',
  'Upload': 'action-secondary',
  'Download': 'action-secondary',

  // Content icons
  'FileText': 'content',
  'File': 'content',
  'Image': 'content',
  'Video': 'content',
  'Mail': 'content',
  'MessageCircle': 'content',
  'Bell': 'content',

  // Neutral/Decorative icons
  'Search': 'neutral',
  'Filter': 'neutral',
  'Settings': 'neutral',
  'MoreHorizontal': 'neutral',
  'Calendar': 'neutral',
  'Clock': 'neutral',
  'Globe': 'neutral',
  'Shield': 'neutral',
  'Lock': 'neutral',
  'Eye': 'neutral',
  'EyeOff': 'neutral',

  // Business icons
  'Building': 'navigation',
  'Building2': 'navigation',
  'Package': 'content',
  'ShoppingCart': 'action-secondary',
  'Activity': 'status-info',
  'BarChart': 'content',
  'BarChart3': 'content',
  'PieChart': 'content',
};

/**
 * Get color for a specific icon by name
 */
export function getIconColorByName(iconName: string, config: IconColorConfig = {}): string {
  const iconType = iconTypeMap[iconName] || 'neutral';
  return getIconColor(iconType, config);
}

/**
 * Create style object for icon coloring
 */
export function createIconStyle(iconName: string, config: IconColorConfig = {}): { color: string } {
  return {
    color: getIconColorByName(iconName, config)
  };
}