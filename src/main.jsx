import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { createDebugHelper } from '@/lib/debug'
import '@/index.css'

// Expose debug helper in development
if (import.meta.env.DEV) {
  window.DEBUG = createDebugHelper();
  console.log('Debug helper available as window.DEBUG');
  console.log('Try: DEBUG.viewStorage(), DEBUG.getUser(), DEBUG.getDashboards(), DEBUG.testStorage()');
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
