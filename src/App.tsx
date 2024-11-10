import './App.scss'
import '@styles/examplePage.scss'
import './index.css'
import { useMyId, useStateTogetherWithPerUserValues } from 'react-together'
import { useState, useEffect } from 'react'
import UserProfile from './components/UserProfile'

interface ChatMessage {
  from: string
  to: string
  text: string
  timestamp: number
}

interface UserStatus {
  online: boolean
  lastSeen: number
}

const items = [
  { id: 1, title: 'Item 1', price: '$99' },
  { id: 2, title: 'Item 2', price: '$149' },
  { id: 3, title: 'Item 3', price: '$199' },
  { id: 4, title: 'Item 4', price: '$299' },
  { id: 5, title: 'Item 5', price: '$399' },
  { id: 6, title: 'Item 6', price: '$499' },
  { id: 7, title: 'Item 7', price: '$599' },
  { id: 8, title: 'Item 8', price: '$699' },
  { id: 9, title: 'Item 9', price: '$799' },
]

export default function App() {
  const myId = useMyId()
  const [position, setPosition, positionsPerUser] = useStateTogetherWithPerUserValues('user-positions', { x: 0, y: 0 })
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [status, setStatus, statusPerUser] = useStateTogetherWithPerUserValues<UserStatus>('user-status', {
    online: true,
    lastSeen: Date.now(),
  })
  const [messages, setMessages, messagesPerUser] = useStateTogetherWithPerUserValues<ChatMessage[]>('chat-messages', [])
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    setStatus({ online: true, lastSeen: Date.now() })
    const interval = setInterval(() => {
      setStatus({ online: true, lastSeen: Date.now() })
    }, 5000)
    return () => {
      setStatus({ online: false, lastSeen: Date.now() })
      clearInterval(interval)
    }
  }, [setStatus])

  const sendMessage = (text: string) => {
    if (!selectedUser) return
    setMessages([
      ...messages,
      {
        from: myId,
        to: selectedUser,
        text,
        timestamp: Date.now(),
      },
    ])
  }

  const activeUsers = Object.entries(statusPerUser)
    .filter(([id, status]) => {
      const isRecent = Date.now() - status.lastSeen < 10000
      return id !== myId && status.online && isRecent
    })
    .map(([id]) => id)

  const chatMessages = messages
    .concat(messagesPerUser[selectedUser] || [])
    .filter((msg) => (msg.from === myId && msg.to === selectedUser) || (msg.from === selectedUser && msg.to === myId))
    .sort((a, b) => a.timestamp - b.timestamp)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX / window.innerWidth) * 100 - 50
    const y = (e.clientY / window.innerHeight) * 100 - 50

    setPosition({ x, y })
  }

  return (
    <div className='relative min-h-screen' onMouseMove={handleMouseMove}>
      {/* User cursors */}
      {Object.entries(positionsPerUser).map(([userId, userPosition]) => (
        <div
          key={userId}
          style={{
            position: 'fixed',
            left: `calc(50% + ${userPosition.x}vw)`,
            top: `calc(50% + ${userPosition.y}vh)`,
            zIndex: 50,
          }}
        >
          <div
            className={`w-4 h-4 rounded-full ${userId === myId ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ transform: 'translate(-50%, -50%)' }}
          />
          <div className='text-xs mt-1 bg-black text-white px-2 py-1 rounded whitespace-nowrap'>
            User {userId === myId ? '(You)' : userId}
          </div>
        </div>
      ))}

      {/* Users List Box */}
      <div className='fixed bottom-4 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50'>
        <div className='bg-blue-500 text-white p-3'>
          <h2 className='text-sm font-bold'>Users Near You ({activeUsers.length})</h2>
        </div>
        <div className='max-h-48 overflow-y-auto'>
          {activeUsers.map((userId) => (
            <div key={userId} className='w-full text-left p-2 hover:bg-gray-100 text-sm border-b'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 rounded-full bg-green-500'></div>
                  <span>User {userId}</span>
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => {
                      setSelectedUser(userId)
                      setIsChatOpen(true)
                    }}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(userId)
                      setIsProfileOpen(true)
                    }}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Popup */}
      {selectedUser && isChatOpen && (
        <div className='fixed bottom-4 right-72 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col z-50'>
          <div className='bg-blue-500 text-white p-3 flex justify-between items-center'>
            <h3 className='font-bold'>Chat with User {selectedUser}</h3>
            <button onClick={() => setIsChatOpen(false)} className='text-white hover:text-gray-200'>
              ×
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4 flex flex-col'>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.from === myId ? 'ml-auto' : 'mr-auto'}`}>
                <div
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.from === myId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
              if (input.value.trim()) {
                sendMessage(input.value)
                input.value = ''
              }
            }}
            className='p-3 border-t'
          >
            <div className='flex gap-2'>
              <input
                type='text'
                name='message'
                placeholder='Type a message...'
                className='flex-1 p-2 border rounded text-sm'
                autoComplete='off'
              />
              <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded text-sm'>
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replace original content with items grid */}
      <div className='min-h-screen bg-white py-16 px-8'>
        <div className='max-w-3xl mx-auto'>
          <div className='grid grid-cols-3 gap-6'>
            {items.map((item) => (
              <div
                key={item.id}
                className='aspect-square border-2 border-gray-300 rounded-lg p-4 flex flex-col justify-between hover:border-blue-500 transition-colors'
              >
                <div className='h-32 bg-gray-200 rounded-md mb-2'></div>
                <div>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedUser && isProfileOpen && (
        <UserProfile userId={selectedUser} isCurrentUser={selectedUser === myId} onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  )
}
