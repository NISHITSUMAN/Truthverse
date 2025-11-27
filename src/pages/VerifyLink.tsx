import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Search, CheckCircle2, XCircle, AlertCircle, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

interface VerificationResult {
  url: string;
  title: string;
  status: "verified" | "fake" | "needs-review";
  confidence: number;
  summary: string;
  evidence: {
    source: string;
    stance: "support" | "contradict" | "neutral";
    excerpt: string;
  }[];
  checkedSources: number;
  processingTime: number;
}

const VerifyLink = () => {
  const [url, setUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = () => {
    if (!url.trim()) return;
    
    setIsVerifying(true);
    setResult(null);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setResult({
        url,
        title: "Revolutionary AI Breakthrough Transforms Healthcare Diagnostics",
        status: "verified",
        confidence: 94,
        summary: "This article has been verified across 47 trusted sources. The claims made are supported by peer-reviewed research published in Nature Medicine and validated by the World Health Organization. All statistics cited have been fact-checked against original research data.",
        evidence: [
          {
            source: "Nature Medicine Journal",
            stance: "support",
            excerpt: "Clinical trials demonstrate 94.7% improvement in diagnostic speed with 98.2% accuracy rate across diverse patient populations.",
          },
          {
            source: "WHO Report",
            stance: "support",
            excerpt: "World Health Organization validates methodology and endorses the technology for broader clinical implementation.",
          },
          {
            source: "Stanford Medical Center",
            stance: "support",
            excerpt: "Independent verification confirms diagnostic accuracy matches or exceeds specialist-level performance in most categories.",
          },
        ],
        checkedSources: 47,
        processingTime: 2.3,
      });
    }, 3000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle2,
          color: "verified",
          label: "Verified",
          bgClass: "bg-verified/10",
        };
      case "fake":
        return {
          icon: XCircle,
          color: "destructive",
          label: "Fake News",
          bgClass: "bg-destructive/10",
        };
      default:
        return {
          icon: AlertCircle,
          color: "ai-purple",
          label: "Needs Review",
          bgClass: "bg-ai-purple/10",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-5xl font-bold">Verify Any Link</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste any URL and our AI will verify it across thousands of trusted sources in seconds.
          </p>
        </motion.div>

        {/* Verify Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-8 glass-effect gradient-border">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="https://example.com/article..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                  className="flex-1 h-12"
                  disabled={isVerifying}
                />
                <Button 
                  onClick={handleVerify}
                  disabled={isVerifying || !url.trim()}
                  className="h-12 px-8 bg-gradient-to-r from-primary to-ai-purple hover:opacity-90"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Verify Now
                    </>
                  )}
                </Button>
              </div>
              
              {!result && !isVerifying && (
                <p className="text-xs text-muted-foreground text-center">
                  Try it with any news article, social media post, or claim
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Scanning Animation */}
        <AnimatePresence>
          {isVerifying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <Card className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-ai-purple opacity-20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-ai-purple opacity-40"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                  <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary to-ai-purple flex items-center justify-center animate-glow-pulse">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">AI Verification in Progress</h3>
                <p className="text-muted-foreground mb-4">
                  Analyzing article across trusted sources...
                </p>
                
                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">47</div>
                    <div className="text-muted-foreground">Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ai-purple">2.3s</div>
                    <div className="text-muted-foreground">Processing</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card className={`p-8 ${getStatusInfo(result.status).bgClass} border-2`}>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center">
                      {(() => {
                        const StatusIcon = getStatusInfo(result.status).icon;
                        return <StatusIcon className="w-10 h-10 text-white" />;
                      })()}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <ConfidenceBadge confidence={result.confidence} verified={result.status === "verified"} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-${getStatusInfo(result.status).color} text-${getStatusInfo(result.status).color}-foreground`}>
                        {getStatusInfo(result.status).label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Verified in {result.processingTime}s across {result.checkedSources} sources
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{result.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                    
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Original
                      </Button>
                      <Button variant="outline" size="sm">
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Evidence Section */}
              <div>
                <h3 className="text-xl font-bold mb-4">Supporting Evidence</h3>
                <div className="space-y-3">
                  {result.evidence.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {item.stance === "support" && (
                              <ThumbsUp className="w-5 h-5 text-verified" />
                            )}
                            {item.stance === "contradict" && (
                              <ThumbsDown className="w-5 h-5 text-destructive" />
                            )}
                            {item.stance === "neutral" && (
                              <AlertCircle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">{item.source}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.stance === "support" ? "bg-verified/20 text-verified" :
                                item.stance === "contradict" ? "bg-destructive/20 text-destructive" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {item.stance}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VerifyLink;
