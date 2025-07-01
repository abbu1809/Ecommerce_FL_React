import React from "react";

const SimpleApp = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test App - Working!</h1>
      <p>This is a simple test to confirm React is working.</p>
      <div style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "20px", 
        borderRadius: "8px",
        marginTop: "20px" 
      }}>
        <h2>Debug Info:</h2>
        <p>• React is rendering properly</p>
        <p>• Main.jsx is importing correctly</p>
        <p>• CSS should be loading</p>
      </div>
    </div>
  );
};

export default SimpleApp;
