import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

const data = [
  {
    strategy: "Self-Consistency",
    realTime: true,
    noExternalData: true,
    highAccuracy: true,
    lowCost: false,
    scalable: true,
  },
  {
    strategy: "RAG Verification",
    realTime: false,
    noExternalData: false,
    highAccuracy: true,
    lowCost: false,
    scalable: true,
  },
  {
    strategy: "Chain-of-Verification",
    realTime: true,
    noExternalData: true,
    highAccuracy: true,
    lowCost: true,
    scalable: true,
  },
  {
    strategy: "Confidence Estimation",
    realTime: true,
    noExternalData: true,
    highAccuracy: false,
    lowCost: true,
    scalable: true,
  },
  {
    strategy: "KG Grounding",
    realTime: false,
    noExternalData: false,
    highAccuracy: true,
    lowCost: false,
    scalable: false,
  },
  {
    strategy: "Adversarial Probing",
    realTime: false,
    noExternalData: true,
    highAccuracy: false,
    lowCost: true,
    scalable: true,
  },
];

const columns = ["Real-Time", "No External Data", "High Accuracy", "Low Cost", "Scalable"];

const Cell = ({ value }: { value: boolean }) =>
  value ? (
    <Check className="w-4 h-4 text-primary mx-auto" />
  ) : (
    <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />
  );

const ComparisonTable = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Strategy <span className="text-gradient-mixed">Comparison</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trade-offs between detection approaches across key dimensions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-2xl border border-border bg-card"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Strategy</th>
                {columns.map((c) => (
                  <th key={c} className="p-4 text-center font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={row.strategy}
                  className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                  }`}
                >
                  <td className="p-4 font-medium">{row.strategy}</td>
                  <td className="p-4"><Cell value={row.realTime} /></td>
                  <td className="p-4"><Cell value={row.noExternalData} /></td>
                  <td className="p-4"><Cell value={row.highAccuracy} /></td>
                  <td className="p-4"><Cell value={row.lowCost} /></td>
                  <td className="p-4"><Cell value={row.scalable} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
