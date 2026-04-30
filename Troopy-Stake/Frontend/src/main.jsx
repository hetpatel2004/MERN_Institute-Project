import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Mainroute from './Component/Router/Mainroute.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Mainroute/>
  </BrowserRouter>,
)
