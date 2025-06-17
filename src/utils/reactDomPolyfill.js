import { createRoot } from "react-dom/client";

// Create a ReactDOM polyfill with findDOMNode for React 19 compatibility
// This is needed because react-quill still depends on findDOMNode
const ReactDOMPolyfill = {
  findDOMNode: (component) => {
    try {
      // For HTML elements, return the element directly
      if (component instanceof HTMLElement) {
        return component;
      }

      // For React components with refs, try to access the DOM node
      if (component && component._reactInternals) {
        const domNode = component._reactInternals.stateNode;
        return domNode instanceof HTMLElement ? domNode : null;
      }

      // Return null for undefined or null values
      return null;
    } catch (e) {
      console.error("Error in findDOMNode polyfill:", e);
      return null;
    }
  },
  // Add other methods that might be used by react-quill
  render: () => {
    console.warn(
      "ReactDOM.render is deprecated in React 18+. Use createRoot instead."
    );
  },
  createRoot,
};

// Add to window for global access if needed
if (typeof window !== "undefined" && !window.ReactDOM) {
  window.ReactDOM = ReactDOMPolyfill;
}

export default ReactDOMPolyfill;
