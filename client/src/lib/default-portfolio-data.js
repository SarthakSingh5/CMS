export const DEFAULT_PORTFOLIO_DATA = {
  name: "Alex Vance",
  title: "Full Stack Engineer & Creative Developer",
  bio: "Architecting scalable web applications, real-time distributed systems, and refined digital experiences.",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  location: "San Francisco, CA",
  resumeUrl: "",
  socials: [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://x.com" },
    { platform: "website", url: "https://example.com" },
  ],
  skills: [
    { name: "TypeScript / React", percentage: 92 },
    { name: "Node.js / Express", percentage: 88 },
    { name: "MongoDB & PostgreSQL", percentage: 82 },
    { name: "Cloud & Microservices", percentage: 78 },
  ],
  projects: [
    {
      title: "HyperScale API Gateway",
      description: "Distributed reverse proxy and edge routing engine handling 10k+ concurrent requests with sub-5ms latency.",
      tags: ["Node.js", "Redis", "TypeScript"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
    },
    {
      title: "Neural Canvas IDE",
      description: "Collaborative browser-based developer workspace featuring real-time code sandboxing and hot-reloading.",
      tags: ["React", "WebSockets", "Docker"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
    },
  ],
  certifications: [
    { title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024" },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "B.S. in Computer Science",
      field: "Software Engineering",
      startDate: "2019",
      endDate: "2023",
    },
  ],
  experience: [
    {
      company: "Apex Tech Labs",
      role: "Senior Software Engineer",
      startDate: "2023",
      endDate: "Present",
      description: "Leading frontend architecture and microservices modernization for enterprise developer tools.",
      current: true,
    },
  ],
};

