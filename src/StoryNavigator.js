import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ForceGraph2D from 'react-force-graph-2d';
import { storyData, graphData } from './storyData';

const StoryNavigator = () => {
  const [currentNode, setCurrentNode] = useState(storyData[0]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleChoice = (nextId) => {
    const nextNode = storyData.find(node => node.id === nextId);
    setCurrentNode(nextNode);
  };

  const renderMobileView = () => (
    <div className="p-4">
      <img src={currentNode.image} alt={currentNode.text} className="w-full h-48 object-cover mb-4 rounded" />
      <p className="text-lg mb-4">{currentNode.text}</p>
      {currentNode.options.length > 0 ? (
        <div className="space-y-2">
          {currentNode.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleChoice(option.nextId)}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <img src={option.image} alt={option.text} className="w-10 h-10 object-cover mr-2 rounded" />
              <span>{option.text}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic">Fine della storia</p>
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="h-screen">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.id === currentNode.id ? 'red' : 'black';
          ctx.fillText(label, node.x, node.y);

          // Draw node image
          const img = new Image();
          img.src = node.image;
          const size = 12;
          ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
        }}
        onNodeClick={(node) => {
          const clickedNode = storyData.find(n => n.id === node.id);
          setCurrentNode(clickedNode);
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
        <p className="text-lg mb-4">{currentNode.text}</p>
        {currentNode.options.length > 0 && (
          <div className="flex space-x-2">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option.nextId)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default StoryNavigator;
