
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/20">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">
                    {user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/20">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">Guest User</div>
                  <div className="text-sm text-muted-foreground">Not signed in</div>
                </div>
              </div>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/signin")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              
              <div className="text-sm text-muted-foreground px-4">
                Sign in to sync your portfolio and finsights across devices
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
