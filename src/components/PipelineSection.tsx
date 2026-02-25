import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  { label: "Input", desc: "User query or prompt", color: "text-muted-foreground" },
  { label: "Generate", desc: "LLM produces response", color: "text-foreground" },
  { label: "Extract Claims", desc: "Parse factual assertions", color: "text-primary" },
  { label: "Verify", desc: "Cross-reference sources", color: "text-primary" },
  { label: "Score", desc: "Confidence + hallucination risk", color: "text-warning" },
  { label: "Output", desc: "Flagged & annotated response", color: "text-success" },
];

const PipelineSection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Detection <span className="text-gradient-primary">Pipeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end flow from user input to verified, annotated output with hallucination risk scores.
          </p>
        </motion.div>

        {/* Desktop pipeline */}
        <div className="hidden md:flex items-center justify-between gap-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col items-center text-center min-w-[120px]">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-3">
                  <span className="font-mono text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className={`text-sm font-semibold ${step.color}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile pipeline */}
        <div className="md:hidden space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <span className="font-mono text-sm font-bold text-primary w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className={`text-sm font-semibold ${step.color}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
