const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Person = require('../models/person')
const User = require('../models/user')
const Note = require('../models/person')


describe('when there is initially some persons saved', () =>{
  beforeEach(async ()=> {
    await Person.deleteMany({})
    await Person.insertMany(helper.initialPersons)
  })

test('persons are returned as json', async () => {
  console.log('entered test')
})
 
test('phonebook are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all persons are returned', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(helper.initialPersons.length)
})

test('a person is within the returned persons', async () =>{
  const response = await api.get('/api/persons')
  const names = response.body.map(r => r.name)
  expect(names).toContain(
    'Ribo Db'
  )
})
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToView = personsAtStart[0]

    const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(resultPerson.body).toEqual(personToView)
  })
  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
    .get(`/api/persons/${validNonexistingId}`)
    .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () =>{
    const invalidId = '123456789'
    await api
    .get(`/api/persons/${invalidId}`)
    .expect(400)
  })

})

describe('addition of a new person', () =>{
  test('succeed with a valid data', async () =>{
    const newPerson = {
      name: "031023",
      number: "1111111"
    }
    await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const personAtEnd = await helper.personsInDb()
    expect(personAtEnd).toHaveLength(helper.initialPersons.length + 1)

    const names = personAtEnd.map(n => n.name)
    expect(names).toContain(
      '031023' )
  })
  // test('fails with status 400 if data invalid', async () => {
  //   const newPerson = {
  //     number: "22222"
  //   }
  //   await api
  //   .post('/api/persons')
  //   .send(newPerson)
  //   .expect(400)

  //   const personAtEnd = await helper.personsInDb()

  //   expect(personAtEnd).toHaveLength(helper.initialPersons.length)
  // })

})

// describe('deletion of a person', ()=> {
//   test('succeeds with status 204 if id is valid', async () => {
//     const personsAtStart = await helper.personsInDb()
//     const personToDelete = personsAtStart[0]
    
//     await api
//     .delete(`/api/persons/${personToDelete.id}`)
//     .expect(204)

//     const personAtEnd = await helper.personsInDb()
//     expect(personAtEnd).toHaveLength(helper.initialPersons.length - 1)
//     const names = personAtEnd.map(r => r.name)
//     expect(names).not.toContain(personToDelete.name)
//   })
// })
describe('when there is a initial user at db', () =>{
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: "root", passwordHash})
    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rnhu',
      name: 'Ribo Huang',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  
  test('creation fails with proper statuscode and message if username already exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })



})



afterAll(async () => {
  await mongoose.connection.close()
})