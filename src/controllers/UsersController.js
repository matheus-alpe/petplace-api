import { readFile, writeFile } from 'fs/promises'

const path = new URL('../../__mocks__/users.json', import.meta.url)
const users = JSON.parse(await readFile(path))

function findUserById(id) {
  return users.find(user => user.id === id)
}

export default {
  read (req, res) {
    const user = findUserById(req.params.id)
    res.status(200).send({ data: user })
  },

  update (req, res) {
    const { user } = req.body

    const index = users.findIndex(u => u.id === user.id)

    if (index === -1) {
      return res.status(418)
    }

    delete user.iat
    delete user.exp

    users.splice(index, 1, user)
      
    writeFile(path, JSON.stringify(users))
    res.status(200).send({ user })
  }
}
