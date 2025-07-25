import React from 'react';

const PlaceholderImage = ({ 
  width = 300, 
  height = 300, 
  text = "No Image", 
  className = "",
  style = {} 
}) => {
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
            fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  const dataUri = `data:image/svg+xml;base64,${btoa(svgContent)}`;

  return (
    <img 
      src={dataUri} 
      alt={text}
      className={className}
      style={style}
      width={width}
      height={height}
    />
  );
};

export default PlaceholderImage;
