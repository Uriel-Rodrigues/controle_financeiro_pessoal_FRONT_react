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
        <div>

            <h1> Criar novo Registro de Transação </h1>
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
                        </div>
                        <br/>
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
                        </div>            
                        <br/>

                        <div>
                            <label htmlFor="idCategoriesTransaction">id: </label>
                            <input 
                                id="idCategoriesTransaction"
                                type="number" 
                                placeholder=" id de categoria"
                                className="border"
                                {...register("categoriesId")}
                            />
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