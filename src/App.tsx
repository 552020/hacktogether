import './App.scss'
import '@styles/examplePage.scss'
import './index.css'
import { useMyId, useStateTogetherWithPerUserValues } from 'react-together'
import { useState, useEffect } from 'react'
import UserProfile from './components/UserProfile'
import { products } from './products'
import { motion, AnimatePresence } from 'framer-motion'
import cartoonLogo from './assets/images/logo/cartoon.gif'

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

type Section = 'home' | 'about' | 'services' | null

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
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentSection, setCurrentSection] = useState<Section>(null)

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
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY,
    })
  }

  return (
    <div className='flex justify-center h-screen bg-background text-foreground font-mono overflow-hidden'>
      <div className='flex w-[1200px] h-full relative' onMouseMove={handleMouseMove}>
        {/* Main content that gets blurred */}
        <div className={`flex flex-1 transition-all duration-300 ${currentSection ? 'blur-sm' : ''}`}>
          {/* Images and Product Details columns stay the same */}
          <div className='flex-1 p-6 relative'>
            {products.map((product) => (
              <div
                key={product.id}
                className='absolute'
                style={{
                  left: `${10 + ((product.id * 37) % 65)}%`,
                  top: `${15 + ((product.id * 41) % 60)}%`,
                  transform: `rotate(${((product.id * 7) % 10) - 5}deg)`,
                  width: `${80 + ((product.id * 11) % 20)}px`,
                }}
              >
                <div
                  className='cursor-pointer'
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => setSelectedImage(selectedImage === product.id ? null : product.id)}
                >
                  <div className={`transition-transform duration-200 ${selectedImage === product.id ? 'scale-105' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-auto object-contain transition-all duration-200 ${
                        hoveredProduct && hoveredProduct !== product.id ? 'grayscale opacity-50' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='space-y-8 flex flex-col justify-center flex-1 p-6'>
            {products.map((product) => (
              <div
                key={product.id}
                className={`border-t border-border pt-4 transition-opacity duration-200 ${
                  hoveredProduct && hoveredProduct !== product.id ? 'opacity-50' : ''
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-sm'>
                      {String(product.id).padStart(2, '0')}. {product.name}
                      {product.highlight && <span className='text-red-500 ml-2'>{product.highlight}</span>}
                    </h3>
                    <div className='flex gap-2 mt-1'>
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          onClick={() => setSelectedColors({ ...selectedColors, [product.id]: color })}
                          className={`text-xs cursor-pointer hover:underline ${selectedColors[product.id] === color ? 'underline' : ''}`}
                        >
                          ●{color}
                        </span>
                      ))}
                    </div>
                    <div className='flex gap-2 mt-1'>
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                          className={`text-xs cursor-pointer hover:underline ${selectedSizes[product.id] === size ? 'underline' : ''}`}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-sm'>${product.price}</span>
                    <span className='block mt-1 text-xs cursor-pointer hover:underline'>
                      {product.inStock ? 'add to cart' : 'sold out'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='w-48 border-l border-border p-6 flex flex-col justify-center relative'>
          <div className='absolute top-4 left-1/2 -translate-x-1/2 z-50'></div>
          <div className='space-y-6'>
            <img src={cartoonLogo} alt='Cartoon Logo' className='w-34 h-34 object-contain' />
            <div className='space-y-2'>
              <span className='block text-sm font-bold cursor-pointer hover:underline'>home</span>
              <span
                className='block text-sm font-bold cursor-pointer hover:underline'
                onClick={() => setCurrentSection(currentSection === 'about' ? null : 'about')}
              >
                about
              </span>
              <span
                className='block text-sm font-bold cursor-pointer hover:underline'
                onClick={() => setCurrentSection(currentSection === 'services' ? null : 'services')}
              >
                services
              </span>
            </div>

            <div className='space-y-2'>
              <h4 className='text-sm font-bold'>users ({activeUsers.length})</h4>
              {activeUsers.map((userId) => (
                <div key={userId} className='flex items-center justify-between text-sm'>
                  <span className='font-bold'>user {userId}</span>
                  <div className='flex gap-2'>
                    <span
                      className='text-xs cursor-pointer hover:underline'
                      onClick={() => {
                        setSelectedUser(userId)
                        setIsChatOpen(true)
                      }}
                    >
                      chat
                    </span>
                    <span className='text-xs'>·</span>
                    <span
                      className='text-xs cursor-pointer hover:underline'
                      onClick={() => {
                        setSelectedUser(userId)
                        setIsProfileOpen(true)
                      }}
                    >
                      profile
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Chat */}
          {selectedUser && isChatOpen && (
            <div className='absolute bottom-0 left-0 right-0 border-t border-border bg-white'>
              <div className='p-3 flex justify-between items-center border-b border-border'>
                <span className='text-xs font-bold'>{selectedUser}</span>
                <span onClick={() => setIsChatOpen(false)} className='text-[10px] cursor-pointer hover:underline'>
                  close
                </span>
              </div>

              <div className='h-48 overflow-y-auto p-3'>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`mb-2 ${msg.from === myId ? 'text-right' : 'text-left'}`}>
                    <span className='text-[10px]'>{msg.text}</span>
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
                className='border-t border-border'
              >
                <input
                  type='text'
                  name='message'
                  placeholder='message'
                  className='w-full p-3 text-[10px] focus:outline-none'
                  autoComplete='off'
                />
              </form>
            </div>
          )}
        </nav>

        {/* Modal Sections */}
        {currentSection && (
          <div className='absolute inset-0 flex items-center justify-center z-50' onClick={() => setCurrentSection(null)}>
            <div className='bg-white p-12 max-w-lg' onClick={(e) => e.stopPropagation()}>
              {currentSection === 'about' && (
                <div className='space-y-6'>
                  <h2 className='text-sm font-bold'>About</h2>
                  <p className='text-sm'>
                    This is a collaborative shopping experience where users can browse products together in real-time. Watch other users'
                    cursors move across the screen, chat with them, and see their product selections.
                  </p>
                  <p className='text-sm'>Built with React and WebSocket technology to enable real-time interactions between users.</p>
                </div>
              )}

              {currentSection === 'services' && (
                <div className='space-y-6'>
                  <h2 className='text-sm font-bold'>Services</h2>
                  <ul className='space-y-4 text-sm'>
                    <li>Real-time collaborative shopping</li>
                    <li>Live user interaction</li>
                    <li>Instant messaging</li>
                    <li>Synchronized product browsing</li>
                    <li>User presence indicators</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cursors stay on top */}
        {Object.entries(positionsPerUser).map(([userId, pos]) => (
          <div
            key={userId}
            className={`fixed w-2 h-2 rounded-full pointer-events-none ${userId === myId ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className='absolute left-4 top-0 text-xs whitespace-nowrap'>user {userId === myId ? 'you' : userId}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
