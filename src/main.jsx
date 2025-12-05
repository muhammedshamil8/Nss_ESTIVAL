import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/index.css'
import App from '@/App.jsx'
import { AuthProvider } from '@/libs/useAuth'
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#005188',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </AuthProvider>
  </StrictMode>,
)
