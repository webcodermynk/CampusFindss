import React, { useState, useEffect } from 'react'
import AdminHeader from '../../components/admin/Header.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import LostItemsManagement from './LostItemsManagement.jsx'
import FoundItemsManagement from './FoundItemsManagement.jsx'
import ClaimsVerification from './ClaimsVerification.jsx'
import UsersManagement from './UsersManagement.jsx'
import FeedbackComplaints from './FeedbackComplaints.jsx'
import Settings from './Settings.jsx'
import Analytics from './Analytics.jsx'
import QRLabels from './QRLabels.jsx'
import Toast, { useToast } from '../../components/Toast.jsx'
import '../../styles/styles.css'

export default function AdminApp({ onLogout }) {
  const [page, setPage] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cf-theme') === 'dark')
  const { toasts, toast, removeToast } = useToast()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('cf-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const renderPage = () => {
    const p = { toast }
    switch (page) {
      case 'dashboard':  return <AdminDashboard showPage={setPage} toast={toast}/>
      case 'lostItems':  return <LostItemsManagement {...p}/>
      case 'foundItems': return <FoundItemsManagement {...p}/>
      case 'claims':     return <ClaimsVerification {...p}/>
      case 'users':      return <UsersManagement {...p}/>
      case 'feedback':   return <FeedbackComplaints {...p}/>
      case 'analytics':  return <Analytics {...p}/>
      case 'qrLabels':   return <QRLabels {...p}/>
      case 'settings':   return <Settings {...p}/>
      default:           return <AdminDashboard showPage={setPage} toast={toast}/>
    }
  }

  return (
    <div style={{ background: 'var(--bg-color,#f8f9fa)', minHeight: '100vh' }}>
      <AdminHeader showPage={setPage} currentPage={page} adminName="System Admin" adminEmail="admin@campusfinds.com" onLogout={onLogout} darkMode={darkMode} toggleDarkMode={() => setDarkMode(p => !p)}/>
      {renderPage()}
      <Toast toasts={toasts} removeToast={removeToast}/>
    </div>
  )
}
