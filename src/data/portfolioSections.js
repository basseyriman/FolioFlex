export const portfolioSections = [
  {
    id: "header",
    type: "header",
    title: "Header",
    description: "Your professional introduction",
    required: true,
    imageConfig: {
      type: "profile",
      required: true,
      acceptedFormats: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
  },
  {
    id: "section-1",
    title: "About Me",
    type: "about",
    required: true,
    description:
      "Share your professional journey, passions, and what drives you",
    suggestions: [
      "Your professional background",
      "What motivates you",
      "Your unique value proposition",
      "Career highlights",
      "Professional philosophy",
    ],
  },
  {
    id: "section-2",
    title: "Experience",
    type: "experience",
    required: true,
    description: "Highlight your professional experience and achievements",
    suggestions: [
      "Key responsibilities and achievements",
      "Impact and results",
      "Leadership roles",
      "Notable projects",
      "Awards and recognition",
    ],
  },
  {
    id: "section-3",
    title: "Featured Projects",
    type: "projects",
    required: false,
    description: "Showcase your best work with visual examples",
    imageConfig: {
      type: "project",
      acceptedFormats: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    suggestions: [
      "Project overview",
      "Technologies used",
      "Your role",
      "Challenges overcome",
      "Results and impact",
      "Live demo links",
    ],
  },
  {
    id: "section-4",
    title: "Skills & Expertise",
    type: "skills",
    required: true,
    description: "Your technical and professional competencies",
    categories: [
      {
        name: "Technical Skills",
        description: "Programming languages, tools, frameworks",
      },
      {
        name: "Soft Skills",
        description: "Leadership, communication, teamwork",
      },
      {
        name: "Industry Knowledge",
        description: "Domain expertise, methodologies",
      },
      {
        name: "Certifications",
        description: "Professional certifications and training",
      },
    ],
  },
  {
    id: "section-5",
    title: "Testimonials",
    type: "testimonials",
    required: false,
    description: "What others say about your work",
    suggestions: [
      "Client feedback",
      "Colleague recommendations",
      "Manager endorsements",
    ],
  },
  {
    id: "section-6",
    title: "Publications & Speaking",
    type: "publications",
    required: false,
    description: "Your thought leadership and industry contributions",
    suggestions: [
      "Blog posts",
      "Articles",
      "Conference talks",
      "Podcasts",
      "Research papers",
    ],
  },
  {
    id: "section-7",
    title: "Contact & Connect",
    type: "contact",
    required: true,
    description: "Professional contact information and social presence",
    fields: [
      {
        name: "email",
        label: "Email Address",
        required: true,
      },
      {
        name: "linkedin",
        label: "LinkedIn Profile",
        required: false,
      },
      {
        name: "github",
        label: "GitHub Profile",
        required: false,
      },
      {
        name: "portfolio",
        label: "Personal Website",
        required: false,
      },
      {
        name: "twitter",
        label: "Twitter/X Profile",
        required: false,
      },
      {
        name: "availability",
        label: "Availability Status",
        required: false,
      },
    ],
  },
  {
    id: "work-samples",
    type: "gallery",
    title: "Portfolio Gallery",
    description: "Visual showcase of your work and achievements",
    required: false,
    imageConfig: {
      type: "gallery",
      acceptedFormats: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      suggestions: [
        "Project screenshots",
        "Design work",
        "Presentations",
        "Event photos",
        "Awards and certificates",
      ],
    },
  },
];

const ImportOptions = () => {
  const importFromLinkedIn = async () => {
    try {
      // LinkedIn OAuth implementation
      console.log("LinkedIn import initiated");
      // Add your LinkedIn API integration logic here
    } catch (error) {
      console.error("LinkedIn import failed:", error);
    }
  };

  const importFromResume = async () => {
    try {
      // Resume upload logic
      console.log("Resume upload initiated");
      // Add your resume parsing logic here
    } catch (error) {
      console.error("Resume upload failed:", error);
    }
  };

  const importFromGithub = async () => {
    try {
      // GitHub OAuth implementation
      console.log("GitHub connection initiated");
      // Add your GitHub API integration logic here
    } catch (error) {
      console.error("GitHub connection failed:", error);
    }
  };

  return (
    <div className="import-options">
      <button onClick={importFromLinkedIn}>Import from LinkedIn</button>
      <button onClick={importFromResume}>Upload Resume</button>
      <button onClick={importFromGithub}>Connect GitHub</button>
    </div>
  );
};

export { ImportOptions };
