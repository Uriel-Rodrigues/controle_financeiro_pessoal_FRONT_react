'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
import {useSearchParams } from "next/navigation";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar biblioteca de validação de formulario
import * as yup from "yup"
//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
// importar componente de Layout
import Layout from "@/app/components/layout";

//esquema para validação de formulario
const schema = yup.object().shape({
    name: yup.string().required("nome de usuario obrigatorio!"),
    email: yup.string().email().required("email de usuario obrigatorio!")
})

interface User {
    name: string,
    email:string
}

export default function User () {
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de seccesso
    const [success, setSuccess] = useState <string | null> (null)  

    //hook para validação do formulario
    const {register, handleSubmit, formState: {errors}, reset} =useForm({
        resolver: yupResolver(schema)
    })

    //função fazer requisição e capturar dados da API
    const fetchUser = async () => {
        try {
            //iniciar carregamento
            setLoading(true) 
            //requisição para a api para capturar dados
            const response = await instance.get(`/users/me`)
            //atualizar campo com dados resgatados
            reset({
                name: response.data.name,
                email: response.data.email
            })
            //finalizar loading
            setLoading(false)
        } catch (error:any) {
            //verificar se existe erro de validação
            if(error.response && error.response.data && error.response.data.message){
                //exibir mensagem caso seja um array (mais de 1 mensagem)
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join(" - "))
                }
                //exibir mensagem caso seja somente 1 mensagem
                else{
                    setError(error.response.data.message)
                }
            }
            else{
                //mensagem de erro
                setError(`ERROR nao foi possivel editar o registro: ${error}`)
            }            
        }
        finally{
            //finalizar loading            
            setLoading(false)
        }
    }

    //atuarlizar dados do Usuario 
    const onSubmit = async (data: User) => {
        try {
            //iniciar carregamento 
            setLoading(true)
            //atualizar os dados do usuario 
            const response = await instance.put(`/users/edit`,data)
            //mensagem de sucesso
            setSuccess(response.data.message)
            //finalizar loading
            setLoading(false)
        } catch (error: any) {
            //verificar se existe erro de validação
            if(error.response && error.response.data && error.response.data.message){
                //exibir mensagem caso seja um array (mais de 1 mensagem)
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join(" - "))
                }
                else{
                    //exibir mensagem caso seja somente 1 mensagem
                    setError(error.response.data.message)
                }
            }
            else{
                //retornar mensagem de erro
                setError(`ERROR nao foi possivel editar o registro: ${error}`)
            }
        }
        finally{
            //finalizar loading
            setLoading(false)
        }
    }

    //hook para atualizar a pagina quanto o id mudar
    useEffect (() => {
        fetchUser()
    },[]) // atualizar a pagina caso id mude

    return(
        <Layout>
            
            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar mensagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Editar Usuário</h2>
                            <nav className="breadcrumb">
                                <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/users/me`} className="breadcrumb-link">Meu Perfil</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>
                    
                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Dados de Usuário</h3>
                            <div className="content-box-btn">
                                <a href={`/users/me`} className="btn-primary aling-icon-btn">
                                    {/* <!-- svg eye (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <span>Vizualizar</span>
                                </a>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label htmlFor="nomeUsuario" className="form-label">Nome: </label>
                                <input 
                                    id="nomeUsuario"
                                    type="text"
                                    placeholder="Nome de usuario"
                                    {...register('name')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.name && <p>{errors.name.message}</p>}
                            </div>

                            <br />

                            <div className="mb-4">
                                <label htmlFor="userEmail" className="form-label">Email: </label>
                                <input 
                                    id="userEmail"
                                    type="email"
                                    placeholder="Email de usuario"
                                    {...register('email')} 
                                    className="form-input"
                                />
                            </div>

                            <br />
                            
                            <button type="submit" disabled = {loading} className="btn-success">
                                {loading ? "Atualizando..." : "Atualizar"}
                            </button>
                        </form>
                    </div>
                </main>
            )}   
        </Layout>
    )
}