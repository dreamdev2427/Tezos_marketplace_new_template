import React from "react";

const Spinner = ({ isLoading }) => {
  return isLoading ? (
    <div className="custom-spinner">
      <div className="spinner"></div>
    </div>
  ) : null;
};

export default Spinner;
