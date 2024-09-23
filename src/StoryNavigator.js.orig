import React, { useState } from 'react';
import { storyData } from './storyData';

const StoryNavigator = () => {
  const [currentParagraph, setCurrentParagraph] = useState(storyData[0]);

  const handleChoice = (nextId) => {
    const nextParagraph = storyData.find(paragraph => paragraph.id === nextId);
    setCurrentParagraph(nextParagraph);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow">
      <p className="text-lg mb-4">{currentParagraph.text}</p>
      {currentParagraph.options.length > 0 ? (
        <div className="space-y-2">
          {currentParagraph.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleChoice(option.nextId)}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic">Fine della storia</p>
      )}
    </div>
  );
};

export default StoryNavigator;
