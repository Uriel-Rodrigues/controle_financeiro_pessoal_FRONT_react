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
        <div>
            <h1>Editar registro de categoria</h1>
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
                        <label htmlFor="nomeCategory">Nome: </label>
                        <input 
                            id="nomeCategory"
                            type="text"
                            placeholder="Nome da categoria"
                            {...register('name')}
                            className="border" 
                        />
                    {/*exibir mensagem de erro na validação do campo*/}
                    {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    <br />

                    <div>
                        <label htmlFor="typeCategory">Tipo: </label>
                        <select 
                            id="typeCategory"
                            {...register("type")}
                            className="border"
                            >
                            <option value="income" style={{color:"#000000"}}>Receita</option>
                            <option value="expense" style={{color:"#000000"}}>Despesa</option>

                        </select>
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