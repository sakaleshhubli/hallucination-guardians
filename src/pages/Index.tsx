import HeroSection from "@/components/HeroSection";
import StrategiesSection from "@/components/StrategiesSection";
import PipelineSection from "@/components/PipelineSection";
import ComparisonTable from "@/components/ComparisonTable";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StrategiesSection />
      <PipelineSection />
      <ComparisonTable />
      <FooterSection />
    </div>
  );
};

export default Index;
