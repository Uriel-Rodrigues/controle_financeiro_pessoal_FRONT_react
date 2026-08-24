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
        <div>

            <h1> Criar Nova meta Financeira</h1>
            <br/>

            {/* mostrar carregando */}
            {loading && <p>Carregando...</p>}
            {/* mostar mensagem deerro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="titleFinancial">Titulo: </label>
                            <input 
                                id="titleFinancial"
                                type="text" 
                                placeholder="Titulo da meta financeira"
                                className="border"
                                {...register("title")}
                            />
                        </div>
                        <br/>
                        <div className="flex items-center gap-2">
                            <label htmlFor="descriptionFinancial" >Descrição: </label>
                            <textarea
                                id="descriptionFinancial"
                                className="border"
                                placeholder="Descrição"
                                {...register("description")}
                            />
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="targetAmountFinancial">valor alvo: </label>
                            <input 
                                id="targetAmountFinancial"
                                type="number"
                                className="border"
                                placeholder="valor desejado"
                                {...register("target_amount")}
                            />
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="currentAmountFinancial">Valor atual: </label>
                            <input 
                                id="currentAmountFinancial"
                                type="number"
                                className="border"
                                placeholder="valor atual"
                                {...register("current_amount")}
                            />
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="targetDateFinancial">Data alvo: </label>
                            <input 
                                id="targetDateFinancial"
                                type="date"
                                className="border"
                                {...register("target_date")}
                            />
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="statusFinancial">Status: </label>
                            <select 
                                id="statusFinancial"
                                className="border"
                                {...register("status")}
                                >
                                <option value="active" style={{color:"#000000"}}>Ativa</option>
                                <option value="completed" style={{color:"#000000"}}>Completa</option>
                            </select>
                        </div>
                        <br/>
                        
                        <button type="submit" disabled={loading}>
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}