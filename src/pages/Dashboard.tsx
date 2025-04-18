
import { usePlayDate } from '../context/PlayDateContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const Dashboard = () => {
  const { playDates, currentUser } = usePlayDate()

  // Sort play dates by date
  const sortedPlayDates = [...playDates].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Get upcoming play dates
  const upcomingPlayDates = sortedPlayDates.filter(
    playDate => new Date(playDate.date) >= new Date()
  ).slice(0, 3)

  // Get play dates the user is attending
  const userPlayDates = currentUser 
    ? sortedPlayDates.filter(playDate => 
        playDate.attendees.some(attendee => attendee.parentId === currentUser.id)
      )
    : []

  // Get play dates hosted by the user
  const hostedPlayDates = currentUser
    ? sortedPlayDates.filter(playDate => playDate.hostId === currentUser.id)
    : []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Welcome, {currentUser?.name.split(' ')[0] || 'Friend'}!</h1>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              Create Play Date
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Upcoming Play Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcomingPlayDates.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Your RSVPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{userPlayDates.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                Hosting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{hostedPlayDates.length}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-400">Upcoming Play Dates</h2>
        {upcomingPlayDates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingPlayDates.map(playDate => (
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
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No upcoming play dates found</p>
              <Link to="/browse">
                <Button variant="outline">Browse Play Dates</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {userPlayDates.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-400">Your RSVPs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPlayDates.map(playDate => (
              <Link key={playDate.id} to={`/playdate/${playDate.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{playDate.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(playDate.date), 'EEEE, MMMM d')} • {playDate.startTime} - {playDate.endTime}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard