
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CreatePlayDate from './pages/CreatePlayDate'
import BrowsePlayDates from './pages/BrowsePlayDates'
import Profile from './pages/Profile'
import PlayDateDetails from './pages/PlayDateDetails'
import { PlayDateProvider } from './context/PlayDateContext'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="playdate-theme">
      <PlayDateProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreatePlayDate />} />
                <Route path="/browse" element={<BrowsePlayDates />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/playdate/:id" element={<PlayDateDetails />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </PlayDateProvider>
    </ThemeProvider>
  )
}

export default App