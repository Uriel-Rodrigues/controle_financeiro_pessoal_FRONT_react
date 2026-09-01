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
//importar componente de Layout
import Layout from "@/app/components/layout";

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
        <Layout>
            {/* transaction.length === 0 && */}

            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Transações</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <span>Transações</span>
                            </nav>
                        </div>
                    </div>

                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Transações</h3>
                            <div className="content-box-btn">
                                <a href={`/transaction/create`} className="btn-success aling-icon-btn">
                                    {/* <!-- svg plus-circle (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                    <span>Cadastrar</span>
                                </a>
                            </div>
                        </div>
                         {/* <!-- Criação da tabela com transações (ações) --> */}
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr className="table-row-header">
                                        <th className="table-header">id</th>
                                        <th className="table-header">Tipo</th>
                                        <th className="table-header">Descrição</th>
                                        <th className="table-header">Data da Transação</th>
                                        <th className="table-header">Observações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.map((transaction) => (
                                    <tr key={transaction.id} className="table-row-body">
                                        <td className="table-body">{transaction.id}</td>
                                        <td className="table-body">{transaction.type}</td>
                                        <td className="table-body">{transaction.description}</td>
                                        <td className="table-body">{transaction.transation_date}</td>
                                        <td className="table-body">{transaction.observations}</td>
                                        <td className="table-body">
                                            <Link href={`/transaction/${transaction.id}`} className="btn-primary">visualizar</Link>
                                            <Link href={`/transaction/edit?id=${transaction.id}`} className="btn-warning hidden md:inline-block"> editar</Link>
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
                        </div>
                        {/* mensagem caso nao exista registros */} 
                        {!loading && !error && transaction.length === 0 && (
                        <span className="content-box-title">Nenhum registro encontrado!</span>   
                        )}
                        {/* criar paginação */}
                        <Pagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            onPaginationChange={setCurrentPage}
                        />
                    </div>
                </main>
            )}

        </Layout>
    )
}