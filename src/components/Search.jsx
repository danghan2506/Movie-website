import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
const setSearchTermHandler = (e) => {
    setSearchTerm(e.target.value)
}
  return (
    <div className='search'>
        <div>
            <img src="./search.svg" alt='Search'></img>
            <input type='text' placeholder='Search your favourite movies!' value={searchTerm} onChange={setSearchTermHandler}></input>
        </div>
    </div>
  )
}

export default Search
