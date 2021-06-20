import cors from 'cors'
import express from 'express'
import { routes } from './routes.js'
import path from 'path'

var __dirname = path.resolve(path.dirname(''));

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/static', express.static(__dirname + '/pictures'));

app.use(routes)

app.use((req, res, next) => {
  res.status(404).send({ error: '404 - Not found' })
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))