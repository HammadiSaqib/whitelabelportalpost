import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useRoute, useLocation } from "wouter";

// Import page components
import Overview from "./user/Overview";
import Products from "./user/Products";
import Collections from "./user/Collections";
import NewsFeed from "./user/NewsFeed";
import Profile from "./user/Profile";
import {
  User,
  Package,
  LogOut,
  ArrowLeft,
  Download,
  Play,
  FileText,
  Image,
  Video,
  File,
  ExternalLink,
  Eye,
  Folder,
  FolderOpen,
  Grid,
  Calendar,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  Home,
  BookOpen,
  Music,
  Camera,
  Code,
  Database,
  Globe,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Star,
  Heart,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Users,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Briefcase,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Share2,
  Link,
  Copy,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Upload,
  CloudDownload,
  Trash2,
  Edit,
  Plus,
  Minus,
  Save,
  Cancel,
  Check,
  AlertTriangle,
  Lock,
  Unlock,
  Shield,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Crown,
  Gem,
  Sparkles,
  Flame,
  Lightning,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Umbrella,
  Wind,
  Thermometer,
  Compass,
  Navigation,
  Map,
  Route,
  Car,
  Truck,
  Plane,
  Train,
  Ship,
  Bike,
  Walk,
  Run,
  Gamepad2,
  Headphones,
  Mic,
  Speaker,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Cpu,
  HardDrive,
  Memory,
  Server,
  Terminal,
  Command,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Indent,
  Outdent,
  Scissors,
  Clipboard,
  PasteIcon,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Move,
  MousePointer,
  Hand,
  Grab,
  GrabIcon,
  Crosshair,
  Focus,
  Scan,
  QrCode,
  Barcode,
  Tag,
  Tags,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkCheck,
  BookmarkX,
  Flag,
  FlagTriangleRight,
  FlagTriangleLeft,
  Pin,
  PinOff,
  Paperclip,
  Link2,
  Unlink,
  Chain,
  Anchor,
  Magnet,
  Zap as ZapIcon,
  Flashlight,
  Lightbulb,
  Candle,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  Sunrise,
  Sunset,
  SunDim,
  MoonIcon,
  Stars,
  CloudSun,
  CloudMoon,
  CloudSnow,
  CloudHail,
  CloudLightning,
  CloudDrizzle,
  Droplets,
  Waves,
  Tornado,
  Hurricane,
  Snowflake,
  IceCream,
  Coffee,
  Tea,
  Wine,
  Beer,
  Cocktail,
  Milk,
  Soup,
  Salad,
  Pizza,
  Sandwich,
  Cake,
  Cookie,
  Donut,
  Candy,
  Apple,
  Banana,
  Cherry,
  Grape,
  Orange,
  Peach,
  Strawberry,
  Watermelon,
  Carrot,
  Corn,
  Eggplant,
  Pepper,
  Potato,
  Tomato,
  Avocado,
  Broccoli,
  Cucumber,
  Lettuce,
  Mushroom,
  Onion,
  Pumpkin,
  Radish,
  Spinach,
  Flower,
  Flower2,
  FlowerIcon,
  Leaf,
  Leaves,
  Tree,
  TreePine,
  TreeDeciduous,
  Palmtree,
  Cactus,
  Seedling,
  Sprout,
  Wheat,
  Rice,
  Corn as CornIcon,
  Carrot as CarrotIcon,
  Fish,
  Rabbit,
  Turtle,
  Bird,
  Cat,
  Dog,
  Horse,
  Cow,
  Pig,
  Sheep,
  Goat,
  Chicken,
  Duck,
  Turkey,
  Elephant,
  Lion,
  Tiger,
  Bear,
  Wolf,
  Fox,
  Deer,
  Squirrel,
  Hedgehog,
  Bat,
  Owl,
  Eagle,
  Dove,
  Penguin,
  Flamingo,
  Swan,
  Peacock,
  Parrot,
  Toucan,
  Hummingbird,
  Butterfly,
  Bee,
  Ladybug,
  Spider,
  Snail,
  Worm,
  Bug,
  Ant,
  Mosquito,
  Fly,
  Dragonfly,
  Grasshopper,
  Cricket,
  Beetle,
  Cockroach,
  Scorpion,
  Crab,
  Lobster,
  Shrimp,
  Octopus,
  Squid,
  Jellyfish,
  Shark,
  Whale,
  Dolphin,
  Seal,
  Otter,
  Walrus,
  Narwhal,
  Tropical,
  Mountain,
  Volcano,
  Desert,
  Beach,
  Island,
  Forest,
  Jungle,
  Swamp,
  Lake,
  River,
  Ocean,
  Waterfall,
  Geyser,
  Cave,
  Canyon,
  Valley,
  Hill,
  Cliff,
  Rock,
  Stone,
  Pebble,
  Sand,
  Dirt,
  Grass,
  Moss,
  Fern,
  Vine,
  Bamboo,
  Reed,
  Seaweed,
  Coral,
  Shell,
  Starfish,
  Seahorse,
  Clam,
  Pearl,
  Treasure,
  Gem as GemIcon,
  Diamond,
  Ruby,
  Emerald,
  Sapphire,
  Topaz,
  Amethyst,
  Opal,
  Jade,
  Quartz,
  Crystal,
  Gold,
  Silver,
  Bronze,
  Copper,
  Iron,
  Steel,
  Aluminum,
  Titanium,
  Platinum,
  Lead,
  Tin,
  Zinc,
  Nickel,
  Cobalt,
  Chromium,
  Manganese,
  Tungsten,
  Uranium,
  Plutonium,
  Radium,
  Helium,
  Neon,
  Argon,
  Krypton,
  Xenon,
  Radon,
  Hydrogen,
  Oxygen,
  Nitrogen,
  Carbon,
  Sulfur,
  Phosphorus,
  Chlorine,
  Fluorine,
  Bromine,
  Iodine,
  Sodium,
  Potassium,
  Calcium,
  Magnesium,
  Lithium,
  Beryllium,
  Boron,
  Silicon,
  Arsenic,
  Selenium,
  Tellurium,
  Polonium,
  Astatine,
  Francium,
  Radium as RadiumIcon,
  Actinium,
  Thorium,
  Protactinium,
  Neptunium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson
} from 'lucide-react';

interface Purchase {
  id: number;
  planId: number;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
  whiteLabelId: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  type: 'video' | 'image' | 'file' | 'link' | 'website_link' | 'document';
  contentUrl: string | null;
  accessDuration: string | null;
  imageUrl: string | null;
  metadata: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
}

interface UserPlan {
  id: number;
  name: string;
  description: string | null;
  monthlyPrice: string | null;
  purchaseDate: string;
  categories: Category[];
  products: Product[];
}

// Category icon mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('video') || name.includes('movie') || name.includes('film')) return Video;
  if (name.includes('image') || name.includes('photo') || name.includes('picture')) return Image;
  if (name.includes('document') || name.includes('doc') || name.includes('text')) return FileText;
  if (name.includes('music') || name.includes('audio') || name.includes('sound')) return Music;
  if (name.includes('code') || name.includes('programming') || name.includes('development')) return Code;
  if (name.includes('design') || name.includes('graphic') || name.includes('art')) return Palette;
  if (name.includes('business') || name.includes('finance') || name.includes('money')) return Briefcase;
  if (name.includes('education') || name.includes('learning') || name.includes('course')) return BookOpen;
  if (name.includes('health') || name.includes('medical') || name.includes('fitness')) return Heart;
  if (name.includes('technology') || name.includes('tech') || name.includes('software')) return Monitor;
  if (name.includes('marketing') || name.includes('sales') || name.includes('promotion')) return TrendingUp;
  if (name.includes('game') || name.includes('gaming') || name.includes('entertainment')) return Gamepad2;
  if (name.includes('food') || name.includes('recipe') || name.includes('cooking')) return Coffee;
  if (name.includes('travel') || name.includes('tourism') || name.includes('vacation')) return MapPin;
  if (name.includes('fashion') || name.includes('style') || name.includes('clothing')) return Shirt;
  if (name.includes('home') || name.includes('house') || name.includes('interior')) return Home;
  if (name.includes('car') || name.includes('automotive') || name.includes('vehicle')) return Car;
  if (name.includes('sport') || name.includes('fitness') || name.includes('exercise')) return Activity;
  if (name.includes('nature') || name.includes('environment') || name.includes('outdoor')) return Leaf;
  if (name.includes('science') || name.includes('research') || name.includes('lab')) return Microscope;
  return Folder;
};

// Product type icon mapping
const getProductTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'image': return Image;
    case 'file': 
    case 'document': return FileText;
    case 'link':
    case 'website_link': return ExternalLink;
    default: return File;
  }
};

export default function ModernUserDashboard() {
  const { user, isAuthenticated, isLoading, domain } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [match, params] = useRoute("/:domain/user/:page?");
  const [location, setLocation] = useLocation();
  const routeDomain = params?.domain;
  const currentPage = params?.page || 'overview';

  // Navigation function
  const navigateTo = (page: string) => {
    setLocation(`/${routeDomain}/user/${page}`);
    setMobileMenuOpen(false);
  };

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    const currentDomain = domain || routeDomain;
    window.location.href = `/api/login?domain=${currentDomain}&returnTo=${window.location.href}`;
    return <div>Redirecting to login...</div>;
  }

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get user's purchases with domain context
  const currentDomain = domain || routeDomain;

  const handleLogout = () => {
    const currentDomain = domain || routeDomain;
    const returnToUrl = encodeURIComponent(`${window.location.origin}/${currentDomain}`);
    window.location.href = `/api/logout?returnTo=${returnToUrl}`;
  };

  const goBack = () => {
    const currentDomain = domain || routeDomain;
    if (currentDomain) {
      window.location.href = `/${currentDomain}`;
    } else {
      window.history.back();
    }
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard overview' },
    { id: 'products', label: 'Products', icon: Package, description: 'All accessible products' },
    { id: 'collections', label: 'Collections', icon: Folder, description: 'Categories and subcategories' },
    { id: 'news', label: 'News Feed', icon: Bell, description: 'Latest announcements' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Account settings' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Please Login
            </CardTitle>
            <CardDescription className="text-slate-600">
              You need to login to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() =>
                (window.location.href = `/api/login${currentDomain ? `?domain=${currentDomain}&returnTo=${encodeURIComponent(window.location.href)}` : ""}`)
              }
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5"
            >
              Login to Continue
            </Button>
            {currentDomain && (
              <Button variant="outline" onClick={goBack} className="w-full border-slate-300 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {currentDomain}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Navbar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {currentDomain ? `${currentDomain} Dashboard` : "My Dashboard"}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-5 w-5" />
              </Button>
              {currentDomain && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* VS Code Style Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'w-12' : 'w-80'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:relative inset-y-0 left-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none`}>
          
          {!sidebarCollapsed && (
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Grid className="h-5 w-5 text-blue-600" />
                    Dashboard
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => navigateTo(item.id)}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <span className={`font-medium text-sm ${
                            isActive
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                          }`}>
                            {item.label}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Collapsed Sidebar */}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center py-4 space-y-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => navigateTo(item.id)}
                    title={item.label}
                  >
                    <Icon className={`h-5 w-5 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                    }`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {(() => {
              switch (currentPage) {
                case 'overview':
                  return <Overview />;
                case 'products':
                  return <Products />;
                case 'collections':
                  return <Collections />;
                case 'news':
                  return <NewsFeed />;
                case 'profile':
                  return <Profile />;
                default:
                  return <Overview />;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}