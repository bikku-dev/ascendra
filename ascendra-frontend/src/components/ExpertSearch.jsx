import React from "react";

const ExpertSearch = ({
  value,
  onChange,
}) => {

  const handleChange = (event) => {

    onChange(event.target.value);

  };


  const handleClear = () => {

    onChange("");

  };


  return (

    <div className="expert-search">


      <div className="expert-search-icon">

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >

          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path
            d="m20 20-4-4"
          />

        </svg>

      </div>


      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search experts by name, role or skill..."
        aria-label="Search experts"
      />


      {value && (

        <button
          type="button"
          className="expert-search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >

            <path d="M18 6 6 18" />

            <path d="m6 6 12 12" />

          </svg>

        </button>

      )}

    </div>

  );

};


export default ExpertSearch;