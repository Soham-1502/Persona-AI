import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CategorySelection({ structure }) {
  const navigate = useNavigate();
  const { subject } = useParams();
  const categories = structure[subject]?.categories || {};

  const handleCategoryClick = (categoryKey) => {
    const hasTopics =
      Object.keys(categories[categoryKey]?.topics || {}).length > 0;

    if (hasTopics) {
      // Go to topic-selection route
      navigate(
        `/QuizDomainSelection/${encodeURIComponent(
          subject
        )}/${encodeURIComponent(categoryKey)}`
      );
    } else {
      // No topics → go straight to quiz for subject/category
      navigate(
        `/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(
          categoryKey
        )}`
      );
    }
  };

  return (
    <div>
      <h2>Select a category in {subject}</h2>
      <div>
        {Object.keys(categories).map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(cat)}>
            {categories[cat].name}
          </button>
        ))}
      </div>
    </div>
  );
}
