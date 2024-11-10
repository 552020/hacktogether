export interface Product {
  id: number
  name: string
  price: number
  colors: string[]
  sizes: number[]
  image: string
  highlight?: string
  inStock?: boolean
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Exhaust',
    price: 79,
    colors: ['vintage black'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/exhaust.png',
    inStock: true,
    highlight: 'Great stuff',
  },
  {
    id: 2,
    name: 'SHOE',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/shoe.png',
    inStock: true,
  },
  {
    id: 3,
    name: 'STEFANO',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/stefano.png',
    inStock: true,
  },
  {
    id: 4,
    name: 'TRASH',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/trash.png',
    inStock: true,
  },
  {
    id: 5,
    name: 'EXTINCTOR',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/extinctor.png',
    inStock: true,
  },
  {
    id: 6,
    name: 'TABLE',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/src/assets/images/table.png',
    inStock: true,
  },
]
