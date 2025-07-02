import React, { useEffect, useState } from 'react';
import apiService from '../../services/api-service';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react'; // Add this for a close/delete icon

const RecentlyViewedProperties = () => {
  const [properties, setProperties] = useState([]);

  const removeProperty = (id) => {
    // Remove from localStorage
    const ids = JSON.parse(localStorage.getItem('recentlyViewedProperties')) || [];
    const newIds = ids.filter(pid => pid !== id);
    localStorage.setItem('recentlyViewedProperties', JSON.stringify(newIds));
    // Remove from state
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const ids = JSON.parse(localStorage.getItem('recentlyViewedProperties')) || [];
      if (ids.length === 0) {
        setProperties([]);
        return;
      }
      // Fetch property details for each ID
      const promises = ids.map(id => apiService.get(`/properties/${id}`).then(res => res.data).catch(() => null));
      const results = await Promise.all(promises);
      setProperties(results.filter(Boolean));
    };
    fetchRecentlyViewed();
  }, []);

  if (properties.length === 0) return null;

  return (
    <div className="recently-viewed-section">
      <h3>Recently Viewed Properties</h3>
      <div className="recently-viewed-list">
        {properties.map(property => (
          <div
            key={property.id}
            className="property-card"
            style={{ width: 220, cursor: "pointer", position: "relative" }}
          >
            {/* Delete Button */}
            <button
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 2,
                padding: 2
              }}
              title="Remove"
              onClick={e => {
                e.stopPropagation();
                removeProperty(property.id);
              }}
            >
              <X size={16} />
            </button>
            <img src={(property.images && property.images[0]) || '/fallback-property.jpg'} alt={property.title} style={{margin: 0}}/>
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="location">{property.location}</p>
              <p className="price">{property.price} LKR</p>
              {/* Add more info if needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProperties;