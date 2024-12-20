import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { saveToy } from '../store/actions/toy.actions'

export function ToyEdit() {
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())

  const { toyId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!toyId) return
    loadToy()
  }, [])

  function loadToy() {
    toyService.getById(toyId)
      .then(setToyToEdit)
      .catch(err => {
        console.log('Had issued in toy edit:', err)
        navigate('/toy')
        showErrorMsg('Toy not found!')
      })
  }

  function handleChange({ target }) {
    const field = target.name
    const value = target.type === 'number' ? +target.value || '' : target.value
    setToyToEdit(prevToy => ({ ...prevToy, [field]: value }))
  }

  function handleLabelChange({ target }) {
    const value = target.value
    setToyToEdit(prevToy => {
      let newLabels
      if (prevToy.labels.includes(value)) {
        newLabels = prevToy.labels.filter(label => label !== value)
      } else {
        newLabels = [...prevToy.labels, value]
      }
      return { ...prevToy, labels: newLabels }
    })
  }

  function onSaveToy(ev) {
    ev.preventDefault()
    saveToy(toyToEdit)
      .then(() => {
        showSuccessMsg('Toy saved successfully')
        navigate('/toy')
      })
      .catch(err => {
        showErrorMsg('Cannot save toy')
      })
  }

  const { name, price, labels: toyLabels } = toyToEdit
  const labels = toyService.getToyLabels()

  return (
    <section className="toy-edit">
      <h2>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h2>

      <form onSubmit={onSaveToy}>
        <label htmlFor="name">Name:</label>
        <input
          onChange={handleChange}
          value={name}
          type="text"
          name="name"
          id="name"
          required
        />

        <label htmlFor="price">Price:</label>
        <input
          onChange={handleChange}
          value={price}
          type="number"
          name="price"
          id="price"
          min={1}
          required
        />

        <label>Labels:</label>
        <div className="labels-container">
          {labels.map(label => (
            <div key={label}>
              <input
                type="checkbox"
                id={label}
                value={label}
                checked={toyLabels.includes(label)}
                onChange={handleLabelChange}
              />
              <label htmlFor={label}>{label}</label>
            </div>
          ))}
        </div>

        <button>{toyToEdit._id ? 'Save' : 'Add'}</button>
      </form>
    </section>
  )
}
