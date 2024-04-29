import { lazyWithPreload /* , sleep  */ } from 'utils'
export const LazyPageErrorDemo = lazyWithPreload(() => import('./'))

export const loader = async () => {
  await LazyPageErrorDemo.preload().then((component: any) => {
    return component
  })
  return null
}
