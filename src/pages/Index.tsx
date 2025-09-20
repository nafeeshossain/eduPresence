import AttendanceDashboard from "@/components/AttendanceDashboard";
import SDGSection from "@/components/SDGSection";
import TeamSection from "@/components/TeamSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AttendanceDashboard />
      <SDGSection />
      <TeamSection />
    </div>
  );
};

export default Index;
