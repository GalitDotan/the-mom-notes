import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/entities/all";
import { useAuth } from "@/lib/AuthContext";
import { messages } from "@/lib/constants";
import { css, icons } from "@/lib/theme";
import { Sparkles } from "lucide-react";
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
      console.log("Logging in with email:", email, "and name:", name);

      await User.login(email, name);

      console.log("Login successful, checking auth...");
      await checkUserAuth();

      toast.success("Welcome! Redirecting to dashboards...");
      navigate("/DashboardsPage");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.pageGradient}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Sparkles className={`${icons.sizes['2xl']} text-white`} />
            </div>
            <CardTitle className="text-2xl">Welcome to Mom Notes</CardTitle>
            <CardDescription className="mt-2">
              Get started by entering your information
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                className={`${css.gradientButton} w-full`}
              >
                {isLoading ? "Logging in..." : "Continue"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
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
