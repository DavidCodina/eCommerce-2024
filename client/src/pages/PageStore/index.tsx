// Custom imports
import { useTitle } from 'hooks'
import { Waves } from 'components'
import { useThemeContext } from 'contexts'
import { Store } from './Store'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================

======================================================================== */

const PageStore = () => {
  useTitle('Store')
  const { mode } = useThemeContext()

  /* ======================
          return
  ====================== */

  return (
    <div
      className={`
      mx-auto flex w-full flex-1 flex-wrap`}
      style={{
        backgroundImage: mode === 'dark' ? darkBackgroundImage : backgroundImage
      }}
    >
      <Waves />

      <div
        className='relative mx-auto w-full flex-1 p-6 2xl:container'
        style={{ paddingTop: 52 + 24 }} // Offset the <StoreNav />
      >
        <Store />
      </div>
    </div>
  )
}

export default PageStore
