import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number;
  verified?: boolean;
  className?: string;
}

export const ConfidenceBadge = ({ confidence, verified = false, className = "" }: ConfidenceBadgeProps) => {
  const getColor = () => {
    if (confidence >= 85) return "verified";
    if (confidence >= 70) return "primary";
    if (confidence >= 50) return "ai-purple";
    return "muted";
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <div className="relative w-10 h-10">
        <svg className="transform -rotate-90 w-10 h-10">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted opacity-20"
          />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className={`text-${color}`}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            style={{
              filter: verified ? "drop-shadow(var(--glow-verified))" : undefined,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{confidence}%</span>
        </div>
      </div>
      {verified && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex items-center gap-1 bg-verified text-verified-foreground px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ boxShadow: "var(--glow-verified)" }}
        >
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </motion.div>
      )}
    </motion.div>
  );
};
