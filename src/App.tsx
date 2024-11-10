import './App.scss'
import '@styles/examplePage.scss'
import './index.css'
import { useMyId, useStateTogetherWithPerUserValues } from 'react-together'
import { useState, useEffect } from 'react'
import UserProfile from './components/UserProfile'
import { products } from './products'

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
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({})
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({})
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

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
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div className='flex min-h-screen bg-background text-foreground font-mono' onMouseMove={handleMouseMove}>
      {/* Cursor tracking */}
      {Object.entries(positionsPerUser).map(([userId, pos]) => (
        <div
          key={userId}
          style={{
            position: 'fixed',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          <div className={`w-4 h-4 rounded-full ${userId === myId ? 'bg-red-500' : 'bg-blue-500'}`} />
          <div className='text-xs mt-1 bg-black text-white px-2 py-1 rounded whitespace-nowrap'>
            user {userId === myId ? '(you)' : userId}
          </div>
        </div>
      ))}

      <main className='flex-1 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Product Image Grid */}
          <div className='grid grid-cols-2 gap-4 h-fit'>
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative group ${product.id === 1 || product.id === 4 ? 'col-span-2' : ''}`}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className='aspect-square flex items-center justify-center'>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '25%',
                      height: 'auto',
                      display: 'block',
                    }}
                    className='object-contain'
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-black/40 transition-opacity ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Product Details List */}
          <div className='space-y-8'>
            {products.map((product) => (
              <div key={product.id} className='border-t border-border pt-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-sm'>
                      {product.id}. {product.name}
                    </h3>
                    <div className='flex gap-2 mt-1'>
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColors({ ...selectedColors, [product.id]: color })}
                          className={`text-xs hover:underline ${selectedColors[product.id] === color ? 'underline' : ''}`}
                        >
                          ●{color}
                        </button>
                      ))}
                    </div>
                    <div className='flex gap-2 mt-1'>
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                          className={`text-xs hover:underline ${selectedSizes[product.id] === size ? 'underline' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-sm'>${product.price}</span>
                    <button className='block mt-1 text-xs hover:underline'>{product.inStock ? 'add to cart' : 'sold out'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation Sidebar */}
      <nav className='w-48 border-l border-border p-6 space-y-6'>
        <div className='space-y-2'>
          <button className='block text-sm hover:underline'>home</button>
          <button className='block text-sm hover:underline'>about</button>
          <button className='block text-sm hover:underline'>services</button>
        </div>

        <div className='space-y-2'>
          <h4 className='text-sm'>sort by</h4>
          <button className='text-sm hover:underline'>A-Z</button>
          <button className='text-sm hover:underline'>CHRON</button>
          <button className='text-sm hover:underline'>PRICE</button>
        </div>

        {/* Users Section */}
        <div className='space-y-2'>
          <h4 className='text-sm'>users ({activeUsers.length})</h4>
          {activeUsers.map((userId) => (
            <div key={userId} className='flex items-center justify-between text-sm'>
              <span>user {userId}</span>
              <div className='flex gap-2'>
                <button
                  className='text-xs hover:underline'
                  onClick={() => {
                    setSelectedUser(userId)
                    setIsChatOpen(true)
                  }}
                >
                  chat
                </button>
                <span className='text-xs'>·</span>
                <button
                  className='text-xs hover:underline'
                  onClick={() => {
                    setSelectedUser(userId)
                    setIsProfileOpen(true)
                  }}
                >
                  profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Chat and Profile modals */}
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

      {selectedUser && isProfileOpen && (
        <UserProfile userId={selectedUser} isCurrentUser={selectedUser === myId} onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  )
}
