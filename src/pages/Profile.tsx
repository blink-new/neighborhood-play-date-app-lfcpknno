
import { useState } from 'react'
import { usePlayDate } from '../context/PlayDateContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { User, Users, Plus, Trash2, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

const Profile = () => {
  const { currentUser, setCurrentUser, addChild, removeChild } = usePlayDate()
  
  const [parentForm, setParentForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  })
  
  const [childForm, setChildForm] = useState({
    name: '',
    age: 0
  })
  
  const [showAddChildDialog, setShowAddChildDialog] = useState(false)
  const [showDeleteChildDialog, setShowDeleteChildDialog] = useState(false)
  const [childToDelete, setChildToDelete] = useState<string | null>(null)

  const handleParentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParentForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handleChildFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setChildForm(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? parseInt(value) || 0 : value 
    }))
  }
  
  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) return
    
    if (!parentForm.name || !parentForm.email) {
      toast.error('Name and email are required')
      return
    }
    
    setCurrentUser({
      ...currentUser,
      name: parentForm.name,
      email: parentForm.email,
      phone: parentForm.phone
    })
    
    toast.success('Profile updated successfully')
  }
  
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!childForm.name || childForm.age <= 0) {
      toast.error('Name and a valid age are required')
      return
    }
    
    addChild({
      name: childForm.name,
      age: childForm.age
    })
    
    setChildForm({
      name: '',
      age: 0
    })
    
    setShowAddChildDialog(false)
    toast.success('Child added successfully')
  }
  
  const handleDeleteChild = () => {
    if (!childToDelete) return
    
    removeChild(childToDelete)
    setChildToDelete(null)
    setShowDeleteChildDialog(false)
    toast.success('Child removed successfully')
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="text-gray-500 mb-6">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Your Profile</h1>
      
      <Tabs defaultValue="parent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parent" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Parent Info
          </TabsTrigger>
          <TabsTrigger value="children" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Children
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="parent" className="mt-6">
          <Card>
            <form onSubmit={handleParentSubmit}>
              <CardHeader>
                <CardTitle>Parent Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={parentForm.name}
                    onChange={handleParentFormChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={parentForm.email}
                    onChange={handleParentFormChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Phone (optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={parentForm.phone}
                    onChange={handleParentFormChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="children" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Children</CardTitle>
                <Dialog open={showAddChildDialog} onOpenChange={setShowAddChildDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add Child
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleAddChild}>
                      <DialogHeader>
                        <DialogTitle>Add a Child</DialogTitle>
                        <DialogDescription>
                          Add your child's information to RSVP to play dates.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="childName">Name</Label>
                          <Input
                            id="childName"
                            name="name"
                            value={childForm.name}
                            onChange={handleChildFormChange}
                            placeholder="Child's name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="childAge">Age</Label>
                          <Input
                            id="childAge"
                            name="age"
                            type="number"
                            min="0"
                            max="18"
                            value={childForm.age || ''}
                            onChange={handleChildFormChange}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowAddChildDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Child</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage your children's information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser.children.length > 0 ? (
                <div className="space-y-4">
                  {currentUser.children.map(child => (
                    <div 
                      key={child.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {child.age} years old
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setChildToDelete(child.id)
                          setShowDeleteChildDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't added any children yet
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddChildDialog(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Child
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Child Dialog */}
      <Dialog open={showDeleteChildDialog} onOpenChange={setShowDeleteChildDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Child</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this child from your profile?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteChildDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteChild}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile