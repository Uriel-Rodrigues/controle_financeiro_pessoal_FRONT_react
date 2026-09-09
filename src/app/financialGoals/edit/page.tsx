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
//importar componente de layout
import Layout from "@/app/components/layout";
//importar componente de alerta
import AlertMessage from "@/app/components/alertMessage";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";


interface Financial{
    title: string,
    description: string
    target_amount: number,
    current_amount: number,
    target_date: string,
    status: string,
    usersId: number
}

const schema = yup.object().shape({
    title: yup.string().required("campo titulo é obrigatorio!"),
    description: yup.string().required("campo descrição é obrigatorio!").min(3, "a descrição deve ter minimo de 3 caracteres"),  
    target_amount: yup.number().required("campo valor alvo é obrigatorio!").typeError("o campo deve ser um numero!"), 
    current_amount: yup.number().required("campo valor atual é obrigatorio!").typeError("o campo deve ser um numero!"),
    target_date: yup.string().required("campo para data da meta é obriogatorio!"),
    status: yup.string().required("status do objetivo fincanceiro é obrigatorio! active ou completed"),
    usersId: yup.number().required()
})

export default function FinancialGoals() {
    // estado para aemazenar o ID  quem pela URL
    const id = Number(useSearchParams().get("id"))
    //estado para controle de loadig
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    // hook de verificação de formulario
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função de requisição tipo GET para a API 
    const fetchFinancialGoals = async () => {
        try {
            // inicia carregamento 
            setLoading(true)
            //solicitação GET para a API
            const response = await instance.get(`/financialGoals/${id}`)
            //atualizar campos dos formulario
            reset({
                title: response.data.title,
                description: response.data.description,
                target_amount: response.data.target_amount,
                current_amount: response.data.current_amount,
                target_date: response.data.target_date,
                status: response.data.status,
                usersId: response.data.usersId
            })
            //finalizar loading
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
        } finally{
            //finalizar loading
            setLoading(false)
        }
    }

    // função de requisição tipo PUT para a API
    const onSubmit = async (data:Financial) => {
        try {
            //iniciar loading
            setLoading(true)
            //salvar dados atualizados
            const response = await instance.put(`/financialGoals/${id}`,data) 
            //mostrar mensagem de sucesso
            setSuccess(response.data.message || "Registro atualizados com sucesso") 
            //terminar carregamento
            setLoading(false) 

        } catch (error:any) {
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
        } finally{
            //finalizar loading
            setLoading(false)
        }
    }
    
    //hook para atualizar a pagina quando o id mudar
    useEffect(() => {
        if(id){
            fetchFinancialGoals()
        }
    },[id]) 

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

                // conteudo principal
                <main className="main-content">
                    {/* titulo e trilha de navegação */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Metas Financeiras</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/financialGoals/list`} className="breadcrumb-link">Meta Financeira</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>

                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Editar Meta Financeira</h3>
                            <div className="content-box-btn">
                                <a href={`/financialGoals/list`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>

                                <a href={`/financialGoals/${id}`}  className="btn-primary aling-icon-btn">
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
                                <label htmlFor="titleFinancial" className="form-label">Titulo: </label>
                                <input 
                                    id="titleFinancial"
                                    type="text"
                                    placeholder="Titulo da meta financeira"
                                    {...register('title')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.title && <AlertMessage type="error" message={errors.title.message ?? null}/>}
                            </div>
                            <br />
                            
                            <div>
                                <label htmlFor="descriptionFinancial" className="form-label">Descrição: </label>
                                <input 
                                    id="descriptionFinancial"
                                    type="text"
                                    placeholder="Descrição"
                                    {...register('description')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.description && <AlertMessage type="error" message={errors.description.message ?? null}/>}
                            </div>
                            <br />
                            
                            <div>
                                <label htmlFor="targetAmountFinancial" className="form-label">Valor alvo: </label>
                                <input 
                                    id="targetAmountFinancial"
                                    type="text"
                                    placeholder="valor desejado"
                                    {...register('target_amount')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.target_amount && <AlertMessage type="error" message={errors.target_amount.message ?? null}/>}
                            </div>
                            <br />
                            
                            <div>
                                <label htmlFor="currentAmountFinancial" className="form-label">Valor atual: </label>
                                <input 
                                    id="currentAmountFinancial"
                                    type="text"
                                    placeholder="valor atual"
                                    {...register('current_amount')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.current_amount && <AlertMessage type="error" message={errors.current_amount.message ?? null}/>}
                            </div>
                            <br />
                            
                            <div>
                                <label htmlFor="targetDateFinancial" className="form-label">Data alvo: </label>
                                <input 
                                    id="targetDateFinancial"
                                    type="date"
                                    {...register('target_date')}
                                    className="form-input" 
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.target_date && <AlertMessage type="error" message={errors.target_date.message ?? null}/>}
                            </div>
                            <br />

                            <div>
                                <label htmlFor="statusFinancial" className="form-label">Status: </label>
                                <select 
                                    id="statusFinancial"
                                    {...register("status")}
                                    className="border"
                                    >
                                    <option value="active" style={{color:"#000000"}}>Ativa</option>
                                    <option value="completed" style={{color:"#000000"}}>Completa</option>
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