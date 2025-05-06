'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

// Re-use the interface from UserManagementPanel
interface UserListData {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  isAdmin: boolean;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  // Add usage/remaining if fetched by the parent/API
  usage?: number;
  remainingUsage?: number;
}

interface EditUserModalProps {
  user: UserListData | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (updatedUser: UserListData) => void; // Callback to update parent state
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  // Add state for other editable fields if needed (e.g., usage counts)
  // const [usage, setUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
      setSubscriptionPlan(user.subscriptionPlan || '');
      // setUsage(user.usage || 0);
    }
  }, [user]);

  if (!user) return null;

  const handleSaveChanges = async () => {
    setIsLoading(true);
    let updated = false;

    // --- Update Admin Status ---
    if (isAdmin !== user.isAdmin) {
      try {
        console.log(`Updating admin status for ${user.uid} to ${isAdmin}`);
        const response = await fetch('/api/admin/set-claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId: user.uid, isAdmin: isAdmin }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to update admin status');
        toast({ title: "Success", description: "Admin status updated." });
        updated = true;
      } catch (err) {
        console.error("Error updating admin status:", err);
        toast({ title: "Error", description: `Failed to update admin status: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" });
        setIsLoading(false);
        return; // Stop if this fails
      }
    }

    // --- Update Subscription Plan ---
    if (subscriptionPlan && subscriptionPlan !== user.subscriptionPlan && ['free', 'pro', 'elite'].includes(subscriptionPlan)) {
        try {
            console.log(`Updating subscription plan for ${user.uid} to ${subscriptionPlan}`);
            const subResponse = await fetch('/api/admin/update-subscription', { // Call the actual endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId: user.uid, newPlan: subscriptionPlan }),
            });
            const subResult = await subResponse.json();
            if (!subResponse.ok) throw new Error(subResult.error || 'Failed to update subscription');
            toast({ title: "Success", description: "Subscription plan updated." });
            updated = true; // Mark as updated
        } catch (err) {
            console.error("Error updating subscription:", err);
            toast({ title: "Error", description: `Failed to update subscription: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" });
            // Decide if failure here should stop the process
        }
    }

    // --- Update Usage Counts (Example) ---
    // TODO: Implement API endpoint and logic for updating usage
    // if (usage !== user.usage) { ... }


    setIsLoading(false);
    if (updated) {
      // Call the callback to update the parent component's state
      onUserUpdate({ ...user, isAdmin: isAdmin, subscriptionPlan: subscriptionPlan /*, usage: usage */ });
    }
    onClose(); // Close the modal
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.email || user.uid}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Admin Status Toggle */}
          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <Label htmlFor="admin-status" className="flex flex-col space-y-1">
              <span>Admin Status</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Grant administrative privileges to this user.
              </span>
            </Label>
            <Switch
              id="admin-status"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>

          {/* Subscription Plan Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub-plan" className="text-right">
              Subscription
            </Label>
            <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>

           {/* Display Usage (Read-only for now) */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">Usage</Label>
             <p className="col-span-3 text-sm text-muted-foreground">
               {user.usage ?? 'N/A'} used / {user.remainingUsage ?? 'N/A'} remaining
               {/* TODO: Add input fields and API call if editing usage is needed */}
             </p>
           </div>

           {/* Display other read-only info */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">User ID</Label>
             <p className="col-span-3 text-sm text-muted-foreground break-all">{user.uid}</p>
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">Created</Label>
             <p className="col-span-3 text-sm text-muted-foreground">
               {user.creationTime ? new Date(user.creationTime).toLocaleString() : 'N/A'}
             </p>
           </div>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
