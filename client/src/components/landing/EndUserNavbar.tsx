import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/BrandLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  LogOut,
  ShoppingCart,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EndUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface EndUserNavbarProps {
  user?: EndUser | null;
  isLoading?: boolean;
  whiteLabelName: string;
  domainPath: string;
  onLogin: () => void;
  onLogout: () => void;
}

export default function EndUserNavbar({
  user,
  isLoading,
  whiteLabelName,
  domainPath,
  onLogin,
  onLogout,
}: EndUserNavbarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Purchase Feature",
      description:
        "This feature will be available soon. You'll be able to purchase plans and products directly.",
    });
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BrandLogo size="sm" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BrandLogo size="sm" />
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePurchase}
                    className="hidden sm:flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Browse Plans</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.profileImageUrl}
                            alt={user.firstName || user.email}
                          />
                          <AvatarFallback>
                            {user.firstName
                              ? user.firstName[0].toUpperCase()
                              : user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowProfile(true)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handlePurchase}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>My Purchases</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={onLogin}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Information</DialogTitle>
            <DialogDescription>
              Your profile information for {whiteLabelName}
            </DialogDescription>
          </DialogHeader>

          {user && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={user.profileImageUrl}
                      alt={user.firstName || user.email}
                    />
                    <AvatarFallback className="text-lg">
                      {user.firstName
                        ? user.firstName[0].toUpperCase()
                        : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "User Profile"}
                    </CardTitle>
                    <CardDescription>End User Account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {user.firstName && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-gray-600">
                          {user.firstName} {user.lastName || ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium">
                        Account Type
                      </Label>
                      <p className="text-sm text-gray-600">
                        Customer of {whiteLabelName}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfile(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
