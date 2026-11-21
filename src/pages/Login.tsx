import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/entities/all";
import { useAuth } from "@/lib/AuthContext";
import { productLogoUrl, productName, routes } from "@/lib/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * @type {React.FC<{}>}
 */
export default function Login() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      // No logging here: email and name are personal data.
      await User.login(email, name);
      await checkUserAuth();

      toast.success("Welcome! Redirecting to dashboards...");
      navigate(routes.dashboards);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm shadow-overlay border-border/60">
          <CardHeader className="text-center pb-4">
            {/* Decorative: the heading below names the product. */}
            <img src={productLogoUrl} alt="" className="size-14 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome to {productName}</CardTitle>
            <CardDescription className="mt-1.5">
              Get started by entering your information
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email.trim() || !name.trim()}
                size="lg"
                className="w-full"
              >
                {isLoading ? "Logging in..." : "Continue"}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/70">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Based on <strong>The Mom Test</strong> methodology by Rob Fitzpatrick. 
                This app helps you organize customer research into focused dashboards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
