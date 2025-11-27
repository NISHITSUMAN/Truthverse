import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ThumbsUp, ThumbsDown, Share2, Flag } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Evidence {
  id: string;
  source: string;
  stance: "support" | "contradict" | "neutral";
  excerpt: string;
  credibility: number;
}

interface NewsDetail {
  title: string;
  image: string;
  confidence: number;
  verified: boolean;
  source: string;
  timeAgo: string;
  category: string;
  fullText: string;
  aiSummary: string;
  evidence: Evidence[];
}

interface NewsDetailModalProps {
  news: NewsDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsDetailModal = ({ news, isOpen, onClose }: NewsDetailModalProps) => {
  if (!news) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Title & Badge */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-white flex-1">
                    {news.title}
                  </h1>
                  <ConfidenceBadge confidence={news.confidence} verified={news.verified} />
                </div>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="font-medium">{news.source}</span>
                  <span>•</span>
                  <span>{news.timeAgo}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-white/20 rounded">{news.category}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* AI Summary */}
              <Card className="p-6 glass-effect gradient-border">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-ai-purple">AI</span> Summary & Reasoning
                </h2>
                <p className="text-muted-foreground leading-relaxed">{news.aiSummary}</p>
              </Card>

              {/* Full Article */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground leading-relaxed">{news.fullText}</p>
              </div>

              {/* Evidence Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Supporting Evidence</h2>
                <div className="grid gap-4">
                  {news.evidence.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{item.source}</span>
                            {item.stance === "support" && (
                              <ThumbsUp className="w-4 h-4 text-verified" />
                            )}
                            {item.stance === "contradict" && (
                              <ThumbsDown className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.credibility}% credible
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Source
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
