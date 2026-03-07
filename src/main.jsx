import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import NearbyFinder from './components/NearbyFinder'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <div style={{marginTop: '2rem'}}>
      <NearbyFinder />
    </div>
  </React.StrictMode>,
)
