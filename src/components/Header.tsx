import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg"
    >
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">TruthVerse</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Feed
          </Link>
          <Link 
            to="/ai-chat" 
            className={`text-sm font-medium transition-colors ${
              isActive("/ai-chat") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            AI Chat
          </Link>
          <Link 
            to="/verify" 
            className={`text-sm font-medium transition-colors ${
              isActive("/verify") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Verify Link
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm font-medium transition-colors ${
              isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-ai-purple hover:opacity-90">
            Get Pro
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
