import { RatingTitle } from './Filters/RatingTitle'

export const categoryOptions = [
  { title: 'Cameras', value: 'cameras' },
  { title: 'Smartphones', value: 'smartphones' },
  { title: 'Games', value: 'games' },
  { title: 'Televisions', value: 'televisions' }
] as const

export const priceOptions = [
  { title: 'All', value: '' },
  { title: '$0 - $100', value: '0-100' },
  { title: '$100 - $500', value: '100-500' },
  { title: '$500 - $1000', value: '500-1000' },
  { title: '$1000+', value: '1000' }
] as const

export const brandOptions = [
  { title: 'Sony', value: 'sony' },
  { title: 'Samsung', value: 'samsung' },
  { title: 'Cannon', value: 'cannon' },
  { title: 'LG', value: 'lg' },
  { title: 'Nintendo', value: 'nintendo' },
  { title: 'Microsoft', value: 'microsoft' },
  { title: 'Google', value: 'google' },
  { title: 'Toshiba', value: 'toshiba' },
  { title: 'Apple', value: 'apple' }
] as const

export const ratingOptions = [
  { title: 'All', value: '' },
  {
    title: <RatingTitle plus value={1} />,
    value: '1'
  },
  { title: <RatingTitle plus value={2} />, value: '2' },
  { title: <RatingTitle plus value={3} />, value: '3' },
  { title: <RatingTitle plus value={4} />, value: '4' },
  { title: <RatingTitle value={5} />, value: '5' }
] as const
