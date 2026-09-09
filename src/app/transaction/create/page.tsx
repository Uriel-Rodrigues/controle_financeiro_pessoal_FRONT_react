'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
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
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";

interface Transaction {
    type: string,
    description: string,
    amount: number,
    transation_date: string,
    observations?: string | null,
    categoriesId: number
}

const schema = yup.object().shape({
    type: yup.string().required("o tipo da transação precisa se informado!").min(3, "o tipo deve conter pelo menos 3 caracteres"),
    description: yup.string().required("descrição é obrigatoria!").min(3, "a descrição deve conter pelo menos 3 caracteres"),
    amount: yup.number().required("o valor da transação deve ser informado!"),
    transation_date: yup.string().required("a data da transação deve ser informada!"),
    observations: yup.string().notRequired(),
    categoriesId: yup.number().required()

})

export default function Transactions () {
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //hook para validação de formulario 
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })

    //função para requisição POST para a API
    const onSubmit = async (data: Transaction) => {
        try {
            //iniciar carregamento 
            setLoading(true)
            //limpar erro anterior
            setError(null)
            //limpar sucesso anterior
            setSuccess(null)
            ////fazer requisição para a api
            const response = await instance.post("/transaction/create", data)
            //retornar mensagem de sucesso 
            setSuccess(response.data.message || "novo usuario cadastrado com sucesso")
            //resetar fomulario
            reset()   
            
        } catch (error: any) {
            // verificar se egiste erro de validação
            if(error.response && error.response.data && error.response.data.message){
                //exibir mensagem caso seja um array
                if(Array.isArray(error.response.data.memessage)){
                    setError(error.response.data.message.join(" - "))
                }
                else{
                    //retornar mensagem se nao for array
                    setError(error.response.data.message)
                }
            }            
        } finally{
            // finalizar loading
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
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Transações</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/transaction/list`} className="breadcrumb-link">Transações</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>

                    <div>
                        <div className="content-box-header">
                            <h3 className="content-box-title">Cadastrar Transação</h3>
                            <div className="content-box-btn">
                                <a href={`/transaction/list`} className="btn-info aling-icon-btn">
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
                            <div className="flex items-center gap-2 mb-4">
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

                            <div className="mb-4">
                                <label htmlFor="idCategoriesTransaction" className="form-label">id: </label>
                                <input 
                                    id="idCategoriesTransaction"
                                    type="number" 
                                    placeholder=" id de categoria"
                                    className="form-input"
                                    {...register("categoriesId")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.categoriesId && <AlertMessage type="error" message={errors.categoriesId.message ?? null}/>}
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