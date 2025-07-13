import React from 'react';

const SimpleThemeProvider = ({ children }) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {children}
    </div>
  );
};

export default SimpleThemeProvider;
