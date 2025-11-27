import { motion } from "framer-motion";
import { Activity, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { Card } from "./ui/card";

const stats = [
  { label: "Verified Today", value: "1,234", icon: CheckCircle2, color: "verified" },
  { label: "Active Checks", value: "89", icon: Activity, color: "primary" },
  { label: "Accuracy Rate", value: "97.8%", icon: TrendingUp, color: "ai-purple" },
];

const recentVerifications = [
  { title: "Climate Change Report", confidence: 94, time: "2m ago" },
  { title: "Economic Policy Update", confidence: 91, time: "5m ago" },
  { title: "Tech Innovation News", confidence: 88, time: "8m ago" },
  { title: "Healthcare Study Results", confidence: 96, time: "12m ago" },
];

export const RightSidebar = () => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-80 h-screen sticky top-0 p-6 space-y-6 border-l border-border overflow-y-auto"
    >
      {/* Stats Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Live Stats
        </h3>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Recently Verified</h3>
        <div className="space-y-2">
          {recentVerifications.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <span className="text-xs text-verified font-semibold">{item.confidence}%</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Quick Verify */}
      <Card className="p-4 glass-effect gradient-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-purple to-primary flex items-center justify-center animate-glow-pulse">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold">AI Assistant</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Get instant fact-checking powered by advanced AI verification models.
          </p>
          <button className="w-full py-2 px-4 bg-gradient-to-r from-ai-purple to-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Ask AI
          </button>
        </div>
      </Card>

      {/* Upgrade Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-ai-purple/10 border-primary/20">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Upgrade to Pro</h3>
          <p className="text-xs text-muted-foreground">
            Unlock unlimited AI chats, advanced analytics, and priority verification.
          </p>
          <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </Card>
    </motion.aside>
  );
};
