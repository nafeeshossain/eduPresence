import { Card, CardContent } from "@/components/ui/card";

const SDGSection = () => {
  const sdgs = [
    {
      number: 4,
      title: "Quality Education",
      description: "Ensures inclusive and equitable quality education for all learners",
      icon: "🎓",
      color: "bg-red-500",
      impact: "Enables educators to proactively support struggling students through predictive analytics and early intervention strategies."
    },
    {
      number: 10,
      title: "Reduced Inequalities", 
      description: "Reduces inequality within and among countries",
      icon: "⚖️",
      color: "bg-pink-500", 
      impact: "Ensures equitable support for all learners by identifying at-risk students regardless of background or circumstances."
    },
    {
      number: 17,
      title: "Partnerships for the Goals",
      description: "Strengthen partnerships for sustainable development",
      icon: "🤝",
      color: "bg-blue-600",
      impact: "Facilitates collaboration between educators, counselors, and support services to create comprehensive student success networks."
    }
  ];

  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Aligned with UN Sustainable Development Goals
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our Attendance & Engagement Predictor directly contributes to global sustainability objectives by promoting quality education and reducing inequalities in learning outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sdgs.map((sdg) => (
            <Card key={sdg.number} className="card-hover group">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className={`w-20 h-20 ${sdg.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{sdg.icon}</span>
                  </div>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium inline-block">
                    SDG {sdg.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {sdg.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {sdg.description}
                </p>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Our Impact:</h4>
                  <p className="text-xs text-muted-foreground">
                    {sdg.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-card rounded-lg px-6 py-3 shadow-sm">
            <span className="text-2xl">🌍</span>
            <span className="font-medium text-foreground">
              Contributing to a more equitable and sustainable future through education technology
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SDGSection;