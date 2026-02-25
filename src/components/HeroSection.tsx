import { motion } from "framer-motion";
import { ShieldAlert, Scan, Brain } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Grid + radial background */}
      <div className="absolute inset-0 bg-grid bg-radial-fade" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(174 72% 50% / 0.4), transparent)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(270 60% 60% / 0.4), transparent)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border bg-secondary/50 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-mono text-muted-foreground">AI Reliability Research</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Detecting{" "}
          <span className="text-gradient-primary">Hallucinations</span>
          <br />
          in Large Language Models
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          A comprehensive exploration of strategies to identify, measure, and mitigate 
          when AI models generate plausible but factually incorrect information.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: ShieldAlert, label: "6 Strategies", sub: "Detection methods" },
            { icon: Scan, label: "End-to-End", sub: "Full pipeline coverage" },
            { icon: Brain, label: "Research-Backed", sub: "Latest techniques" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/60 border border-border backdrop-blur-sm"
            >
              <item.icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
