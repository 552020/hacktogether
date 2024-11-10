import './index.css'

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
  return (
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
  )
}
