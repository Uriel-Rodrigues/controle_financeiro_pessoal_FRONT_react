'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de paginação
import Pagination from "@/app/components/pagination";
//importar biblioteca para criar links para navegção
import Link from "next/link";
//importar botão para deletar registro
import DeleteButton from "@/app/components/deleteButton";
//importar componente de proteção de rotas 
import ProtectedRoute from "@/app/components/protectedRoute";

interface User {
    id: number,
    name: string,
    email: string,
}

export default function UserList() {
    //criar estado para armazenar dados do usuario 
    const [user, setUser] = useState <User[]> ([])
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

    //função que fara a requisição e recupera os dados da API
    const fetchUser = async (page: number) => {
        try {
            //iniciar o carregamento 
            setLoading(true)
            //realizar requisição
            const response = await instance.get(`/users/list?page=${page}&limit=3`) 
            //atualizar os dados com o que vem da requisição
            setUser(response.data.data) 
            //atualizar pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar carregamento 
            setLoading(false)

        } catch (error) {
            //atualizar estatos de erro 
            setError(`error nao foi possivel carregar registros: ${error}`)
            //terminar carregamento
            setLoading(false)
        }
    }

    //função para atualizar lista quando deletar um registro
    const handleSuccess = () => {
        fetchUser(currentPage)
    }

    //hook para buscar dados da primeira henderização
    useEffect (() =>{
        //buscar mensagem registrada no sessionStorange
        const message = sessionStorage.getItem("messageSuccess")
        if(message){
            setSuccess(message)
            sessionStorage.removeItem("messageSuccess")
        }

        //atualizar a pagina
        fetchUser(currentPage)
    },[currentPage])
    
    //função para controlar a mudança de paginas
    const handlePageChange = (page: number) =>{
        if(page >= 1 && page <= lastPage){
            setCurrentPage(page)
        }
    }

    return (
        <ProtectedRoute>

            <h1>User List</h1>

            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar tabela com registros se tudo ok */}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((user) => (
                           <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link href={`/users/${user.id}`}>visualizar</Link> {` `}
                                <Link href={`/users/edit?id=${user.id}`}> editar</Link> {` `}
                                <DeleteButton
                                    id={String(user.id)}
                                    route="users"
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

        </ProtectedRoute>
    )
}