import React from 'react';
import StoryNavigator from './StoryNavigator';

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">La Mia Storia Interattiva</h1>
      </header>
      <main>
        <StoryNavigator />
      </main>
    </div>
  );
}

export default App;
