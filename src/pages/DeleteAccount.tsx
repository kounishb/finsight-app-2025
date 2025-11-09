import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const DeleteAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("You must be signed in to delete your account");
      return;
    }

    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // Call the edge function to delete the account
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error("No active session");
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/delete-user-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success("Your account has been deleted successfully");
      
      // Sign out and redirect
      await supabase.auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="max-w-3xl mx-auto pt-8 pb-6">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trash2 className="h-6 w-6 text-destructive" />
                Delete Account - Finsight Investments
              </CardTitle>
              <CardDescription>
                Account deletion policy and process for Finsight Investments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Account deletion is permanent and cannot be undone. Please read the information below carefully before proceeding.
                </AlertDescription>
              </Alert>

              <section>
                <h2 className="text-lg font-semibold mb-3">Steps to Delete Your Account</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>You must be signed in to your Finsight Investments account</li>
                  <li>Review the data deletion information below</li>
                  <li>Click the "Delete My Account" button at the bottom of this page</li>
                  <li>Confirm your decision in the confirmation dialog</li>
                  <li>Your account and data will be immediately deleted</li>
                </ol>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Data That Will Be Deleted</h2>
                <p className="text-muted-foreground mb-2">
                  The following data will be <strong className="text-foreground">permanently deleted immediately</strong> upon account deletion:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Your account credentials and authentication information</li>
                  <li>Your profile information (display name, settings)</li>
                  <li>Your portfolio data (all tracked stocks and investments)</li>
                  <li>Your Finsights recommendations and preferences</li>
                  <li>All personalized settings and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Data Retention</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">No data is retained</strong> after account deletion. All personal information, 
                  portfolio data, and user preferences are immediately and permanently removed from our systems. 
                  We do not keep any backups or copies of your data after deletion.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Alternative: Sign Out</h2>
                <p className="text-muted-foreground mb-3">
                  If you only want to stop using the app temporarily, consider signing out instead of deleting your account. 
                  This will preserve your data for when you return.
                </p>
              </section>

              <Alert className="bg-destructive/10 border-destructive/50">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-foreground">
                  <strong>Warning:</strong> Account deletion is immediate and permanent. There is no way to recover your 
                  account or data after deletion. Please ensure you have exported any important information before proceeding.
                </AlertDescription>
              </Alert>

              {user ? (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    Currently signed in as: <strong className="text-foreground">{user.email}</strong>
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full"
                  >
                    {isDeleting ? "Deleting..." : "Delete My Account"}
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You must be signed in to delete your account.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => navigate("/signin")}
                    className="w-full mt-4"
                  >
                    Sign In
                  </Button>
                </div>
              )}

              <section className="text-xs text-muted-foreground pt-4 border-t">
                <h3 className="font-semibold text-sm mb-2 text-foreground">Contact Information</h3>
                <p>
                  If you encounter any issues with account deletion or have questions about this process, 
                  please contact our support team through the app or visit our privacy policy for more information.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DeleteAccount;
