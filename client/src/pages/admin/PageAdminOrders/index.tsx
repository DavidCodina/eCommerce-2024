import { useState, useEffect } from 'react'

// Custom imports
import { sleep } from 'utils'
import { useTitle } from 'hooks'
import { Alert, HR } from 'components'
import { useThemeContext } from 'contexts'
import { adminGetOrders } from 'clientAPI/adminGetOrders'
import { OrderTable } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================
                                PageAdminOrders
======================================================================== */

const PageAdminOrders = () => {
  useTitle('Admin Orders')
  const { mode } = useThemeContext()

  /* ======================
        state & refs
  ====================== */

  const [orders, setOrders] = useState<Order[] | null>(null)

  const [ordersStatus, setOrdersStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setOrdersStatus('pending')
    adminGetOrders()
      .then(async (json) => {
        await sleep(1500)

        const { success, data } = json

        if (success === true && Array.isArray(data)) {
          setOrders(data)
          setOrdersStatus('success')
        } else {
          setOrdersStatus('error')
        }

        return json
      })
      .catch((err) => {
        setOrdersStatus('error')
        return err
      })
  }, [])

  /* ======================
        renderOrders()
  ====================== */

  const renderOrders = () => {
    if (ordersStatus === 'error') {
      return (
        <Alert
          className='alert-red mx-auto my-12 max-w-2xl'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
          rightSection={
            <button
              className={`${Alert.redButtonFix} flex w-full active:scale-[0.99]`}
              onClick={() => {
                setOrdersStatus('pending')

                adminGetOrders()
                  .then(async (json) => {
                    await sleep(1500)

                    const { success, data } = json

                    if (success === true && Array.isArray(data)) {
                      setOrders(data)
                      setOrdersStatus('success')
                    } else {
                      setOrdersStatus('error')
                    }

                    return json
                  })
                  .catch((err) => {
                    setOrdersStatus('error')
                    return err
                  })
              }}
              style={{ minWidth: 100 }}
            >
              Retry
            </button>
          }
          rightClassName='items-end flex'
          centerClassName='flex-1'
        >
          <Alert.Heading>Error!</Alert.Heading>

          <p className='text-sm'>Unable to get orders.</p>
        </Alert>
      )
    }

    if (ordersStatus === 'pending') {
      return (
        <section className='mb-6 animate-pulse rounded-lg border border-neutral-400 bg-white [animation-duration:1000ms]'>
          <div className='flex h-[40px] border-b border-neutral-400 bg-neutral-200'>
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />

            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />

            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1' />
          </div>

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] border-b border-neutral-400 bg-neutral-100' />

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] border-b border-neutral-400 bg-neutral-100' />

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] bg-neutral-100' />
        </section>
      )
    }

    if (ordersStatus === 'success' && Array.isArray(orders)) {
      return <OrderTable orders={orders} />
    }

    return null
  }

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
      <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
        <h1
          className='text-center text-5xl font-black'
          style={{ position: 'relative', marginBottom: 24 }}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow:
                '0px 0px 1px rgba(0,0,0,1), 0px 0px 1px rgba(0,0,0,1)',
              width: '100%',
              height: '100%'
            }}
          >
            Admin Orders
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Admin Orders
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        {renderOrders()}
      </div>
    </div>
  )
}

export default PageAdminOrders
