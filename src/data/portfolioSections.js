export const portfolioSections = [
  {
    id: "header",
    type: "header",
    title: "Header",
    description: "Your name and professional title",
    required: true,
    content: JSON.stringify({
      name: "",
      title: "",
      profileImage: "",
    }),
  },
  {
    id: "banner",
    type: "banner",
    title: "Banner",
    description: "A banner image for your portfolio",
    required: false,
    content: "",
  },
  {
    id: "about",
    type: "about",
    title: "About Me",
    description: "Introduce yourself and your professional background",
    required: true,
    content: "",
  },
  {
    id: "experience",
    type: "experience",
    title: "Experience",
    description: "Your work history and professional experience",
    required: true,
    content: "",
  },
  {
    id: "skills",
    type: "skills",
    title: "Skills",
    description: "Your technical and professional skills",
    required: true,
    content: "",
  },
  {
    id: "education",
    type: "education",
    title: "Education",
    description: "Your educational background",
    required: true,
    content: "",
  },
  {
    id: "gallery",
    type: "gallery",
    title: "Project Gallery",
    description: "Showcase your projects and work samples",
    required: false,
    content: "[]",
  },
  {
    id: "contact",
    type: "contact",
    title: "Contact",
    description: "Your contact information and social links",
    required: true,
    content: "",
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
