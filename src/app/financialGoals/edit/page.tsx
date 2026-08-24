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
        <div>
            <h1>Editar registro de Meta Financeira</h1>
            <br />

            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar mensagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="titleFinancial">Titulo: </label>
                        <input 
                            id="titleFinancial"
                            type="text"
                            placeholder="Titulo da meta financeira"
                            {...register('title')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.title && <p>{errors.title.message}</p>}
                    </div>

                    <br />
                    
                    <div>
                        <label htmlFor="descriptionFinancial">Descrição: </label>
                        <input 
                            id="descriptionFinancial"
                            type="text"
                            placeholder="Descrição"
                            {...register('description')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.description && <p>{errors.description.message}</p>}
                    </div>

                    <br />
                    
                    <div>
                        <label htmlFor="targetAmountFinancial">Valor alvo: </label>
                        <input 
                            id="targetAmountFinancial"
                            type="text"
                            placeholder="valor desejado"
                            {...register('target_amount')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.target_amount && <p>{errors.target_amount.message}</p>}
                    </div>

                    <br />
                    
                    <div>
                        <label htmlFor="currentAmountFinancial">Valor atual: </label>
                        <input 
                            id="currentAmountFinancial"
                            type="text"
                            placeholder="valor atual"
                            {...register('current_amount')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.current_amount && <p>{errors.current_amount.message}</p>}
                    </div>

                    <br />
                    
                    <div>
                        <label htmlFor="targetDateFinancial">Data alvo: </label>
                        <input 
                            id="targetDateFinancial"
                            type="date"
                            {...register('target_date')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.target_date && <p>{errors.target_date.message}</p>}
                    </div>

                    <br />

                    <div>
                        <label htmlFor="statusFinancial">Status: </label>
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

                    <div>
                        <label htmlFor="usersIdFinancial">id usuario: </label>
                        <input 
                            id="usersIdFinancial"
                            type="number"
                            {...register('usersId')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.usersId && <p>{errors.usersId.message}</p>}
                    </div>

                    <br />
                    
                    <button type="submit" disabled = {loading}>
                        {loading ? "Atualizando..." : "Atualizar"}
                    </button>
                </form>
            )}
        </div>
    )
}