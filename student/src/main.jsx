import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx'
import { TestProvider } from './context/TestContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <StudentProvider>
          <TestProvider>
            <App />
         </TestProvider>
      </StudentProvider>
    </AuthProvider>  
  </BrowserRouter>
)