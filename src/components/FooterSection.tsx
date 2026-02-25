const FooterSection = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-mono text-sm text-muted-foreground">
            Hallucination Detection Strategies
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          A research-backed overview of AI reliability techniques · 2026
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
