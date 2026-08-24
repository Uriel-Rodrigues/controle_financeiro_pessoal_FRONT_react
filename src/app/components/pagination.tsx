interface PaginationProps {
    currentPage: number,
    lastPage: number,
    onPaginationChange: (page: number) => void
}

const Pagination = ({currentPage, lastPage, onPaginationChange}: PaginationProps) => {
    return(
        <div>
            <span>pagina {currentPage} de {lastPage}</span>{' '}
            <button onClick={() => onPaginationChange(currentPage - 1)} disabled = {currentPage === 1}> Anterior </button>{' '}

            <span>{currentPage}</span>{' '}

            <button onClick={() => onPaginationChange(currentPage + 1)} disabled ={lastPage === currentPage} >Proxima</button>
        </div>
    )
} 

export default Pagination