import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StrategyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  techniques: string[];
  effectiveness: string;
  index: number;
}

const StrategyCard = ({ icon: Icon, title, description, techniques, effectiveness, index }: StrategyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:glow-primary"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <span className="inline-block px-2 py-0.5 text-xs font-mono rounded bg-secondary text-primary">
            {effectiveness}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Key Techniques
        </div>
        {techniques.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
            {t}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StrategyCard;
