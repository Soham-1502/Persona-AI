import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TopicSelection({ topics }) {
  const navigate = useNavigate();
  // If context is in URL already
  const { subject, category } = useParams();

  const handleTopicClick = (topicKey) => {
    navigate(
      `/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(
        category
      )}/${encodeURIComponent(topicKey)}`
    );
  };

  return (
    <div>
      <h2>Select a topic in {category}</h2>
      <div>
        {Object.keys(topics).map((topicKey) => (
          <button key={topicKey} onClick={() => handleTopicClick(topicKey)}>
            {topics[topicKey].name}
          </button>
        ))}
      </div>
    </div>
  );
}
