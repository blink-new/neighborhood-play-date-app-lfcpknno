
import { createContext, useContext, useState, ReactNode } from 'react'

// Types
export interface Child {
  id: string
  name: string
  age: number
}

export interface Parent {
  id: string
  name: string
  email: string
  phone?: string
  children: Child[]
}

export interface PlayDate {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  hostId: string
  maxAttendees: number
  ageRange: {
    min: number
    max: number
  }
  attendees: {
    parentId: string
    childrenIds: string[]
  }[]
  createdAt: string
}

interface PlayDateContextType {
  playDates: PlayDate[]
  currentUser: Parent | null
  addPlayDate: (playDate: Omit<PlayDate, 'id' | 'createdAt'>) => void
  updatePlayDate: (id: string, playDate: Partial<PlayDate>) => void
  deletePlayDate: (id: string) => void
  rsvpToPlayDate: (playDateId: string, childrenIds: string[]) => void
  cancelRsvp: (playDateId: string) => void
  setCurrentUser: (user: Parent) => void
  addChild: (child: Omit<Child, 'id'>) => void
  removeChild: (childId: string) => void
}

const PlayDateContext = createContext<PlayDateContextType | undefined>(undefined)

// Sample data
const sampleChildren: Child[] = [
  { id: 'c1', name: 'Emma', age: 5 },
  { id: 'c2', name: 'Noah', age: 7 },
]

const sampleParent: Parent = {
  id: 'p1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '555-123-4567',
  children: sampleChildren,
}

const samplePlayDates: PlayDate[] = [
  {
    id: 'pd1',
    title: 'Park Adventure',
    description: 'Join us for a fun afternoon at Central Park with games and snacks!',
    date: '2023-07-15',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Central Park Playground',
    hostId: 'p1',
    maxAttendees: 10,
    ageRange: { min: 4, max: 8 },
    attendees: [
      { parentId: 'p1', childrenIds: ['c1'] }
    ],
    createdAt: '2023-07-01T12:00:00Z',
  },
  {
    id: 'pd2',
    title: 'Swimming Pool Party',
    description: 'Cool off with a splash at the community pool! Bring swimsuits and towels.',
    date: '2023-07-22',
    startTime: '13:00',
    endTime: '15:30',
    location: 'Community Pool',
    hostId: 'p2',
    maxAttendees: 8,
    ageRange: { min: 6, max: 12 },
    attendees: [],
    createdAt: '2023-07-05T09:30:00Z',
  },
  {
    id: 'pd3',
    title: 'Arts & Crafts Session',
    description: 'Get creative with various art supplies. All materials provided!',
    date: '2023-07-18',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Community Center',
    hostId: 'p3',
    maxAttendees: 12,
    ageRange: { min: 3, max: 10 },
    attendees: [],
    createdAt: '2023-07-03T15:45:00Z',
  },
]

export const PlayDateProvider = ({ children }: { children: ReactNode }) => {
  const [playDates, setPlayDates] = useState<PlayDate[]>(samplePlayDates)
  const [currentUser, setCurrentUser] = useState<Parent | null>(sampleParent)

  const addPlayDate = (playDate: Omit<PlayDate, 'id' | 'createdAt'>) => {
    const newPlayDate: PlayDate = {
      ...playDate,
      id: `pd${playDates.length + 1}`,
      createdAt: new Date().toISOString(),
    }
    setPlayDates([...playDates, newPlayDate])
  }

  const updatePlayDate = (id: string, updatedPlayDate: Partial<PlayDate>) => {
    setPlayDates(playDates.map(playDate => 
      playDate.id === id ? { ...playDate, ...updatedPlayDate } : playDate
    ))
  }

  const deletePlayDate = (id: string) => {
    setPlayDates(playDates.filter(playDate => playDate.id !== id))
  }

  const rsvpToPlayDate = (playDateId: string, childrenIds: string[]) => {
    if (!currentUser) return

    setPlayDates(playDates.map(playDate => {
      if (playDate.id === playDateId) {
        // Remove any existing RSVP from this parent
        const filteredAttendees = playDate.attendees.filter(
          attendee => attendee.parentId !== currentUser.id
        )
        
        // Add the new RSVP
        return {
          ...playDate,
          attendees: [
            ...filteredAttendees,
            { parentId: currentUser.id, childrenIds }
          ]
        }
      }
      return playDate
    }))
  }

  const cancelRsvp = (playDateId: string) => {
    if (!currentUser) return

    setPlayDates(playDates.map(playDate => {
      if (playDate.id === playDateId) {
        return {
          ...playDate,
          attendees: playDate.attendees.filter(
            attendee => attendee.parentId !== currentUser.id
          )
        }
      }
      return playDate
    }))
  }

  const addChild = (child: Omit<Child, 'id'>) => {
    if (!currentUser) return

    const newChild: Child = {
      ...child,
      id: `c${currentUser.children.length + 1}_${Date.now().toString().slice(-4)}`,
    }

    setCurrentUser({
      ...currentUser,
      children: [...currentUser.children, newChild]
    })
  }

  const removeChild = (childId: string) => {
    if (!currentUser) return

    setCurrentUser({
      ...currentUser,
      children: currentUser.children.filter(child => child.id !== childId)
    })
  }

  return (
    <PlayDateContext.Provider value={{
      playDates,
      currentUser,
      addPlayDate,
      updatePlayDate,
      deletePlayDate,
      rsvpToPlayDate,
      cancelRsvp,
      setCurrentUser,
      addChild,
      removeChild
    }}>
      {children}
    </PlayDateContext.Provider>
  )
}

export const usePlayDate = () => {
  const context = useContext(PlayDateContext)
  if (context === undefined) {
    throw new Error('usePlayDate must be used within a PlayDateProvider')
  }
  return context
}