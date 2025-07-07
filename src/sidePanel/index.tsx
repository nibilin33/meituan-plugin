import { createRoot } from 'react-dom/client';
import React from 'react'
function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render( <React.StrictMode>
    <div>
      <h1>Side Panel</h1>
      <p>This is the side panel content.</p>
    </div>
 </React.StrictMode>);
}

init();
