import { isEqual } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { toyService } from '../services/toy.service'
import { utilService } from '../services/util.service'

const toyLabels = toyService.getToyLabels()

export function ToyFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  const [activeLabels, setActiveLabels] = useState(filterBy.labels || [])  // Initialize with the filterBy.labels

  const debouncedOnSetFilter = useRef(utilService.debounce(onSetFilter, 300))

  useEffect(() => {
    debouncedOnSetFilter.current(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === 'select-multiple') {
      value = Array.from(target.selectedOptions, option => option.value)  || []
    }

    value = (type === 'number') ? +value || '' : value
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function handleLabelClick(label) {
    setActiveLabels(prevLabels => {
      const newLabels = prevLabels.includes(label)
        ? prevLabels.filter(l => l !== label)
        : [...prevLabels, label]

      setFilterByToEdit(prev => ({
        ...prev,
        labels: newLabels,
      }))

      return newLabels
    })
  }

  const { txt, inStock, labels } = filterByToEdit

  return (
    <section className="toy-filter">
      <form >
        <input
          onChange={handleChange}
          value={txt}
          type="text"
          placeholder="Search"
          name="txt"
        />

        <select name="inStock" value={inStock || ''} onChange={handleChange}>
          <option value="">All</option>
          <option value="true">In Stock</option>
          <option value="false">Not in stock</option>
        </select>

        {/* Labels container */}
        <div className="labels-container">
          {toyLabels.map(label => (
            <div
              key={label}
              className={`label-item ${activeLabels.includes(label) ? 'active' : ''}`}
              onClick={() => handleLabelClick(label)}
            >
              {label}
            </div>
          ))}
        </div>

        {/* <button>SUBMIT</button> */}
      </form>
    </section>
  )
}
