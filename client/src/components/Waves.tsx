import React from 'react'

/* =============================================================================
                                Waves
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// https://getwaves.io
//
// Gotcha: Initially Waves had zIndex: -1 on the top-level element.
// This worked well for the longest time. Then I changed the layout
// such that the top-level element in MainLayout conditionally rendered
// a background color based on the theme (i.e., light/dark) mode.
// That's when the zIndex: -1 here stopped working well. It effectively,
// rendered Waves BEHIND the background color, which is definitely not good.
// Conversely, removing zIndex: -1 caused Waves to render on top of any page
// content. Placing <Waves /> at the top of the content did not make a difference.
// Ultimately, this is what needs to happen to properly use <Waves />. The important
// part is the 'relative' style on the content container.
//
// Usage:
//
//   return (
//     <Fragment>
//       <Waves />
//       <div className='relative 2xl:container flex-1 mx-auto w-full p-6'>
//         Content here sits on top of <Waves .>...
//       </div>
//   </Fragment>
//
////////////////////////////////////////////////////////////////////////////////

const Waves = () => {
  /* ======================
          return
  ====================== */

  return (
    <div
      style={{
        bottom: '-5vw',
        left: 0,
        position: 'fixed',
        width: '100%'
      }}
    >
      <svg
        style={{
          bottom: 0,
          position: 'absolute',
          left: '-10%',
          width: '125%'
        }}
        viewBox='0 0 1440 320'
      >
        <path
          fill='#00b5e2'
          fillOpacity='0.75'
          d='M0,96L30,117.3C60,139,120,181,180,192C240,203,300,181,360,165.3C420,149,480,139,540,154.7C600,171,660,213,720,218.7C780,224,840,192,900,160C960,128,1020,96,1080,122.7C1140,149,1200,235,1260,234.7C1320,235,1380,149,1410,106.7L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z'
        ></path>
      </svg>

      <svg
        viewBox='0 0 1440 320'
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0
        }}
      >
        <path
          fill='#409'
          fillOpacity='0.75'
          d='M0,32L11.4,64C22.9,96,46,160,69,170.7C91.4,181,114,139,137,128C160,117,183,139,206,154.7C228.6,171,251,181,274,176C297.1,171,320,149,343,160C365.7,171,389,213,411,218.7C434.3,224,457,192,480,176C502.9,160,526,160,549,170.7C571.4,181,594,203,617,208C640,213,663,203,686,186.7C708.6,171,731,149,754,128C777.1,107,800,85,823,80C845.7,75,869,85,891,128C914.3,171,937,245,960,256C982.9,267,1006,213,1029,181.3C1051.4,149,1074,139,1097,154.7C1120,171,1143,213,1166,197.3C1188.6,181,1211,107,1234,112C1257.1,117,1280,203,1303,208C1325.7,213,1349,139,1371,90.7C1394.3,43,1417,21,1429,10.7L1440,0L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z'
        ></path>
      </svg>
    </div>
  )
}

export { Waves }
