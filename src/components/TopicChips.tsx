import { motion } from "framer-motion";

const topics = [
  "All Stories",
  "Technology",
  "Politics",
  "Science",
  "Business",
  "Health",
  "Environment",
  "Sports",
  "Entertainment",
];

export const TopicChips = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {topics.map((topic, index) => (
        <motion.button
          key={topic}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${
              index === 0
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }
          `}
        >
          {topic}
        </motion.button>
      ))}
    </div>
  );
};
