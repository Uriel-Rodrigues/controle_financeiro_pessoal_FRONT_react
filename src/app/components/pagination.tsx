interface PaginationProps {
    currentPage: number,
    lastPage: number,
    onPaginationChange: (page: number) => void
}

const Pagination = ({currentPage, lastPage, onPaginationChange}: PaginationProps) => {
    return(
        <div className="btn-group-login">
            <span className="link-login">pagina {currentPage} de {lastPage}</span>{' '}
            <button onClick={() => onPaginationChange(currentPage - 1)} disabled = {currentPage === 1} className="link-login"> Anterior </button>{' '}

            <button disabled className="link-login">{currentPage}</button>{' '}

            <button onClick={() => onPaginationChange(currentPage + 1)} disabled ={lastPage === currentPage} className="link-login">Proxima</button>
        </div>
    )
} 

export default Pagination