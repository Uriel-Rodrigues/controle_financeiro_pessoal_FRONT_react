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
// importat componente de layout 
import Layout from "@/app/components/layout";
//importar componente de alerta 
import AlertMessage from "@/app/components/alertMessage";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";


interface Category {
    name: string,
    type: string
}

const schema = yup.object().shape({
    name: yup.string().required("Nome da categoria obrigatorio").min(5, "nome deve ter minimo de 5 caracteres"),
    type: yup.string().required("tipo da categoria é obrigatorio!")
})

export default function categories() {
    //estado para pegar dados da URL
    const id = Number(useSearchParams().get("id"))
    //estado para controle de loadig
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //hook ´para validação de formulario 
    const {register,handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função de requisição tipo GET para a API
    const fetchCategories = async () => {
        try {
            //iniciar loading
            setLoading(true)
            //realizar requisição para a API
            const response = await instance.get(`/categories/${id}`)
            //atualizar campos com dados do usuario
            reset({
                name: response.data.name,
                type: response.data.type
            })
            // finalizar loading
            setLoading(false)
        } catch (error: any) {
            //verificar se tem erro de validação
            if(error.response && error.response.data && error.response.message){
                //retornar erro caso seja um array 
                if(Array.isArray(error.response.message)){
                    setError(error.response.message.join(" - "))
                }
                else{
                    //retornar erro se nao for array
                    setError(error.response.message)
                }
            }
            else{
                //retornar mensagem de erro 
                setError(`error: impossivel pegar dados da categoria: ${error}`)
                //finalizar loading
                setLoading(false)
            }
        }finally{
            //finalizar loading
            setLoading(false)
        }
    }

    // função de requisição tipo PUT para a API
    const onSubmit = async (data: Category) => {
        try {
            //iniciar loading
            setLoading(true)
            //requisilçao - atualizar dados 
            const response = await instance.put(`/categories/${id}`, data)
            //retornar mensagem de sucesso
            setSuccess(response.data.message || "Categoria atualizada com sucesso")
            //finalizar loading
            setLoading(false)
        } catch (error: any) {
            //verificar se existe erro de requisição
            if(error.response && error.response.data && error.response.data.message){
                //retornar mensagem caso seja um array
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join(" - "))
                }
                //retornar mensagem se n for array
                else{
                    setError(error.response.data.message)
                }
            }
            else{
                //retornar mensagem de erro 
                setError(`error impossivel atualizar dados: ${error}`)
                //finalizar loading
                setLoading(false)
            }            
        }finally{
            //finalizar loading
            setLoading(false)
        }
    }
    
    //hook para atualizar a pagina quanto o id mudar
    useEffect (() => {
        if(id){
            fetchCategories()
        }
    },[id]) // atualizar a pagina caso id mude

    return(
        <Layout>
            {/* mostrar carregando  */}
            {loading && <LoadingSpinner/>}
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
                            <h2 className="content-title">Categorias</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/categories/list`} className="breadcrumb-link">Categorias</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>
                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Editar Categoria</h3>
                            <div className="content-box-btn">
                                <a href={`/categories/list`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>

                                <a href={`/categories/${id}`}  className="btn-primary aling-icon-btn">
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
                                <label htmlFor="nomeCategory" className="form-label">Nome: </label>
                                <input 
                                    id="nomeCategory"
                                    type="text"
                                    placeholder="Nome da categoria"
                                    {...register('name')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.name && <AlertMessage type="error" message={errors.name.message ?? null}/>}
                            </div>

                            <br />

                            <div>
                                <label htmlFor="typeCategory" className="form-label">Tipo: </label>
                                <select 
                                    id="typeCategory"
                                    {...register("type")}
                                    className="form-input"
                                    >
                                    <option value="income" style={{color:"#000000"}}>Receita</option>
                                    <option value="expense" style={{color:"#000000"}}>Despesa</option>

                                </select>
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