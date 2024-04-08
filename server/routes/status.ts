import express from 'express'

const statusRouter = express.Router()

statusRouter.get('/status', (_, res) => {
  res.status(200).json({ status: 'OK' })
})

export default statusRouter
