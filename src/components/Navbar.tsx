
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { 
  Home, 
  Calendar, 
  Search, 
  User, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from './theme-provider'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const Navbar = () => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/create', label: 'Create Play Date', icon: <Calendar className="h-5 w-5" /> },
    { path: '/browse', label: 'Browse', icon: <Search className="h-5 w-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              PlayPals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? "default" : "ghost"} 
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <Button 
                        variant={location.pathname === item.path ? "default" : "ghost"} 
                        className="w-full justify-start gap-2"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                  <Button variant="ghost" className="justify-start gap-2" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar