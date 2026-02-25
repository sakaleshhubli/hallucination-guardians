import { motion } from "framer-motion";
import {
  Layers,
  Search,
  GitCompare,
  Database,
  BarChart3,
  Zap,
} from "lucide-react";
import StrategyCard from "./StrategyCard";

const strategies = [
  {
    icon: GitCompare,
    title: "Self-Consistency Checking",
    description:
      "Generate multiple responses and compare them for agreement. Inconsistencies across samples strongly indicate hallucination.",
    techniques: [
      "Multi-sample voting",
      "Temperature-varied generation",
      "Cross-decoding verification",
    ],
    effectiveness: "High Accuracy",
  },
  {
    icon: Search,
    title: "Retrieval-Augmented Verification",
    description:
      "Ground model outputs against retrieved source documents. Compare claims with authoritative references to flag unsupported statements.",
    techniques: [
      "RAG fact-checking pipelines",
      "Source attribution scoring",
      "Knowledge base lookups",
    ],
    effectiveness: "Very High",
  },
  {
    icon: Layers,
    title: "Chain-of-Verification (CoVe)",
    description:
      "Prompt the model to generate verification questions about its own output, then answer them independently to surface contradictions.",
    techniques: [
      "Self-questioning protocols",
      "Decomposed verification",
      "Contradiction detection",
    ],
    effectiveness: "High",
  },
  {
    icon: BarChart3,
    title: "Confidence & Uncertainty Estimation",
    description:
      "Analyze token-level probabilities and entropy to identify low-confidence spans where hallucination is most likely to occur.",
    techniques: [
      "Token probability analysis",
      "Entropy thresholding",
      "Calibrated confidence scores",
    ],
    effectiveness: "Medium-High",
  },
  {
    icon: Database,
    title: "Knowledge Graph Grounding",
    description:
      "Extract structured claims from output and validate against knowledge graphs or structured databases for factual consistency.",
    techniques: [
      "Entity-relation extraction",
      "Triple verification",
      "Ontology alignment",
    ],
    effectiveness: "High",
  },
  {
    icon: Zap,
    title: "Adversarial Probing",
    description:
      "Use targeted prompts designed to elicit hallucinations, then analyze model behavior patterns to build robust detection classifiers.",
    techniques: [
      "Red-teaming prompts",
      "Boundary case testing",
      "Failure mode cataloging",
    ],
    effectiveness: "Medium",
  },
];

const StrategiesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Detection <span className="text-gradient-mixed">Strategies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Six research-backed approaches to identify when language models fabricate information,
            each targeting different aspects of the hallucination problem.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((s, i) => (
            <StrategyCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategiesSection;
