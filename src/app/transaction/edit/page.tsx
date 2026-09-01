'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
import {useParams, useSearchParams } from "next/navigation";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar biblioteca de validação de formulario
import * as yup from "yup"
//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
// importar componente de layout
import Layout from "@/app/components/layout";
//importar componente de alerta 
import AlertMessage from "@/app/components/alertMessage";

interface Transaction {
    type: string,
    description: string,
    amount: number,
    transation_date: string,
    observations?: string | null,
}

const schema = yup.object().shape({
    type: yup.string().required("o tipo da transação precisa se informado!").min(3, "o tipo deve conter pelo menos 3 caracteres"),
    description: yup.string().required("descrição é obrigatoria!").min(3, "a descrição deve conter pelo menos 3 caracteres"),
    amount: yup.number().required("o valor da transação deve ser informado!"),
    transation_date: yup.string().required("a data da transação deve ser informada!"),
    observations: yup.string().notRequired(),
})

export default function Transactions() {
    //estado para pegar dados que vem pela URL
    const id = Number(useSearchParams().get("id"))
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de seccesso
    const [success, setSuccess] = useState <string | null> (null)

    //hook para validação de formulario
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função de requisição tipo GET para a API(capturar dados)
    const fetchTransaction = async () => {
        try {
            //iniciar Loading
            setLoading(true)
            //requisição GET para a API
            const response = await instance.get(`/transaction/${id}`)
            console.log("Resposta completa:", response)
            console.log("Dados da API:", response.data)
            //atualizar campo com dados cadastrados
            reset({
                type: response.data.type,
                description: response.data.description,
                amount: response.data.amount,
                transation_date: response.data.transation_date,
                observations: response.data.observations
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

    //função de requisição tipo PUT para a API (atualizar dados)
    const onSubmit = async (data: Transaction) => {
        try {
            //iniciar carregamento 
            setLoading(true)
            //função PUT para a API
            const response = await instance.put(`/transaction/${id}`, data)
            //retornar mensagem de sucesso
            setSuccess(response.data.message || "registro atualizado com sucesso")
            //encerrar loading
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
    //hook para atualizar a pagina quando o id mudar
    useEffect(()=>{
        if(id){
            fetchTransaction()
        }
    },[id]) 

    return(
        <Layout>

            {/* mostrar carregando */}
            {loading && <p>Carregando...</p>}
            {/* mostar mensagem deerro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Transções</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/transaction/list`} className="breadcrumb-link">Transções</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>

                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Editar Transação</h3>
                            <div className="content-box-btn">
                                <a href={`/transaction/list`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>

                                <a href={`/transaction/${id}`}  className="btn-primary aling-icon-btn">
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
                                <label htmlFor="typeTransaction" className="form-label">Tipo: </label>
                                <select
                                    id="typeTransaction" 
                                    className="form-input"
                                    {...register("type")}
                                >
                                    <option value="income" style={{color:"#000000"}}>Receita</option>
                                    <option value="expense" style={{color:"#000000"}}>Despesa</option>
                                </select>
                            </div>
                            <br/>
                            <div className="flex items-center gap-2 mb-4" >
                                <label htmlFor="descriptionTransaction" className="form-label">Descrição: </label>
                                <textarea 
                                    id="descriptionTransaction"
                                    placeholder="Descrição"
                                    className="form-input"
                                    {...register("description")}
                                />
                            </div>
                             {/*exibir mensagem de erro na validação do campo*/}
                            {errors.description && <AlertMessage type="error" message={errors.description.message ?? null}/>}
                            <br/>
                            <div className="mb-4">
                                <label htmlFor="amountTransaction" className="form-label">Valor da Transação: </label>
                                <input 
                                    id="amountTransaction"
                                    type="number" 
                                    placeholder="Valor da Transação"
                                    className="form-input"
                                    {...register("amount")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.amount && <AlertMessage type="error" message={errors.amount.message ?? null}/>}
                            </div>
                            <br/>
                            <div className="mb-4">
                                <label htmlFor="transationDateTransaction" className="form-label">Data da Transação: </label>
                                <input 
                                    id="transationDateTransaction"
                                    type="date" 
                                    placeholder="Data da Transação"
                                    className="form-input"
                                    {...register("transation_date")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.transation_date && <AlertMessage type="error" message={errors.transation_date.message ?? null}/>}
                            </div>
                            <br/>
                            <div  className="flex items-center gap-2 mb-4">
                                <label htmlFor="observationsTransaction" className="form-label">Observações: </label>
                                <textarea 
                                    id="observationsTransaction"
                                    placeholder="Observações"
                                    className="form-input"
                                    {...register("observations")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.observations && <AlertMessage type="error" message={errors.observations.message ?? null}/>}
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