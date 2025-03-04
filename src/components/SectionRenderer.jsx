export const renderSectionContent = (sectionKey, sectionData, setPortfolioData) => {
  switch (sectionKey) {
    case 'introduction':
      return (
        <div className="introduction-section">
          {sectionData.photo && (
            <img 
              src={sectionData.photo} 
              alt="Profile" 
              className="profile-photo"
            />
          )}
          <input
            type="text"
            value={sectionData.name}
            onChange={(e) => setPortfolioData(prev => ({
              ...prev,
              introduction: { ...prev.introduction, name: e.target.value }
            }))}
            placeholder="Your Name"
          />
          <input
            type="text"
            value={sectionData.professionalTitle}
            onChange={(e) => setPortfolioData(prev => ({
              ...prev,
              introduction: { ...prev.introduction, professionalTitle: e.target.value }
            }))}
            placeholder="Professional Title"
          />
        </div>
      );
    
    case 'experience':
      return (
        <div className="experience-section">
          {sectionData.map((exp, index) => (
            <div key={index} className="experience-item">
              <input
                type="text"
                value={exp.title}
                onChange={(e) => {
                  const newExp = [...sectionData];
                  newExp[index].title = e.target.value;
                  setPortfolioData(prev => ({
                    ...prev,
                    experience: newExp
                  }));
                }}
                placeholder="Job Title"
              />
              {/* Add more fields for company, date, description */}
            </div>
          ))}
        </div>
      );
    
    // Add cases for other sections
    
    default:
      return <div>Content for {sectionKey}</div>;
  }
}; 