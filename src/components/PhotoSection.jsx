import React, { useState } from 'react';

const PhotoSection = ({ portfolioData, setPortfolioData }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const handlePhotoUpload = (event, photoType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [photoType]: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="photo-section">
      <div className="photo-tabs">
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Photo
        </button>
        <button 
          className={`tab ${activeTab === 'banner' ? 'active' : ''}`}
          onClick={() => setActiveTab('banner')}
        >
          Banner Image
        </button>
        <button 
          className={`tab ${activeTab === 'work' ? 'active' : ''}`}
          onClick={() => setActiveTab('work')}
        >
          Work Samples
        </button>
      </div>

      <div className="photo-guidelines">
        {activeTab === 'profile' && (
          <div className="guideline-text">
            <p>Recommended: Professional headshot</p>
            <ul>
              <li>Square format (1:1 ratio)</li>
              <li>Minimum 400x400px</li>
              <li>Professional attire</li>
              <li>Neutral background</li>
            </ul>
          </div>
        )}
        {/* Similar guidelines for other photo types */}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handlePhotoUpload(e, activeTab)}
        className="photo-input"
      />
    </div>
  );
};

export default PhotoSection; 