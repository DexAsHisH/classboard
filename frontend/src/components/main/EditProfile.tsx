import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function EditProfile({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;

      if (!name.trim() && !email.trim() && !phone.trim()) {
        setError("Please fill in at least one field to update.");
        setIsLoading(false);
        return;
      }

      const updateData: { name?: string; email?: string; phone?: string } = {};

      if (name.trim()) {
        updateData.name = name.trim();
      }
      if (email.trim()) {
        updateData.email = email.trim();
      }
      if (phone.trim()) {
        updateData.phone = phone.trim();
      }

      const res = await axios.put(`${API_URL}/api/student/me`, updateData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          event.currentTarget.reset();
          setSuccess(false);
          setError(null);
          onOpenChange(false);
        }, 1000);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Only filled fields will be
              updated. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Update full name"
                disabled={isLoading}
                className="placeholder:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email
                <span className="text-muted-foreground text-xs ml-2">
                  (⚠️ This will force re-login)
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Update email"
                disabled={isLoading}
                className="placeholder:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Update phone number"
                disabled={isLoading}
                className="placeholder:text-sm"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                Profile updated successfully!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
