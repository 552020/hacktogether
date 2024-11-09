// import './App.scss'
// import '@styles/examplePage.scss'

// import { useStateTogether } from 'react-together'

// import { version } from '@package'
// import { HeroLogo } from '@components'

// export default function App() {
//   const [count, set_count] = useStateTogether('counter_0', 0)

//   return (
//     <div>
//       <div>
//         <HeroLogo {...{ type: 'reacttogether' }} />
//         <HeroLogo {...{ type: 'react' }} />
//         <HeroLogo {...{ type: 'vite' }} />
//       </div>
//       <h1>ReactTogether + Vite + React</h1>
//       <div className='card'>
//         <button onClick={() => set_count((count) => count + 1) }>Synq'd count is {count}</button>
//         {/* <button onClick={() => set_count((count) => count + 1)}>Synq'd count is {count}</button> */}
//         <button {...{ style: { marginLeft: '1rem' }, onClick: () => set_count(0) }}>Reset</button>
//       </div>
//       <p className='read-the-docs'>Click on the respective logos to learn more.</p>

//       <div className='version-num'>{version}</div>
//     </div>
//   )
// }

import './App.scss'
import '@styles/examplePage.scss'
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
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Shopping Items</h1>

      <div className='grid grid-cols-3 gap-6'>
        {items.map((item) => (
          <div
            key={item.id}
            className='border-2 border-gray-300 rounded-lg p-4 h-48 flex flex-col justify-between hover:border-blue-500 transition-colors'
          >
            <div className='h-24 bg-gray-200 rounded-md mb-2'></div>
            <div>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
