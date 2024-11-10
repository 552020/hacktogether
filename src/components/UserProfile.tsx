interface UserProfileProps {
  userId: string
  isCurrentUser: boolean
  onClose: () => void
}

interface UserData {
  bio: string
  avatar: string
  basket: string[]
  clickedUsers: string[]
}

const AVAILABLE_PRODUCTS = [
  'Mechanical Keyboard',
  'Wireless Mouse',
  'Gaming Headset',
  'USB-C Cable',
  '4K Monitor',
  'Laptop Stand',
  'Webcam',
  'External SSD',
  'Graphics Tablet',
  'Power Bank',
  'Smart Watch',
  'Bluetooth Speaker',
  'RGB Mouse Pad',
  'Microphone',
  'Ergonomic Chair',
  'Desk Lamp',
  'USB Hub',
  'Wireless Charger',
  'Noise-Canceling Earbuds',
  'Portable Monitor',
]

// Seeded random number generator
function seededRandom(seed: string) {
  let seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return function () {
    seedValue = (seedValue * 9301 + 49297) % 233280
    return seedValue / 233280
  }
}

function generateRandomBasket(userId: string): string[] {
  const random = seededRandom(userId)
  const basketSize = Math.floor(random() * 5) + 1 // 1-5 items
  const basket: string[] = []

  while (basket.length < basketSize) {
    const index = Math.floor(random() * AVAILABLE_PRODUCTS.length)
    const product = AVAILABLE_PRODUCTS[index]
    if (!basket.includes(product)) {
      basket.push(product)
    }
  }
  return basket
}

export default function UserProfile({ userId, isCurrentUser, onClose }: UserProfileProps) {
  const defaultUserData: UserData = {
    bio: "Hey there! I'm using React Together",
    // avatar: `https://api.dicebear.com/9.x/notionists-neutralsvg?seed=${userId}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    basket: generateRandomBasket(userId),
    clickedUsers: [],
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-96 max-h-[90vh] overflow-y-auto'>
        <div className='p-4 border-b flex justify-between items-center bg-blue-500 text-white'>
          <h2 className='text-xl font-bold'>User Profile</h2>
          <button onClick={onClose} className='text-2xl hover:text-gray-200'>
            ×
          </button>
        </div>

        <div className='p-6'>
          <div className='flex flex-col items-center mb-6'>
            <img
              src={defaultUserData.avatar}
              alt={`User ${userId} avatar`}
              className='w-32 h-32 rounded-full border-4 border-blue-500 mb-4'
            />
            <h3 className='text-xl font-bold'>
              User {userId} {isCurrentUser && '(You)'}
            </h3>
          </div>

          <div className='mb-6'>
            <h4 className='font-bold mb-2'>Bio</h4>
            <p className='text-gray-600'>{defaultUserData.bio}</p>
          </div>

          <div className='mb-6'>
            <h4 className='font-bold mb-2'>Shopping Basket</h4>
            {defaultUserData.basket.length === 0 ? (
              <p className='text-gray-500'>No items in basket</p>
            ) : (
              <ul className='divide-y'>
                {defaultUserData.basket.map((item, index) => (
                  <li key={index} className='py-2 flex items-center'>
                    <span className='w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3 text-sm'>
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className='font-bold mb-2'>Clicked Users</h4>
            {defaultUserData.clickedUsers.length === 0 ? (
              <p className='text-gray-500'>No clicked users yet</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {defaultUserData.clickedUsers.map((clickedUserId, index) => (
                  <span key={index} className='bg-gray-100 px-3 py-1 rounded-full text-sm'>
                    User {clickedUserId}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
