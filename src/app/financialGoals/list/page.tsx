'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
import Link from "next/link";
import DeleteButton from "@/app/components/deleteButton";

interface Financial {
    id: number,
    title: string,
    description: string
    target_amount: number,
    current_amount: number,
    target_date: string,
    status: string,
    usersId: number
}

export default function FinancialGoals() {
    //estado para armazenar dados das metas
    const [financialGoals, setFiancialGoals] = useState <Financial[]> ([])
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de successo
    const [success, setSuccess] = useState <string | null> (null)
    //estado para controle da pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //estado para controle da ultima pagina
    const [lastPage, setLastPage] = useState <number> (3)

    //função de requisição de captura de dados para a API
    const fetchFinancialGoals = async (page:number) => {
        try {
            //iniciar loading
            setLoading(true)
            //fazer requisição
            const response = await instance.get(`/financialGoals/list?page=${page}&limit=3`)
            //atualizar metas com resposta da api
            setFiancialGoals(response.data.data)
            //atualizar pagina
            setCurrentPage(response.data.currentPage) 
            //finalizar loading
            setLoading(false)

        } catch (error: any) {
            //atualizar estatos de erro 
            setError(`error nao foi possivel carregar registros: ${error}`)
            //terminar carregamento
            setLoading(false)  
        }
    }
    //atualizar pagina de registros apos deletar
    const handleSuccess = () => {
        fetchFinancialGoals(currentPage)
    }

    //hook para obter dados da primeira renderização 
    useEffect(() => {
        //recuperar mensagem sessionStorage
        const message = sessionStorage.getItem("successMessage")
        if (message) {
            setSuccess (message)
            sessionStorage.removeItem("successMessage")
        } 
        fetchFinancialGoals(currentPage)
    },[currentPage])

    // função para controlar a mudança de pagina
    const handlePageChange = (page:number) =>{
        if(page >= 1 && page <=lastPage){
            setCurrentPage(page)
        }
    }

return (
        <div>

            <h1>Financial Goals List</h1>
            <br />
            <a href="/transaction/create">Criar Meta</a> <br />
            <br />
            {/* mensagem caso nao exista registros */}
            {!loading && !error && financialGoals.length === 0 && (
                <p>Nenhum registro encontrado!</p>
            )}
            <br />
            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && financialGoals.length != 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>title</th>
                            <th>description</th>
                            <th>target_amount</th>
                            <th>current_amount</th>
                            <th>target_date</th>
                            <th>status</th>                         
                        </tr>
                    </thead>
                    <tbody>
                        {financialGoals.map((financialGoals) => (
                           <tr key={financialGoals.id}>
                            <td>{financialGoals.id}</td>
                            <td>{financialGoals.title}</td>
                            <td>{financialGoals.description}</td>
                            <td>{financialGoals.target_amount}</td>
                            <td>{financialGoals.current_amount}</td>
                            <td>{financialGoals.target_date}</td>
                            <td>{financialGoals.status}</td>
                            <td>
                                <Link href={`/financialGoals/${financialGoals.id}`}>visualizar</Link> -
                                <Link href={`/financialGoals/edit?id=${financialGoals.id}`}>editar</Link> -
                                <DeleteButton
                                    id={String(financialGoals.id)}
                                    route="financialGoals"
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