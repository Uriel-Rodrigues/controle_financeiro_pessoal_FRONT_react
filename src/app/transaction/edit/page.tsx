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
import { Anybody } from "next/font/google";

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
        <div>

            <h1> Editar registro de Transação </h1>
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
                            <label htmlFor="typeTransaction">Tipo: </label>
                            <select
                                id="typeTransaction" 
                                className="border"
                                {...register("type")}
                            >
                                <option value="income" style={{color:"#000000"}}>Receita</option>
                                <option value="expense" style={{color:"#000000"}}>Despesa</option>
                            </select>

                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.type && <p>{errors.type.message}</p>}
                        </div>
                        <br/>
                        <div className="flex items-center gap-2">
                            <label htmlFor="descriptionTransaction">Descrição: </label>
                            <textarea 
                                id="descriptionTransaction"
                                placeholder="Descrição"
                                className="border"
                                {...register("description")}
                            />

                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.description && <p>{errors.description.message}</p>}
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="amountTransaction">Valor da Transação: </label>
                            <input 
                                id="amountTransaction"
                                type="number" 
                                placeholder="Valor da Transação"
                                className="border"
                                {...register("amount")}
                            />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.amount && <p>{errors.amount.message}</p>}
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="transationDateTransaction">Data da Transação: </label>
                            <input 
                                id="transationDateTransaction"
                                type="date" 
                                placeholder="Data da Transação"
                                className="border"
                                {...register("transation_date")}
                            />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.transation_date && <p>{errors.transation_date.message}</p>}
                        </div>
                        <br/>
                        <div  className="flex items-center gap-2">
                            <label htmlFor="observationsTransaction">Observações: </label>
                            <textarea 
                                id="observationsTransaction"
                                placeholder="Observações"
                                className="border"
                                {...register("observations")}
                            />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.observations && <p>{errors.observations.message}</p>}
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