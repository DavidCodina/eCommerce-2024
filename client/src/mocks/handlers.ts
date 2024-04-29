import { rest } from 'msw'
// More on msw: https://www.udemy.com/course/react-testing-library/learn/lecture/35551120#overview
export const handlers = [
  rest.get('http://localhost:3030/scoops', (_req, res, ctx) => {
    // It's important to return res().
    return res(
      ctx.json([
        { name: 'Chocolate', imagePath: '/images/chocolate.png' },
        { name: 'Vanilla', imagePath: '/images/vanilla.png' }
      ])
    )
  }),
  rest.get('http://localhost:3030/toppings', (_req, res, ctx) => {
    return res(
      ctx.json([
        { name: 'Cherries', imagePath: '/images/cherries.png' },
        { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
        { name: 'Hot fudge', imagePath: '/images/hot-fudge.png' }
      ])
    )
  }),
  rest.post('http://localhost:3030/order', (_req, res, ctx) => {
    return res(ctx.json({ orderNumber: 123455676 }))
  })
]
