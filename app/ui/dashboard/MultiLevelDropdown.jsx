import React, { useState } from "react";

const MultilevelDropdown = ({ selectedSport, setSelectedSport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuData = {
    "Individual Sports": ["Tennis", "Ping Pong", "Squash"],
    "Team Sports": ["Football", "Basketball", "Volleyball"],
    "Group Sports": ["Hiking", "Ice Skating", "Yoga"],
  };

  const handleMainClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsOpen(!isOpen);
    if (!isOpen) {
      setOpenSubmenu(null);
    }
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();

    if (openSubmenu === category) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(category);
    }
  };

  const handleSportSelect = (e, category, sport) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedSport({
        category : category,
        name : sport
    });
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <div className="relative w-64 text-sm">
      <button
        type="button"
        onClick={(e) => handleMainClick(e)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
      >
        <span>{selectedSport.name ? selectedSport.name : "Select a sport"}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {Object.keys(menuData).map((category) => (
              <li key={category} className="relative">
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e,category)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>{category}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openSubmenu === category ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {openSubmenu === category && (
                  <ul className="bg-gray-50 py-1">
                    {menuData[category].map((sport) => (
                      <li key={sport}>
                        <button
                          type="button"
                          onClick={(e) => handleSportSelect(e,category,sport)}
                          className="w-full text-left pl-8 pr-4 py-1 hover:bg-gray-100"
                        >
                          {sport}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultilevelDropdown;
