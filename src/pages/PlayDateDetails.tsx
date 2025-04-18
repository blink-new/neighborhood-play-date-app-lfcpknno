
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePlayDate } from '../context/PlayDateContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Calendar, Clock, MapPin, Users, User, Info, Trash2, Edit, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'

const PlayDateDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    playDates, 
    currentUser, 
    rsvpToPlayDate, 
    cancelRsvp, 
    deletePlayDate 
  } = usePlayDate()
  
  const [selectedChildren, setSelectedChildren] = useState<string[]>([])
  const [showRsvpDialog, setShowRsvpDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Find the play date
  const playDate = playDates.find(pd => pd.id === id)
  
  if (!playDate) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Play Date Not Found</h2>
        <p className="text-gray-500 mb-6">The play date you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse">
          <Button>Browse Play Dates</Button>
        </Link>
      </div>
    )
  }

  // Check if current user is the host
  const isHost = currentUser?.id === playDate.hostId
  
  // Check if current user has already RSVP'd
  const userRsvp = playDate.attendees.find(a => a.parentId === currentUser?.id)
  const hasRsvp = !!userRsvp
  
  // Get the total number of children attending
  const totalChildren = playDate.attendees.reduce((acc, curr) => acc + curr.childrenIds.length, 0)
  
  // Check if the play date is full
  const isFull = totalChildren >= playDate.maxAttendees
  
  // Check if the play date is in the past
  const isPast = new Date(playDate.date) < new Date()

  // Handle RSVP
  const handleRsvp = () => {
    if (!currentUser) {
      toast.error('You must be logged in to RSVP')
      return
    }
    
    if (selectedChildren.length === 0) {
      toast.error('Please select at least one child')
      return
    }
    
    rsvpToPlayDate(playDate.id, selectedChildren)
    setShowRsvpDialog(false)
    toast.success('RSVP successful!')
  }
  
  // Handle cancel RSVP
  const handleCancelRsvp = () => {
    cancelRsvp(playDate.id)
    setShowCancelDialog(false)
    toast.success('RSVP cancelled')
  }
  
  // Handle delete play date
  const handleDelete = () => {
    deletePlayDate(playDate.id)
    setShowDeleteDialog(false)
    toast.success('Play date deleted')
    navigate('/')
  }
  
  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: playDate.title,
          text: `Join us for ${playDate.title} on ${format(new Date(playDate.date), 'MMMM d')}!`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">{playDate.title}</h1>
        
        <div className="flex gap-2">
          {isHost && (
            <>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
              <Link to={`/edit/${playDate.id}`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-5 w-5" />
                </Button>
              </Link>
            </>
          )}
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isPast && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>This play date has already passed</AlertTitle>
          <AlertDescription>
            This play date took place on {format(new Date(playDate.date), 'MMMM d, yyyy')}.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-medium">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {playDate.description || "No description provided."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Date
                  </h3>
                  <p>{format(new Date(playDate.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Time
                  </h3>
                  <p>{playDate.startTime} - {playDate.endTime}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Location
                  </h3>
                  <p>{playDate.location}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Age Range
                  </h3>
                  <p>{playDate.ageRange.min} - {playDate.ageRange.max} years</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Host
                </h3>
                <p>{isHost ? 'You are hosting this play date' : 'Another parent'}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              
              {!isHost && !isPast && (
                hasRsvp ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel RSVP
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowRsvpDialog(true)}
                    disabled={isFull}
                    className={!isFull ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600" : ""}
                  >
                    {isFull ? 'Play Date Full' : 'RSVP'}
                  </Button>
                )
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Attendees
              </CardTitle>
              <CardDescription>
                {totalChildren} of {playDate.maxAttendees} spots filled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(totalChildren / playDate.maxAttendees) * 100}%` }}
                  ></div>
                </div>
                
                {playDate.attendees.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {playDate.attendees.map((attendee) => {
                      // Find the parent
                      const parent = attendee.parentId === currentUser?.id 
                        ? currentUser 
                        : { name: 'Another Parent', children: [] }
                      
                      // Find the children
                      const children = parent.children.filter(
                        child => attendee.childrenIds.includes(child.id)
                      )
                      
                      return (
                        <div key={attendee.parentId} className="border-b pb-2 last:border-0">
                          <p className="font-medium">
                            {attendee.parentId === currentUser?.id ? 'You' : parent.name}
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {children.map(child => (
                              <li key={child.id}>
                                {child.name} ({child.age} years)
                              </li>
                            ))}
                            {children.length === 0 && attendee.childrenIds.map((childId, index) => (
                              <li key={childId}>Child {index + 1}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No attendees yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* RSVP Dialog */}
      <Dialog open={showRsvpDialog} onOpenChange={setShowRsvpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP to Play Date</DialogTitle>
            <DialogDescription>
              Select which children will attend this play date.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser?.children && currentUser.children.length > 0 ? (
            <div className="space-y-4">
              {currentUser.children
                .filter(child => 
                  child.age >= playDate.ageRange.min && 
                  child.age <= playDate.ageRange.max
                )
                .map(child => (
                  <div key={child.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={child.id} 
                      checked={selectedChildren.includes(child.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChildren([...selectedChildren, child.id])
                        } else {
                          setSelectedChildren(selectedChildren.filter(id => id !== child.id))
                        }
                      }}
                    />
                    <Label htmlFor={child.id}>
                      {child.name} ({child.age} years)
                    </Label>
                  </div>
                ))}
              
              {currentUser.children.filter(child => 
                child.age >= playDate.ageRange.min && 
                child.age <= playDate.ageRange.max
              ).length === 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  None of your children are within the age range for this play date.
                </p>
              )}
              
              {currentUser.children.filter(child => 
                child.age >= playDate.ageRange.min && 
                child.age <= playDate.ageRange.max
              ).length > 0 && 
                totalChildren + selectedChildren.length > playDate.maxAttendees && (
                <p className="text-amber-600 dark:text-amber-400">
                  This play date can only accommodate {playDate.maxAttendees - totalChildren} more children.
                </p>
              )}
            </div>
          ) : (
            <p className="text-amber-600 dark:text-amber-400">
              You need to add children to your profile before you can RSVP.
            </p>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRsvpDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRsvp}
              disabled={
                selectedChildren.length === 0 || 
                totalChildren + selectedChildren.length > playDate.maxAttendees
              }
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Confirm RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel RSVP Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel RSVP</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your RSVP for this play date?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep RSVP
            </Button>
            <Button variant="destructive" onClick={handleCancelRsvp}>
              Cancel RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Play Date Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Play Date</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this play date? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlayDateDetails