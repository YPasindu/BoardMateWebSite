import React, { useEffect, useState } from 'react';
import apiService from '../../services/api-service';
import { Link } from 'react-router-dom';

const RecentlyViewedProperties = () => {
  const [properties, setProperties] = useState([]);

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
            style={{ width: 220, cursor: "pointer" }}
            onClick={() => window.location.href = `/property/${property.id}`}
          >
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