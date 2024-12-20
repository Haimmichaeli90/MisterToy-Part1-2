import fs from 'fs/promises'; // חשוב להשתמש בגרסה עם promises של fs
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save,
}

const PAGE_SIZE = 5
let toys = [] // המערך יהיה ריק בהתחלה

// נטען את הנתונים באופן אסינכרוני
loadToys();

async function loadToys() {
  try {
    const data = await fs.readFile('data/toy.json', 'utf-8');
    toys = JSON.parse(data);
    console.log('Loaded toys:', toys);
  } catch (err) {
    loggerService.error('Error loading toys from file', err);
  }
}

function query(filterBy = {}) {
  console.log('Filter By:', filterBy)

  const regExp = new RegExp(filterBy.txt || '', 'i')
  let toysToReturn = toys.filter(toy => regExp.test(toy.name))

  if (filterBy.maxPrice) {
    toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.maxPrice)
  }

  if (filterBy.status) {
    if (filterBy.status === 'inStock') {
      toysToReturn = toysToReturn.filter(toy => toy.inStock === true)
    } else if (filterBy.status === 'notInStock') {
      toysToReturn = toysToReturn.filter(toy => toy.inStock === false)
    }
  }

  if (filterBy.pageIdx !== undefined) {
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    toysToReturn = toysToReturn.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return Promise.resolve(toysToReturn)
}

function getById(toyId) {
  const toy = toys.find(toy => toy._id === toyId)
  if (!toy) return Promise.reject('Toy not found')
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex(toy => toy._id === toyId)
  if (idx === -1) return Promise.reject('No Such Toy')

  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
    toyToUpdate.name = toy.name
    toyToUpdate.price = toy.price
    toyToUpdate.inStock = toy.inStock
  } else {
    toy._id = utilService.makeId()
    toy.createdAt = Date.now()
    toy.inStock = true // ברירת מחדל למלאי
    toys.push(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toy.json', data, err => {
      if (err) {
        loggerService.error('Cannot write to toys file', err)
        return reject(err)
      }
      resolve()
    })
  })
}
