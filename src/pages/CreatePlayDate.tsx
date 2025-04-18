
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayDate } from '../context/PlayDateContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Calendar, Clock, MapPin, Users, Info } from 'lucide-react'
import { toast } from 'sonner'

const CreatePlayDate = () => {
  const navigate = useNavigate()
  const { addPlayDate, currentUser } = usePlayDate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxAttendees: 10,
    minAge: 3,
    maxAge: 12
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast.error('You must be logged in to create a play date')
      return
    }

    // Validate form
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create new play date
    addPlayDate({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      hostId: currentUser.id,
      maxAttendees: formData.maxAttendees,
      ageRange: {
        min: formData.minAge,
        max: formData.maxAge
      },
      attendees: []
    })

    toast.success('Play date created successfully!')
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-400">Create a Play Date</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Play Date Details</CardTitle>
            <CardDescription>Fill in the details for your neighborhood play date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Park Adventure"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the activities, what to bring, etc."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  End Time
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Central Park Playground"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Max Children
                </Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxAttendees}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minAge" className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Min Age
                </Label>
                <Input
                  id="minAge"
                  name="minAge"
                  type="number"
                  min="0"
                  max="18"
                  value={formData.minAge}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxAge" className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Max Age
                </Label>
                <Input
                  id="maxAge"
                  name="maxAge"
                  type="number"
                  min="0"
                  max="18"
                  value={formData.maxAge}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Create Play Date
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default CreatePlayDate