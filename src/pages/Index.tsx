import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopicChips } from "@/components/TopicChips";
import { NewsCard } from "@/components/NewsCard";

// Mock data
const mockNews = [
  {
    id: "1",
    title: "Revolutionary AI Breakthrough Transforms Healthcare Diagnostics",
    summary: "Scientists develop new AI system that can detect diseases 95% faster than traditional methods, potentially saving millions of lives worldwide.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    confidence: 94,
    verified: true,
    source: "Nature Medicine",
    timeAgo: "2h ago",
    category: "Science",
    fullText: "In a groundbreaking development, researchers at leading medical institutions have unveiled an artificial intelligence system capable of diagnosing a wide range of diseases with unprecedented speed and accuracy. The system, which has undergone rigorous testing across multiple healthcare facilities, demonstrates a 95% improvement in diagnostic speed compared to conventional methods. This technological advancement represents a significant leap forward in medical science, with experts suggesting it could revolutionize patient care on a global scale. The AI model was trained on millions of medical records and imaging data, enabling it to recognize patterns that might escape human observation. Early trials have shown remarkable success in detecting conditions ranging from cardiovascular diseases to rare genetic disorders. Healthcare professionals worldwide are expressing optimism about the potential impact of this technology on patient outcomes and the overall efficiency of medical systems.",
    aiSummary: "Our AI verification system has analyzed this story across 47 trusted medical journals and news sources. The claims have been independently verified by peer-reviewed research published in Nature Medicine. The 95% speed improvement claim is supported by controlled trials involving over 10,000 patient cases across 15 countries. All quoted statistics have been fact-checked against original research data.",
    evidence: [
      {
        id: "e1",
        source: "Nature Medicine Journal",
        stance: "support" as const,
        excerpt: "Clinical trials demonstrate 94.7% improvement in diagnostic speed with 98.2% accuracy rate across diverse patient populations.",
        credibility: 98,
      },
      {
        id: "e2",
        source: "WHO Report",
        stance: "support" as const,
        excerpt: "World Health Organization validates methodology and endorses the technology for broader clinical implementation.",
        credibility: 97,
      },
      {
        id: "e3",
        source: "Stanford Medical Center",
        stance: "support" as const,
        excerpt: "Independent verification confirms diagnostic accuracy matches or exceeds specialist-level performance in most categories.",
        credibility: 96,
      },
    ],
  },
  {
    id: "2",
    title: "Global Climate Agreement Reaches Historic Milestone",
    summary: "195 nations commit to unprecedented emissions reductions, marking the most significant climate action in history.",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=800&h=600&fit=crop",
    confidence: 91,
    verified: true,
    source: "UN Climate Agency",
    timeAgo: "4h ago",
    category: "Environment",
    fullText: "World leaders have achieved a landmark agreement on climate action, with 195 countries pledging to implement aggressive emissions reduction targets over the next decade. The agreement, negotiated over three years of intensive diplomatic efforts, represents the most comprehensive global response to climate change in history. Under the terms of the accord, developed nations commit to achieving net-zero emissions by 2040, while providing substantial financial and technological support to developing countries. The framework includes legally binding targets, regular progress reviews, and penalties for non-compliance. Climate scientists and environmental organizations have cautiously welcomed the agreement, noting that while it represents significant progress, successful implementation will require sustained political will and substantial investment. The pact also establishes a $500 billion climate adaptation fund to help vulnerable nations address the impacts of climate change.",
    aiSummary: "Cross-verified through official UN documents, diplomatic sources, and international news agencies. The agreement details match official press releases from participating governments. Financial commitments have been confirmed through budget allocations in major economies. Timeline and targets align with IPCC recommendations for limiting global warming to 1.5°C.",
    evidence: [
      {
        id: "e4",
        source: "UN Official Statement",
        stance: "support" as const,
        excerpt: "195 nations have formally ratified the comprehensive climate agreement with binding targets for emissions reduction.",
        credibility: 99,
      },
      {
        id: "e5",
        source: "IPCC Assessment",
        stance: "support" as const,
        excerpt: "The proposed targets are consistent with pathways to limit global warming to 1.5°C above pre-industrial levels.",
        credibility: 98,
      },
    ],
  },
  {
    id: "3",
    title: "Quantum Computing Achieves Practical Business Applications",
    summary: "Tech giants report first commercial quantum computing solutions, solving problems impossible for classical computers.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    confidence: 88,
    verified: true,
    source: "MIT Technology Review",
    timeAgo: "6h ago",
    category: "Technology",
    fullText: "The quantum computing industry has reached a pivotal milestone with the announcement of commercially viable applications that demonstrate clear advantages over classical computing systems. Multiple technology companies have reported successful deployment of quantum systems for complex optimization problems in logistics, drug discovery, and financial modeling. These breakthrough applications represent years of research and engineering efforts to overcome the technical challenges that have historically limited quantum computing to laboratory environments. Industry analysts suggest this development could trigger a new wave of technological innovation across multiple sectors. The systems achieve quantum advantage by leveraging quantum entanglement and superposition to process information in fundamentally new ways. While costs remain high and specialized expertise is required, the technology is expected to become more accessible as the industry matures.",
    aiSummary: "Verified through technical documentation, peer-reviewed papers, and company announcements from IBM, Google, and other quantum computing leaders. Performance claims have been validated by independent testing laboratories. Timeline for commercial deployment aligns with industry roadmaps and expert predictions.",
    evidence: [
      {
        id: "e6",
        source: "IBM Research",
        stance: "support" as const,
        excerpt: "Quantum system successfully solved optimization problems in 4 hours that would require 47 years on classical supercomputers.",
        credibility: 95,
      },
      {
        id: "e7",
        source: "Nature Physics",
        stance: "support" as const,
        excerpt: "Independent researchers confirm quantum advantage in real-world applications beyond toy problems.",
        credibility: 96,
      },
    ],
  },
];

const Index = () => {
  const navigate = useNavigate();

  const handleNewsClick = (news: typeof mockNews[0]) => {
    navigate(`/news/${news.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Feed */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Topic Chips */}
            <div className="mb-8">
              <TopicChips />
            </div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center space-y-4"
            >
              <h1 className="text-5xl font-bold">
                AI-Verified News
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every story verified by advanced AI. Real sources. Real facts. Real trust.
              </p>
            </motion.div>

            {/* News Grid */}
            <div className="space-y-6">
              {mockNews.map((news, index) => (
                <NewsCard
                  key={news.id}
                  {...news}
                  onClick={() => handleNewsClick(news)}
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <button className="px-8 py-3 bg-muted hover:bg-accent text-foreground font-medium rounded-lg transition-colors">
                Load More Stories
              </button>
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden xl:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Index;
