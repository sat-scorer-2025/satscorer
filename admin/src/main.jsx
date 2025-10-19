import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { TestProvider } from './context/TestContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx'
import { CourseProvider } from './context/CourseContext.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <CourseProvider>
          <TestProvider>  
            <App />
          </TestProvider>
        </CourseProvider>
      </NotificationProvider>
    </AuthProvider>  
  </BrowserRouter>
)
