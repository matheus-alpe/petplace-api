import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import { routes } from './routes/UserRoutes'

createConnection()

const app = express()

app.use(express.json())
app.use(routes)

app.listen(3333, () => {
    console.log('running on 3333')
})
