import React from "react";

const ExpertFilters = ({
  filters,
  setFilters,
  onClear,
}) => {

  // =========================================================
  // HANDLE FILTER CHANGE
  // =========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================================
  // CHECK WHETHER ANY FILTER IS ACTIVE
  // =========================================================

  const hasActiveFilters =
    Boolean(
      filters?.skill ||
      filters?.experience ||
      filters?.rating ||
      filters?.sort !== "recommended"
    );


  return (

    <div className="expert-filters">


      {/* =====================================================
          SKILL
      ===================================================== */}

      <div className="expert-filter-group">

        <label htmlFor="expert-skill-filter">

          Skill

        </label>


        <select
          id="expert-skill-filter"
          name="skill"
          value={filters?.skill || ""}
          onChange={handleChange}
        >

          <option value="">

            All skills

          </option>

          <option value="Java">

            Java

          </option>

          <option value="Spring Boot">

            Spring Boot

          </option>

          <option value="Python">

            Python

          </option>

          <option value="JavaScript">

            JavaScript

          </option>

          <option value="React">

            React

          </option>

          <option value="Node.js">

            Node.js

          </option>

          <option value="PHP">

            PHP

          </option>

          <option value="SQL">

            SQL

          </option>

          <option value="DevOps">

            DevOps

          </option>

          <option value="AWS">

            AWS

          </option>

        </select>

      </div>



      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <div className="expert-filter-group">

        <label htmlFor="expert-experience-filter">

          Experience

        </label>


        <select
          id="expert-experience-filter"
          name="experience"
          value={filters?.experience || ""}
          onChange={handleChange}
        >

          <option value="">

            Any experience

          </option>

          <option value="1">

            1+ years

          </option>

          <option value="3">

            3+ years

          </option>

          <option value="5">

            5+ years

          </option>

          <option value="8">

            8+ years

          </option>

          <option value="10">

            10+ years

          </option>

        </select>

      </div>



      {/* =====================================================
          RATING
      ===================================================== */}

      <div className="expert-filter-group">

        <label htmlFor="expert-rating-filter">

          Rating

        </label>


        <select
          id="expert-rating-filter"
          name="rating"
          value={filters?.rating || ""}
          onChange={handleChange}
        >

          <option value="">

            Any rating

          </option>

          <option value="4">

            ★ 4.0+

          </option>

          <option value="4.5">

            ★ 4.5+

          </option>

          <option value="4.8">

            ★ 4.8+

          </option>

        </select>

      </div>



      {/* =====================================================
          SORT
      ===================================================== */}

      <div className="expert-filter-group">

        <label htmlFor="expert-sort-filter">

          Sort by

        </label>


        <select
          id="expert-sort-filter"
          name="sort"
          value={
            filters?.sort ||
            "recommended"
          }
          onChange={handleChange}
        >

          <option value="recommended">

            Recommended

          </option>

          <option value="rating">

            Highest rated

          </option>

          <option value="experience">

            Most experienced

          </option>

        </select>

      </div>



      {/* =====================================================
          CLEAR FILTERS
      ===================================================== */}

      {hasActiveFilters && (

        <button
          type="button"
          className="expert-clear-filters"
          onClick={onClear}
        >

          Clear filters

        </button>

      )}

    </div>

  );

};


export default ExpertFilters;