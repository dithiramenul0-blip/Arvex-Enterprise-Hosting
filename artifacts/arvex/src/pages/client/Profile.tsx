import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile, useChangePassword } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ClientProfile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const updateProfile = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile updated", description: "Your profile has been saved." });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "Failed to update profile." });
      }
    }
  });

  const changePassword = useChangePassword({
    mutation: {
      onSuccess: () => {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast({ title: "Password changed", description: "Your password has been updated." });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "Failed to change password." });
      }
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: profileData });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
      return;
    }
    changePassword.mutate({ 
      data: { 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      } 
    });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-white">Profile Settings</h1>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
          <CardDescription>Update your personal details and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="bg-black/50 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="bg-black/50 border-white/10"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Security</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength={8}
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  minLength={8}
                  className="bg-black/50 border-white/10"
                />
              </div>
            </div>
            <Button type="submit" variant="secondary" className="bg-white hover:bg-gray-200 text-black" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
