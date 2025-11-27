import { motion } from "framer-motion";
import { TrendingUp, Filter, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

const trendingTopics = [
  { name: "Technology", count: 124 },
  { name: "Politics", count: 98 },
  { name: "Science", count: 76 },
  { name: "Business", count: 65 },
  { name: "Health", count: 54 },
];

export const LeftSidebar = () => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-72 h-screen sticky top-0 p-6 space-y-6 border-r border-border overflow-y-auto"
    >
      {/* Quick Verify */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Search className="w-4 h-4" />
          Quick Verify
        </h3>
        <div className="space-y-2">
          <Input
            placeholder="Paste link to verify..."
            className="h-9"
          />
          <Button size="sm" className="w-full">
            Verify Now
          </Button>
        </div>
      </div>

      {/* Confidence Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Confidence Filter
          </h3>
          <span className="text-xs text-muted-foreground">85%+</span>
        </div>
        <Slider defaultValue={[85]} max={100} step={5} />
      </div>

      {/* Trending Topics */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Trending Topics
        </h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <motion.button
              key={topic.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-left"
            >
              <span className="text-sm font-medium">{topic.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {topic.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {["All", "Politics", "Tech", "Science", "Business", "Health"].map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Trusted Sources</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-verified" />
            <span className="text-muted-foreground">Reuters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-verified" />
            <span className="text-muted-foreground">AP News</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-verified" />
            <span className="text-muted-foreground">BBC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-verified" />
            <span className="text-muted-foreground">The Guardian</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
