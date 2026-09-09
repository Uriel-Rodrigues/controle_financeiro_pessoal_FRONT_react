'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect, use } from "react";
//importar biblioteca de validação de formulario
import * as yup from "yup"
//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
// importar componente de Layout
import Layout from "@/app/components/layout";
//importar componente de alerta
import AlertMessage from "@/app/components/alertMessage";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";


interface FinancialGoals {
    title: string,
    description: string
    target_amount: number,
    current_amount: number,
    target_date: string,
    status: string,
}

const schema = yup.object().shape({
    title: yup.string().required("campo titulo é obrigatorio!"),
    description: yup.string().required("campo descrição é obrigatorio!").min(3, "a descrição deve ter minimo de 3 caracteres"),  
    target_amount: yup.number().required("campo valor alvo é obrigatorio!").typeError("o campo deve ser um numero!"), 
    current_amount: yup.number().required("campo valor atual é obrigatorio!").typeError("o campo deve ser um numero!"),
    target_date: yup.string().required("campo para data da meta é obriogatorio!"),
    status: yup.string().required("status do objetivo fincanceiro é obrigatorio! active ou completed"),
})

export default function FinancialGoals() {
    // estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)

    //hook para validação de formulario 
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para fazer solicitação de cadastro para a API
    const onSubmit = async (data:FinancialGoals) => {
            //iniciar carregamento
            setLoading(true) 
            //limpar erro anterior
            setError(null)
            //limpar acerto anterior
            setSuccess(null)
        try {
            //fazer requisição de cadastro para a API
            const response = await instance.post("/financialGoals/create",data) 
            //retornar mensagem de sucesso
            setSuccess(response.data.message || "nova meta financeira cadastrada com sucesso") 
            //limpar campos do formulario 
            reset()
        } catch (error: any) {
            //verificar se existe erro de validação
            if(error.response && error.response.data && error.response.data.message){
                //retornar mensagem de erro caso seja um array
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join(" - "))
                }
                //retornar mensagem unica de erro 
                else{
                    setError(error.response.data.message)
                }
            }
        }finally{
            //terminar loading 
            setLoading(false)
        }            
    }

    return(
        <Layout>
            {/* mostrar carregando */}
            {loading && <LoadingSpinner/>}
            {/* mostar mensagem deerro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                // conteudo principal
                <main  className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Metas Financeiras</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/financialGoals/list`} className="breadcrumb-link">Meta Financeira</a>
                                <span>/</span>
                                <span>Cadastrar</span>
                            </nav>
                        </div>
                    </div>
                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Cadastrar Meta Financeira</h3>
                            <div className="content-box-btn">
                                <a href={`/financialGoals/list`}  className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
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
                                    className="form-input"
                                    {...register("title")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.title && <AlertMessage type="error" message={errors.title.message ?? null}/>}
                            </div>
                            <br/>
                            <div className="flex items-center gap-2">
                                <label htmlFor="descriptionFinancial" className="form-label">Descrição: </label>
                                <textarea
                                    id="descriptionFinancial"
                                    className="form-input"
                                    placeholder="Descrição"
                                    {...register("description")}
                                />
                            </div>
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.description && <AlertMessage type="error" message={errors.description.message ?? null}/>}
                            <br/>
                            <div>
                                <label htmlFor="targetAmountFinancial" className="form-label">valor alvo: </label>
                                <input 
                                    id="targetAmountFinancial"
                                    type="number"
                                    className="form-input"
                                    placeholder="valor desejado"
                                    {...register("target_amount")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.target_amount && <AlertMessage type="error" message={errors.target_amount.message ?? null}/>}
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="currentAmountFinancial" className="form-label">Valor atual: </label>
                                <input 
                                    id="currentAmountFinancial"
                                    type="number"
                                    className="form-input"
                                    placeholder="valor atual"
                                    {...register("current_amount")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.current_amount && <AlertMessage type="error" message={errors.current_amount.message ?? null}/>}
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="targetDateFinancial" className="form-label">Data alvo: </label>
                                <input 
                                    id="targetDateFinancial"
                                    type="date"
                                    className="form-input"
                                    {...register("target_date")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.target_date && <AlertMessage type="error" message={errors.target_date.message ?? null}/>}
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="statusFinancial" className="form-label">Status: </label>
                                <select 
                                    id="statusFinancial"
                                    className="form-input"
                                    {...register("status")}
                                    >
                                    <option value="active" style={{color:"#000000"}}>Ativa</option>
                                    <option value="completed" style={{color:"#000000"}}>Completa</option>
                                </select>
                            </div>
                            <br/>
                            
                            <button type="submit" disabled={loading} className="btn-success">
                                {loading ? "Cadastrando..." : "Cadastrar"}
                            </button>
                        </form>
                    </div>
                </main>
            )}
        </Layout>
    )
}