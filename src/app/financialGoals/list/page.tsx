'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
// importar biblioteca para incluir links
import Link from "next/link";
// importar componente botão de deletar
import DeleteButton from "@/app/components/deleteButton";
//importar componente de layout
import Layout from "@/app/components/layout";

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
        <Layout>
            {/* <a href="/transaction/create">Criar Meta</a> <br /> */}
            {/* financialGoals.length != 0 &&  */}
            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mensagem caso nao exista registros */}
            {/* {!loading && !error && financialGoals.length === 0 && (
                <p>Nenhum registro encontrado!</p>
            )} */}
            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Metas Financeiras</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <span>Metas Financeiras</span>
                            </nav>
                        </div>
                    </div>
                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Metas Financeiras</h3>
                            <div className="content-box-btn">
                                <a href={`/financialGoals/create`} className="btn-success aling-icon-btn">
                                    {/* <!-- svg user-plus (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                    </svg>
                                    <span>Cadastrar Meta</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Criação da tabela com Metas (ações) --> */}
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr className="table-row-header">
                                    <th className="table-header">id</th>
                                    <th className="table-header">title</th>
                                    <th className="table-header">description</th>
                                    <th className="table-header">target_amount</th>
                                    <th className="table-header">current_amount</th>
                                    <th className="table-header">target_date</th>
                                    <th className="table-header">status</th>                         
                                </tr>
                            </thead>
                            <tbody>
                                {financialGoals.map((financialGoals) => (
                                <tr key={financialGoals.id} className="table-row-body">
                                    <td className="table-body">{financialGoals.id}</td>
                                    <td className="table-body">{financialGoals.title}</td>
                                    <td className="table-body">{financialGoals.description}</td>
                                    <td className="table-body">{financialGoals.target_amount}</td>
                                    <td className="table-body">{financialGoals.current_amount}</td>
                                    <td className="table-body">{financialGoals.target_date}</td>
                                    <td className="table-body">{financialGoals.status}</td>
                                    <td>
                                        <Link href={`/financialGoals/${financialGoals.id}`} className="btn-primary">visualizar</Link>
                                        <Link href={`/financialGoals/edit?id=${financialGoals.id}`} className="btn-warning hidden md:inline-block">editar</Link>
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
                    </div>
                    
                    {/* criar paginação */}
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPaginationChange={setCurrentPage}
                    />
                </main>
            )}
        </Layout>
    )
}