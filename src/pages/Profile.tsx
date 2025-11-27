import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { User, Mail, Calendar, Settings, Bookmark, TrendingUp, Zap, Crown, Bell, Lock, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { NewsCard } from "@/components/NewsCard";

const Profile = () => {
  const savedArticles = [
    {
      id: "1",
      title: "Revolutionary AI Breakthrough Transforms Healthcare Diagnostics",
      summary: "Scientists develop new AI system that can detect diseases 95% faster.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
      confidence: 94,
      verified: true,
      source: "Nature Medicine",
      timeAgo: "2h ago",
      category: "Science",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center text-3xl font-bold text-white">
                  JD
                </div>
                <h2 className="text-xl font-bold mb-1">John Doe</h2>
                <p className="text-sm text-muted-foreground mb-4">john.doe@email.com</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Free Plan
                  </span>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Card>
            </motion.div>

            {/* Usage Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Usage This Month
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">AI Chats</span>
                      <span className="text-sm font-semibold">3/5</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-ai-purple rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Link Verifications</span>
                      <span className="text-sm font-semibold">7/10</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Saved Articles</span>
                      <span className="text-sm font-semibold">15/20</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-verified rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-ai-purple/10 border-primary/20">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center animate-glow-pulse">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Unlock unlimited AI chats, advanced analytics, and priority verification
                    </p>
                    
                    <div className="space-y-2 text-left mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>Unlimited AI Conversations</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>Priority Fact-Checking</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>Advanced Analytics</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-primary to-ai-purple hover:opacity-90">
                      Upgrade Now - $9.99/mo
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Settings & Saved */}
          <div className="lg:col-span-2 space-y-8">
            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive verification updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Save Articles</p>
                        <p className="text-xs text-muted-foreground">Save verified stories automatically</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Privacy & Security
                  </h3>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Update Email
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Saved Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bookmark className="w-6 h-6" />
                Saved Articles
              </h2>
              
              <div className="space-y-6">
                {savedArticles.map((article, index) => (
                  <NewsCard
                    key={article.id}
                    {...article}
                    onClick={() => {}}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
