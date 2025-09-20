import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Nafees Hossain",
      role: "Team Lead & Developer",
      bio: "Leading the development of innovative educational technology solutions.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQGQKaB7ITZKKw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724040961971?e=1761177600&v=beta&t=QtqqULiPclqEtPxoC3sR5f9k3egxWID-c5a5zLgS3uc",
      skills: ["React", "TypeScript", "Educational Technology"],
      social: {
        github: "#",
        linkedin: "#", 
        email: "nafees@example.com"
      }
    },
    {
      id: 2,
      name: "Dhritiman Bera",
      role: "QA & Full Stack",
      bio: "Ensuring quality and reliability across the entire application stack.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQHth2rx_E-uaQ/profile-displayphoto-shrink_400_400/B56ZUsIMOhGoAg-/0/1740202100959?e=1761177600&v=beta&t=u0Oa0o3VXQga9gFNeLqP7HKeNa97dvapg93fXCScxpM",
      skills: ["Testing", "Full Stack", "Quality Assurance"],
      social: {
        github: "#",
        linkedin: "#",
        email: "dhritiman@example.com"
      }
    },
    {
      id: 3,
      name: "Souvik Chel",
      role: "Backend & Deployment",
      bio: "Specializing in robust backend systems and seamless deployment processes.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQGy9bnpCqCl4A/profile-displayphoto-scale_400_400/B56ZhLdcarH0Ag-/0/1753612667799?e=1761177600&v=beta&t=jDW1JDgDV-BeScKbzHTjwEUW6Pts0bOGvoA4hyDTaes",
      skills: ["Backend", "DevOps", "Cloud Infrastructure"],
      social: {
        github: "#",
        linkedin: "#",
        email: "souvik@example.com"
      }
    },
    {
      id: 4,
      name: "Md Sahil Ansari",
      role: "QA & Backend",
      bio: "Focused on quality assurance and backend development for educational systems.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQHdbg7bjnqPTw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708856440987?e=1761177600&v=beta&t=z7YVvpEPxkPkakqJlchtOOgDkCSs8PwlB9bM28sl3ew",
      skills: ["Testing", "Backend", "Database Design"],
      social: {
        github: "#",
        linkedin: "#",
        email: "sahil@example.com"
      }
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A diverse group of educators, technologists, and researchers committed to improving student outcomes through innovative predictive analytics.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="card-hover group flex-1 min-w-[250px] max-w-[300px]">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300 border-4 border-primary/20"
                  />
                  <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                
                <Badge variant="secondary" className="mb-3">
                  {member.role}
                </Badge>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {member.bio}
                </p>
                
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.social.github}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={`${member.name} GitHub profile`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={`${member.name} LinkedIn profile`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-card rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Join Our Mission
            </h3>
            <p className="text-muted-foreground text-sm">
              Interested in contributing to educational technology that makes a difference? 
              We're always looking for passionate individuals to join our team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;