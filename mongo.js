const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://riboh:${password}@cluster0.mbbfu57.mongodb.net/phonebook_db?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: '',
  number: "",
})

Person.find({}).then(result=>{
  result.forEach(person => {
    console.log(person.name, person.number)    
  })
  mongoose.connection.close()
})

// person.save().then(result => {
//   process.argv.forEach((name,number)=>{
//     console.log(process.argv.length)
//     console.log(`${name} ${number}`)
//   })
//   //console.log(process.argv[3], process.argv[4])
//   mongoose.connection.close()
// })

