
import { useState } from 'react'
import { usePlayDate } from '../context/PlayDateContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const BrowsePlayDates = () => {
  const { playDates } = usePlayDate()
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<number | ''>('')
  const [dateFilter, setDateFilter] = useState('upcoming')

  // Filter play dates based on search term, age, and date
  const filteredPlayDates = playDates.filter(playDate => {
    // Search filter
    const matchesSearch = 
      playDate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playDate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playDate.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Age filter
    const matchesAge = ageFilter === '' || 
      (ageFilter >= playDate.ageRange.min && ageFilter <= playDate.ageRange.max)
    
    // Date filter
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const playDateDate = new Date(playDate.date)
    playDateDate.setHours(0, 0, 0, 0)
    
    let matchesDate = true
    if (dateFilter === 'upcoming') {
      matchesDate = playDateDate >= today
    } else if (dateFilter === 'today') {
      matchesDate = playDateDate.getTime() === today.getTime()
    } else if (dateFilter === 'thisWeek') {
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      matchesDate = playDateDate >= today && playDateDate <= nextWeek
    }
    
    return matchesSearch && matchesAge && matchesDate
  })

  // Sort play dates by date
  const sortedPlayDates = [...filteredPlayDates].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Browse Play Dates</h1>
        <Link to="/create">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            Create Play Date
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by title, description, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="w-1/2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">All Upcoming</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-1/2">
                <Input
                  type="number"
                  placeholder="Age"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value ? parseInt(e.target.value) : '')}
                  min="0"
                  max="18"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          {sortedPlayDates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlayDates.map(playDate => (
                <Card key={playDate.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="h-3 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <CardHeader>
                    <CardTitle className="text-xl">{playDate.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{playDate.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>{format(new Date(playDate.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>{playDate.startTime} - {playDate.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="line-clamp-1">{playDate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>{playDate.attendees.reduce((acc, curr) => acc + curr.childrenIds.length, 0)} / {playDate.maxAttendees} children</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/playdate/${playDate.id}`} className="w-full">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 dark:bg-gray-800 border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No play dates found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setAgeFilter('')
                  setDateFilter('upcoming')
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          {sortedPlayDates.length > 0 ? (
            <div className="space-y-4">
              {sortedPlayDates.map(playDate => (
                <Card key={playDate.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {format(new Date(playDate.date), 'MMM d')}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {format(new Date(playDate.date), 'EEEE')}
                      </p>
                      <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                        {playDate.startTime} - {playDate.endTime}
                      </p>
                    </div>
                    <div className="md:w-3/4 p-4">
                      <h3 className="text-xl font-bold mb-2">{playDate.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{playDate.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span>{playDate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span>{playDate.attendees.reduce((acc, curr) => acc + curr.childrenIds.length, 0)} / {playDate.maxAttendees}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Filter className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span>Ages {playDate.ageRange.min}-{playDate.ageRange.max}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link to={`/playdate/${playDate.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 dark:bg-gray-800 border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No play dates found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setAgeFilter('')
                  setDateFilter('upcoming')
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BrowsePlayDates