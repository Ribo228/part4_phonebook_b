const Person = require('../models/person')
const User = require('../models/user')

const initialPersons = [
  {
    name: 'Ribo Db',
    number: '0449817322',
   },
  {
    name: 'Ribo 2009',
    number: '789654',
  },
]

const nonExistingId = async () => {
    const person = new Person({name: 'willremovethisoon'})
    await person.save()
    await person.deleteOne()
    //await person.remove()

    return person._id.toString()
}

const personsInDb = async () => {
    const persons = await Person.find({})
    return persons.map(person => person.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON()) 
}

module.exports = {
    initialPersons, nonExistingId, personsInDb, usersInDb
}