'use client'
//importar componente para de botão deletar
import DeleteUserButton from "@/app/components/deleteUserButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
//hook para manipular a navegação do usuario 
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"
// importar componente de layout
import Layout from "@/app/components/layout"
// importar componente de alerta
import AlertMessage from "@/app/components/alertMessage";

interface User {
    name: string,
    email: string,
    created_at: string,
    updated_at: string
} 

export default function UserDetail () {
    //instancia o router 
    const router = useRouter()
    //estado para armazenar dados do susuario 
    const [user, setUser] = useState <User | null> (null)
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //requisição para a API
    const fetchUser = async () => {
        try {
            //iniciar carregamento
            setLoading(true) 
            //realizar requisição para a API
            const response = await instance.get(`/users/me`)
            //atualzar dados do usuario com o que foi retornado
            setUser(response.data)
            //terminar carregamento
            setLoading(false)  

        } catch (error) {
            //retornar mensagem em caso de erro
            setError(`erro nao foi possivel carregar o registro: ${error}`)
            //terminar carregamento
            setLoading(false)
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }

    // redirecionar usuario apos deletar registro
    const handleSuccess = ()=> {
        //setar mensagem apos deletar
        sessionStorage.setItem("messageSuccess", "registro deletado com sucesso")
        localStorage.removeItem("token")

        //manipular navegação do usuario 
        router.push(`/login`)
    }

    //hook buscar novos dados quando o id mudar
    useEffect(() =>{
        fetchUser()
    },[]) // recarrega a pagina quanto o id mudar

    return(
        <Layout>

            {/* mostrar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar mensagem de erro casotenha */}
            <AlertMessage type="error" message={error}/>
            {/* mostrar mensagem de success caso tenha */}
            <AlertMessage type="success" message={success}/>

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                // conteudo principal
                <main className="main-content">
                    {/* titulo e trilha de navegação */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Meu Perfil</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <span>Meu Perfil</span>
                            </nav>
                        </div>
                    </div>
                    {/* inicicio conteudo principal + botoes + titulo */}
                    <div>
                        <div className="content-box-header">
                            <h3 className="content-box-title">Visualizar Dados</h3>
                            <div className="content-box-btn">
                                <a href={`/users/resetPassword`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg lock-closed (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>

                                    <span>Atualizar senha</span>
                                </a>
                                <a href={`/users/edit`} className="btn-warning aling-icon-btn ">
                                    {/* <!-- svg pencil-square (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Editar</span>
                                </a>
                                {/* aplicando botão "deletar" */}
                                <DeleteUserButton
                                    route = "users"
                                    onSuccess={handleSuccess}
                                    setError={setError}
                                    setSuccess={setSuccess}
                                />
                            </div>
                        </div>

                        {/* detalhes do usuario */}
                        <div className="detail-box">

                            <div className="mb-1">
                                <span className="detail-content">Nome: {user?.name}</span> 
                            </div>
                            <br />

                            <div className="mb-1">
                                <span className="detail-content">Email: {user?.email}</span>
                            </div>
                            <br />

                            <div className="mb-1">
                                <span className="detail-content">Criado em: {user?.created_at}</span>
                            </div>
                            <br />

                            <div className="mb-1">
                                <span className="detail-content">Atualizado em: {user?.updated_at}</span>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </Layout>
    )
}