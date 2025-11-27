import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Eye, Flag, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

interface Report {
  id: string;
  title: string;
  url: string;
  reportedBy: string;
  reason: string;
  status: "reported" | "reviewing" | "verified" | "rejected";
  confidence?: number;
  reportCount: number;
  timestamp: Date;
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Misleading Claims About Vaccine Effectiveness",
    url: "https://example.com/article1",
    reportedBy: "user123",
    reason: "Contains false statistics",
    status: "reported",
    reportCount: 15,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    title: "Unverified Election Fraud Allegations",
    url: "https://example.com/article2",
    reportedBy: "user456",
    reason: "No credible sources cited",
    status: "reviewing",
    reportCount: 8,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    title: "Climate Data Misrepresentation",
    url: "https://example.com/article3",
    reportedBy: "user789",
    reason: "Cherry-picked data points",
    status: "verified",
    confidence: 88,
    reportCount: 12,
    timestamp: new Date(Date.now() - 10800000),
  },
];

const Moderator = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported": return "destructive";
      case "reviewing": return "default";
      case "verified": return "outline";
      case "rejected": return "secondary";
      default: return "default";
    }
  };

  const moveReport = (id: string, newStatus: Report["status"]) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const groupedReports = {
    reported: reports.filter(r => r.status === "reported"),
    reviewing: reports.filter(r => r.status === "reviewing"),
    verified: reports.filter(r => r.status === "verified"),
    rejected: reports.filter(r => r.status === "rejected"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Moderator Dashboard</h1>
          <p className="text-muted-foreground">Review and manage reported content</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Reports", value: groupedReports.reported.length, icon: Flag, color: "destructive" },
            { label: "Under Review", value: groupedReports.reviewing.length, icon: Eye, color: "primary" },
            { label: "Verified Today", value: 24, icon: CheckCircle2, color: "verified" },
            { label: "Accuracy Rate", value: "97.8%", icon: TrendingUp, color: "ai-purple" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-4 gap-6">
          {Object.entries(groupedReports).map(([status, items], columnIndex) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  {status}
                </h3>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {items.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: columnIndex * 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium line-clamp-2 flex-1">
                            {report.title}
                          </h4>
                          <Badge variant={getStatusColor(report.status)} className="shrink-0">
                            {report.reportCount}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="line-clamp-1">{report.reason}</span>
                        </div>
                        
                        {report.confidence && (
                          <div className="pt-2">
                            <ConfidenceBadge confidence={report.confidence} verified />
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2 border-t border-border">
                          {report.status === "reported" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveReport(report.id, "reviewing");
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                          )}
                          
                          {report.status === "reviewing" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveReport(report.id, "verified");
                                }}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verify
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveReport(report.id, "rejected");
                                }}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                {items.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No items in {status}</p>
                  </Card>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Report Detail */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-6">
                <div>
                  <Badge variant={getStatusColor(selectedReport.status)} className="mb-4">
                    {selectedReport.status}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{selectedReport.title}</h2>
                  <p className="text-sm text-muted-foreground">{selectedReport.url}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Report Reason</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-1">Reported By</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.reportedBy}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-1">Report Count</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.reportCount} reports</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-1">Timestamp</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1" onClick={() => moveReport(selectedReport.id, "verified")}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Verified
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => moveReport(selectedReport.id, "rejected")}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Moderator;
