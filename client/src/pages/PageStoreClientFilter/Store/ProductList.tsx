import { ProductItem } from './ProductItem'

type MaybeProducts = Product[] | null
type ProductListProps = {
  products: MaybeProducts
}

/* ========================================================================
                              ProductList      
======================================================================== */

export const ProductList = ({ products }: ProductListProps) => {
  /* ======================
          return
  ====================== */
  // We could create actual fallback UI indicating no products.
  // Currently this case is being handled in Store.tsx, but if we passed
  // status into ProductList, we could handle that case here. Either way
  // works, but if it's handled here, then it makes ProductList more portable
  // and self contained.

  // Failsafe in case ProductList is passed !products.
  if (!products || !Array.isArray(products)) {
    return null
  }

  return (
    // <div className='mx-auto grid w-full grid-cols-1 place-content-center gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
    <div className='mx-auto grid auto-rows-[minmax(0px,auto)] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6'>
      {products.map((product) => {
        return <ProductItem key={product._id} product={product} />
      })}
    </div>
  )
}
