'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
import Link from "next/link";
//importar componente para deletar
import DeleteButton from "@/app/components/deleteButton";

interface Transactions {
    id: number,
    type: string,
    description: string,
    transation_date: string,
    observations: string
}

export default function Transaction (){
    // estado para armazenar dados de transação
    const [transaction, setTransaction] = useState <Transactions[]> ([])
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)
    //estado para controle da pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //estado para controle da ultima pagina
    const [lastPage, setLastPage] = useState <number> (3)

    //função para requisição tipo GET para a API
    const fetchTransaction = async (page: number) => {
        try {
            //iniciar loading
            setLoading(true)
            //requisição GET para a API
            const response = await instance.get(`/transaction/list?page=${page}&limit=3`)
            //atualisar estado com dados tretornados 
            setTransaction(response.data.data)
            //atualizar pagina atual
            setCurrentPage(response.data.currentPage)

            //terminar loading
            setLoading(false)
        } catch (error:any) {
            //atualizar estatos de erro 
            setError(`error nao foi possivel carregar registros: ${error}`)
            //terminar carregamento
            setLoading(false)        
        }finally{
            //terminar loading
            setLoading(false)
        }
    }
    //atualizar pagina de registros apos deletar
    const handleSuccess = () => {
        fetchTransaction(currentPage)
    }
    
    //hook pata atualizar dados quando a pagina mudar
    useEffect(() => {
        //recuperar mensagem sessionStorage
        const message = sessionStorage.getItem("successMessage")
        if (message) {
            setSuccess (message)
            sessionStorage.removeItem("successMessage")
        } 
        //atualizar a pagina
        fetchTransaction(currentPage)
    },[currentPage]) // atualiza os dados quando a paagina mudar  

    //função para controlar a mudança de magina 
    const handlePageChange = (page: number) => {
        if(page >= 1 && page <= lastPage){
            setCurrentPage(page)
        }
    }

    return (
        <div>

            <h1>Transaction List</h1>

            <a href="/transaction/create">Criar Transação</a>
            {/* mensagem caso nao exista registros */}
            {!loading && !error && transaction.length === 0 && (
                <p>Nenhum registro encontrado!</p>
            )}

            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && transaction.length === 0 &&  (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>type</th>
                            <th>description</th>
                            <th>transation_date</th>
                            <th>observations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.map((transaction) => (
                           <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.transation_date}</td>
                            <td>{transaction.observations}</td>
                            <td>
                                <Link href={`/transaction/${transaction.id}`}>visualizar</Link>
                                <Link href={`/transaction/edit?id=${transaction.id}`}> editar</Link>
                                <DeleteButton
                                    id={String(transaction.id)}
                                    route="transaction"
                                    onSuccess={handleSuccess}
                                    setError={setError}
                                    setSuccess={setSuccess}
                                />
                            
                            </td>
                        </tr>     
                        ))}
                    </tbody>
                </table>
            )}

            {/* criar paginação */}
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPaginationChange={setCurrentPage}
            />

        </div>
    )
}