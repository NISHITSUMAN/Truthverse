import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Flag, Bookmark, ThumbsUp, ThumbsDown, ExternalLink, Clock } from "lucide-react";

const NewsDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const article = {
    id: "1",
    title: "Revolutionary AI Breakthrough Transforms Healthcare Diagnostics",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop",
    confidence: 94,
    verified: true,
    source: "Nature Medicine",
    timeAgo: "2h ago",
    category: "Science",
    author: "Dr. Sarah Chen",
    readTime: "8 min read",
    fullText: `In a groundbreaking development, researchers at leading medical institutions have unveiled an artificial intelligence system capable of diagnosing a wide range of diseases with unprecedented speed and accuracy. The system, which has undergone rigorous testing across multiple healthcare facilities, demonstrates a 95% improvement in diagnostic speed compared to conventional methods.

This technological advancement represents a significant leap forward in medical science, with experts suggesting it could revolutionize patient care on a global scale. The AI model was trained on millions of medical records and imaging data, enabling it to recognize patterns that might escape human observation.

Early trials have shown remarkable success in detecting conditions ranging from cardiovascular diseases to rare genetic disorders. Healthcare professionals worldwide are expressing optimism about the potential impact of this technology on patient outcomes and the overall efficiency of medical systems.

The development team, comprising specialists from multiple disciplines, spent over five years refining the algorithms and validation processes. The system underwent extensive testing in controlled clinical environments before receiving approval for broader implementation.

Key features of the system include real-time analysis capabilities, integration with existing hospital information systems, and a user-friendly interface that allows medical professionals to quickly interpret results and make informed decisions.

Critics have raised concerns about data privacy and the potential for over-reliance on automated systems. The research team has addressed these concerns by implementing robust security measures and emphasizing that the AI serves as a diagnostic aid rather than a replacement for human medical expertise.`,
    aiSummary: "Our AI verification system has analyzed this story across 47 trusted medical journals and news sources. The claims have been independently verified by peer-reviewed research published in Nature Medicine. The 95% speed improvement claim is supported by controlled trials involving over 10,000 patient cases across 15 countries. All quoted statistics have been fact-checked against original research data.",
    evidence: [
      {
        source: "Nature Medicine Journal",
        stance: "support" as const,
        excerpt: "Clinical trials demonstrate 94.7% improvement in diagnostic speed with 98.2% accuracy rate across diverse patient populations.",
        credibility: 98,
      },
      {
        source: "WHO Report",
        stance: "support" as const,
        excerpt: "World Health Organization validates methodology and endorses the technology for broader clinical implementation.",
        credibility: 97,
      },
      {
        source: "Stanford Medical Center",
        stance: "support" as const,
        excerpt: "Independent verification confirms diagnostic accuracy matches or exceeds specialist-level performance in most categories.",
        credibility: 96,
      },
    ],
  };

  const relatedArticles = [
    {
      id: "2",
      title: "Global Climate Agreement Reaches Historic Milestone",
      summary: "195 nations commit to unprecedented emissions reductions.",
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=400&h=300&fit=crop",
      confidence: 91,
      verified: true,
      source: "UN Climate Agency",
      timeAgo: "4h ago",
      category: "Environment",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="pb-12">
        {/* Hero Image */}
        <div className="relative h-[500px] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="container max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    {article.category}
                  </span>
                  <ConfidenceBadge confidence={article.confidence} verified={article.verified} />
                </div>
                
                <h1 className="text-5xl font-bold text-white">{article.title}</h1>
                
                <div className="flex items-center gap-6 text-white/80">
                  <span className="font-medium">{article.author}</span>
                  <span>•</span>
                  <span>{article.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.timeAgo}</span>
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-6 py-12">
          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pb-8 border-b border-border mb-8"
          >
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button variant="ghost" size="sm">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 mb-8 glass-effect gradient-border">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-ai-purple">AI</span> Verification Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">{article.aiSummary}</p>
            </Card>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
          >
            {article.fullText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed text-foreground">
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Evidence Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Supporting Evidence</h2>
            <div className="space-y-4">
              {article.evidence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-verified" />
                        <span className="font-semibold text-sm">{item.source}</span>
                      </div>
                      <span className="text-xs text-verified font-semibold">
                        {item.credibility}% credible
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                    <Button variant="link" size="sm" className="px-0">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Source
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Related Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Related Stories</h2>
            <div className="grid gap-6">
              {relatedArticles.map((related, index) => (
                <NewsCard
                  key={related.id}
                  {...related}
                  onClick={() => {}}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
