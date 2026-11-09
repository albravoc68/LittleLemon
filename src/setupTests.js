import "@testing-library/jest-dom";

// jsdom does not implement scrolling, so stub it for components that scroll after navigation.
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();
