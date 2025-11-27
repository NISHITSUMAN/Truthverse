import { motion } from "framer-motion";
import { Clock, Eye, Flag } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { Button } from "./ui/button";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  image: string;
  confidence: number;
  verified: boolean;
  source: string;
  timeAgo: string;
  category: string;
  onClick: () => void;
  index: number;
}

export const NewsCard = ({
  title,
  summary,
  image,
  confidence,
  verified,
  source,
  timeAgo,
  category,
  onClick,
  index,
}: NewsCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-card rounded-2xl overflow-hidden hover-lift cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>

        {/* Confidence Badge */}
        <div className="absolute top-4 right-4">
          <ConfidenceBadge confidence={confidence} verified={verified} />
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:line-clamp-none transition-all">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground line-clamp-2">{summary}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">{source}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            See Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
};
