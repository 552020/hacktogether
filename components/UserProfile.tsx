interface UserProfile {
  id: string
  name: string
  bio: string
  profilePicture: string
  basket: Product[]
  clickedUsers: User[]
}

const UserProfile: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className='p-6 bg-white rounded-lg shadow-lg'>
      {/* Profile Header */}
      <div className='flex items-center gap-4 mb-6'>
        <img src={user.profilePicture} alt={`${user.name}'s profile`} className='w-24 h-24 rounded-full object-cover' />
        <div>
          <h2 className='text-2xl font-bold'>{user.name}</h2>
          <p className='text-gray-600'>{user.bio}</p>
        </div>
      </div>

      {/* Basket Section */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-3'>Shopping Basket</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {user.basket.map((product) => (
            <div key={product.id} className='p-2 border rounded'>
              <img src={product.image} alt={product.name} className='w-full h-32 object-cover' />
              <p className='mt-2 font-medium'>{product.name}</p>
              <p className='text-gray-600'>${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clicked Users Section */}
      <div>
        <h3 className='text-xl font-semibold mb-3'>Recently Viewed Profiles</h3>
        <div className='flex flex-wrap gap-4'>
          {user.clickedUsers.map((clickedUser) => (
            <div key={clickedUser.id} className='text-center'>
              <img src={clickedUser.profilePicture} alt={clickedUser.name} className='w-16 h-16 rounded-full object-cover' />
              <p className='mt-1 text-sm'>{clickedUser.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
