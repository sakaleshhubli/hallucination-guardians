import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertTriangle, CheckCircle, HelpCircle, XCircle, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Claim {
  text: string;
  status: "verified" | "uncertain" | "likely_hallucinated" | "hallucinated";
  confidence: number;
  reason: string;
}

interface Analysis {
  overallScore: number;
  riskLevel: string;
  claims: Claim[];
  summary: string;
  strategies_used: string[];
}

const statusConfig = {
  verified: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Verified" },
  uncertain: { icon: HelpCircle, color: "text-warning", bg: "bg-warning/10", label: "Uncertain" },
  likely_hallucinated: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Likely Hallucinated" },
  hallucinated: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/20", label: "Hallucinated" },
};

const riskColors: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
  critical: "text-destructive",
};

const DetectionDemo = () => {
  const [prompt, setPrompt] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [step, setStep] = useState<"idle" | "generating" | "generated" | "analyzing" | "done">("idle");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep("generating");
    setLlmResponse("");
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-hallucination", {
        body: { prompt, mode: "generate" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLlmResponse(data.response);
      setStep("generated");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate response", variant: "destructive" });
      setStep("idle");
    }
  };

  const handleAnalyze = async () => {
    setStep("analyzing");

    try {
      const { data, error } = await supabase.functions.invoke("detect-hallucination", {
        body: { prompt, mode: "analyze", llmResponse },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      setStep("done");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to analyze", variant: "destructive" });
      setStep("generated");
    }
  };

  const handleReset = () => {
    setPrompt("");
    setLlmResponse("");
    setAnalysis(null);
    setStep("idle");
  };

  return (
    <section className="py-24 px-6" id="demo">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live <span className="text-gradient-primary">Detection Demo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter a prompt, generate an LLM response, then analyze it for hallucinations using AI-powered detection.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            Prompt
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a factual question... e.g. 'Who invented the telephone and when?'"
              className="w-full min-h-[100px] p-4 pr-14 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y font-sans"
              disabled={step !== "idle"}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || step !== "idle"}
              className="absolute right-3 bottom-3 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              {step === "generating" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* LLM Response */}
          {(step === "generating" || step === "generated" || step === "analyzing" || step === "done") && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                LLM Response
              </label>
              <div className="p-4 rounded-xl bg-card border border-border min-h-[80px]">
                {step === "generating" ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating response...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{llmResponse}</p>
                )}
              </div>

              {step === "generated" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Brain className="w-4 h-4" />
                    Analyze for Hallucinations
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-secondary transition-colors"
                  >
                    Reset
                  </button>
                </motion.div>
              )}

              {step === "analyzing" && (
                <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm">Running hallucination analysis...</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Analysis Results */}
          {step === "done" && analysis && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Header */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-1">
                      Hallucination Risk
                    </div>
                    <div className={`text-2xl font-bold ${riskColors[analysis.riskLevel] || "text-foreground"}`}>
                      {analysis.riskLevel.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className="text-3xl font-bold font-mono">{analysis.overallScore}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">/100</div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.overallScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      analysis.overallScore < 30 ? "bg-success" : analysis.overallScore < 60 ? "bg-warning" : "bg-destructive"
                    }`}
                  />
                </div>

                <p className="text-sm text-muted-foreground">{analysis.summary}</p>

                {/* Strategies used */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.strategies_used.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-xs font-mono rounded bg-secondary text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Claims */}
              {analysis.claims.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
                    Claim Analysis ({analysis.claims.length} claims)
                  </h3>
                  <div className="space-y-3">
                    {analysis.claims.map((claim, i) => {
                      const config = statusConfig[claim.status] || statusConfig.uncertain;
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 rounded-xl bg-card border border-border"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1 rounded ${config.bg}`}>
                              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-mono font-semibold ${config.color}`}>
                                  {config.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {claim.confidence}% confidence
                                </span>
                              </div>
                              <p className="text-sm mb-1">"{claim.text}"</p>
                              <p className="text-xs text-muted-foreground">{claim.reason}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                Try Another Prompt
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DetectionDemo;
