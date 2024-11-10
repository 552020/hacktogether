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
    image: '/images/exhaust.png',
    inStock: true,
    highlight: 'Great stuff',
  },
  {
    id: 2,
    name: 'SHOE',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/images/shoe.png',
    inStock: true,
  },
  {
    id: 3,
    name: 'STEFANO',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/images/stefano.png',
    inStock: true,
  },
  {
    id: 4,
    name: 'TRASH',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/images/trash.png',
    inStock: true,
  },
  {
    id: 5,
    name: 'EXTINCTOR',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/images/extinctor.png',
    inStock: true,
  },
  {
    id: 6,
    name: 'TABLE',
    price: 189,
    colors: ['asphalt'],
    sizes: [1, 2, 3, 4, 5, 6],
    image: '/images/table.png',
    inStock: true,
  },
]
