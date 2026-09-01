'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
//importar biblioteca para links
import Link from "next/link";
// importar componente botão de deletar
import DeleteButton from "@/app/components/deleteButton";
// importar componente de layout
import Layout from "@/app/components/layout";


interface Category{
    id: number,
    name: string,
    type: string,
    userId: number
}

export default function Categories(){
    //estado para receber dados da entidade
    const [categories, setCategories] = useState <Category[]> ([])    
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de successo
    const [success, setSuccess] = useState <string | null> (null)
    //estado para controle da pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //estado para controle da ultima pagina
    const [lastPage, setLastPage] = useState <number> (1)

    //função para realizar requisição para a API
    const fetchCategories = async (page: number) => {
        try {
            //iniciar carregamento
            setLoading(true)
            //realiazar requisição
            const response = await instance.get(`/categories/list?page=${page}&limit=3`)
            //atualizar dados de categoria com a resposata da API
            setCategories(response.data.data)
            //atualizar pagina atual
            setCurrentPage(response.data.currentPage)
            //atualizar ultima pagina
            setLastPage(response.data.lastPage)
            //terminar carregamento 
            setLoading(false)

        } catch (error:any) {
             //atualizar estatos de erro 
            setError(`error nao foi possivel carregar registros: ${error}`)
            //terminar carregamento
            setLoading(false) 
        }
    } 
    //atualizar pagina de registros quando deletar 
    const handleSuccess = () => {
        fetchCategories(currentPage)
    }

    // hook para buscar dados da primeira henderização
    useEffect(() => {
        //recuperar mensagem sessionStorage
        const message = sessionStorage.getItem("successMessage")
        if (message) {
            setSuccess (message)
            sessionStorage.removeItem("successMessage")
        } 
        fetchCategories(currentPage)
    },[currentPage])

    //função para controlar a mudança de paginas
    const handlePageChange = (page:number) => {
        if(page >= 1 && page <= lastPage){
            setCurrentPage(page)
        }
    }

    return (
        <Layout>
            {/* <a href="/categories/create">Criar Categoria</a> */}
            {/* mensagem caso nao exista registros */}
            {/* {!loading && !error && categories.length === 0 && (
                <p>Nenhum registro encontrado!</p>
            )} */}
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
                            <h2 className="content-title">Categorias</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <span>Categorias</span>
                            </nav>
                        </div>
                    </div>
                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Categorias</h3>
                            <div className="content-box-btn">
                                <a href={`/categories/create`} className="btn-success aling-icon-btn">
                                    {/* <!-- svg plus-circle (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>Cadastrar categoria</span>
                                </a>
                            </div>
                        </div>
                        {/* <!-- Criação da tabela com Usuarios (ações) --> */}
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr className="table-row-header">
                                        <th className="table-header">id</th>
                                        <th className="table-header">name</th>
                                        <th className="table-header">type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((categories) => (
                                    <tr key={categories.id} className="table-row-body">
                                        <td className="table-body">{categories.id}</td>
                                        <td className="table-body">{categories.name}</td>
                                        <td className="table-body">{categories.type}</td>
                                        <td className="table-body table-actions">
                                            <Link href={`/categories/${categories.id}`} className="btn-primary">visualizar</Link>
                                            <Link href={`/categories/edit?id=${categories.id}`} className="btn-warning hidden md:inline-block">editar</Link>
                                            <DeleteButton
                                                id={String(categories.id)}
                                                route="categories"
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
                    </div>
                </main>
            )}
        </Layout>
    )
}