import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { toyService } from './services/toy.service.js'

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

// App Configuration
app.use(express.static('public'))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
app.use(cors(corsOptions))


// **************** Toys API ****************:
// GET toys
app.get('/api/toy', (req, res) => {

  const { txt, inStock = null, pageIdx, sortBy, labels = [] , abc} = req.query
  console.log("🚀 ~ app.get ~ abc:", abc)

  const filterBy = { txt, inStock, pageIdx: +pageIdx, sortBy, labels }

  console.log('filterBy:', filterBy)
  toyService.query(filterBy)
    .then(toys => {
      res.send(toys)
    })
    .catch(err => {
      loggerService.error('Cannot load toys', err)
      res.status(500).send('Cannot load toys')
    })
})

app.get('/api/toy/:toyId', (req, res) => {

  const { toyId } = req.params

  toyService.get(toyId)
    .then(toy => {
      res.send(toy)
    })
    .catch(err => {
      loggerService.error('Cannot get toy', err)
      res.status(500).send(err)
    })
})

app.post('/api/toy', (req, res) => {

  const { name, price, labels } = req.body
  const toy = {
    name,
    price: +price,
    labels,
  }

  toyService.save(toy)
    .then(savedToy => {
      res.send(savedToy)
    })
    .catch(err => {
      loggerService.error('Cannot add toy', err)
      res.status(500).send('Cannot add toy')
    })
})

app.put('/api/toy', (req, res) => {

  const { name, price, _id, labels } = req.body
  const toy = {
    _id,
    name,
    price: +price,
    labels,
  }

  toyService.save(toy)
    .then(savedToy => {
      res.send(savedToy)
    })
    .catch(err => {
      loggerService.error('Cannot update toy', err)
      res.status(500).send('Cannot update toy')
    })
})

app.delete('/api/toy/:toyId', (req, res) => {

  const { toyId } = req.params

  toyService.remove(toyId)
    .then(msg => {
      res.send({ msg, toyId })
    })
    .catch(err => {
      loggerService.error('Cannot delete toy', err)
      res.status(500).send('Cannot delete toy, ' + err)
    })
})

// Fallback
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

// Listen will always be the last line in our server!
const port = 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
