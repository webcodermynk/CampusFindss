import React, { useState, useEffect } from 'react'
import Header from '../../components/Header.jsx'
import Footer from '../../components/Footer.jsx'
import Toast, { useToast } from '../../components/Toast.jsx'
import HomePage from './HomePage.jsx'
import LostItemsPage from './LostItemsPage.jsx'
import FoundItemsPage from './FoundItemsPage.jsx'
import ReportItemPage from './ReportItemPage.jsx'
import ContactPage from './ContactPage.jsx'

export default function AppUser({ currentUser, onLogout }) {
  const [page, setPage] = useState('home')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cf-theme') === 'dark')
  const { toasts, toast, removeToast } = useToast()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('cf-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const showPage = (id) => { setPage(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const renderPage = () => {
    switch (page) {
      case 'home':       return <HomePage showPage={showPage}/>
      case 'lostItems':  return <LostItemsPage showPage={showPage}/>
      case 'foundItems': return <FoundItemsPage showPage={showPage}/>
      case 'report':     return currentUser ? <ReportItemPage showPage={showPage} currentUser={currentUser} toast={toast}/> : <HomePage showPage={showPage}/>
      case 'contact':    return <ContactPage currentUser={currentUser} toast={toast}/>
      default:           return <HomePage showPage={showPage}/>
    }
  }

  return (
    <>
      <Header showPage={showPage} currentPage={page} userName={currentUser?.name||'Guest'} userEmail={currentUser?.email} onLogout={onLogout} darkMode={darkMode} toggleDarkMode={()=>setDarkMode(p=>!p)}/>
      <div style={{ minHeight: '70vh' }}>{renderPage()}</div>
      <Footer showPage={showPage}/>
      <Toast toasts={toasts} removeToast={removeToast}/>
    </>
  )
}
