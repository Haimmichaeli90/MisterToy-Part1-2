import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Loader } from '../cmps/Loader'
import { PaginationButtons } from '../cmps/PaginationButtons'
import { ToyFilter } from '../cmps/ToyFilter'
import { ToyList } from '../cmps/ToyList'
import { ToySort } from '../cmps/ToySort'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadToys, removeToyOptimistic, setFilter } from '../store/actions/toy.actions'

export function ToyIndex() {
  const toys = useSelector(storeState => storeState.toyModule.toys)
  const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
  const isLoading = useSelector(storeState => storeState.toyModule.isLoading)

  useEffect(() => {
    console.log('filterBy:', filterBy)
    loadToys()
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('Cannot load toys')
      })
  }, [filterBy])

  function onRemoveToy(toyId) {
    removeToyOptimistic(toyId)
      .then(() => {
        showSuccessMsg('Toy removed')
      })
      .catch(err => {
        console.log('Cannot remove toy', err)
        showErrorMsg('Cannot remove toy')
      })
  }

  function onSetFilter(filterBy) {
    setFilter({ ...filterBy, pageIdx: 0 })
  }

  function onSetSort(sortBy) {
    setFilter({ sortBy })
  }

  function setPageIdx(pageIdx) {
    setFilter({ pageIdx })
  }
  const { inStock, labels, txt } = filterBy
  return (
    <section className="toy-index">
      <ToyFilter
        filterBy={{ inStock, labels, txt }}
        onSetFilter={onSetFilter}
      />
      <ToySort
        sortBy={filterBy.sortBy}
        onSetSort={onSetSort}
      />
      <button>
        <Link to="/toy/edit">Add Toy</Link>
      </button>
      <PaginationButtons
        pageIdx={filterBy.pageIdx}
        setPageIdx={setPageIdx}
        toysLength={toys.length}
      />
      {isLoading
        ? <Loader />
        : <ToyList toys={toys} onRemoveToy={onRemoveToy} />}
    </section>
  )
}
