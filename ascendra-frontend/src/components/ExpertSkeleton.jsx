import React from "react";

const ExpertSkeleton = () => {
  return (
    <div className="expert-card expert-skeleton">

      <div className="skeleton-top">

        <div className="skeleton-avatar" />

        <div className="skeleton-lines">
          <div />
          <div />
          <div />
        </div>

      </div>

      <div className="skeleton-content">
        <div />
        <div />
        <div />
      </div>

      <div className="skeleton-buttons">
        <div />
        <div />
      </div>

    </div>
  );
};

export default ExpertSkeleton;