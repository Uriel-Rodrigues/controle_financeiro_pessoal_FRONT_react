'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
//importar biblioteca para links
import Link from "next/link";
import DeleteButton from "@/app/components/deleteButton";

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
            const response = await instance.get(`categories/list?page=${page}&limit=3`)
            //atualizar dados de categoria com a resposata da API
            setCategories(response.data.data)
            //atualizar pagina atual
            setCurrentPage(response.data.currentPage)
            //atualizar ultima pagina
            setCurrentPage(response.data.lastPage)
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
        <div>

            <h1>Categories List</h1>
            <a href="/categories/create">Criar Categoria</a>
            {/* mensagem caso nao exista registros */}
            {!loading && !error && categories.length === 0 && (
                <p>Nenhum registro encontrado!</p>
            )}
            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && categories.length === 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((categories) => (
                           <tr key={categories.id}>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.type}</td>
                            <td>
                                <Link href={`/categorie/${categories.id}`}>visualizar</Link>
                                <Link href={`/categorie/${categories.id}`}>editar</Link>
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