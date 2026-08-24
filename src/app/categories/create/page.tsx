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

interface Category{
    name:string,
    type: string,
}

const schema = yup.object().shape({
    name: yup.string().required("Nome da categoria obrigatorio").min(5, "nome deve ter minimo de 5 caracteres"),
    type: yup.string().required("tipo da categoria é obrigatorio!"),
})

export default function Categories() {
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)
    
    //função para validação de formulario
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para realizar requisição e cadastrar dados na api    
    const onSubmit = async (data:Category ) => {
        //começar o carregamento 
        setLoading(true)
        //limpar erro anterior 
        setError(null)
        //limpar acerto anterior
        setSuccess(null)
        try {
            //fazer requisição para a API salvar registro
            const response = await instance.post("/categories/create",data)     
            //retornar mensagem de sucesso
            setSuccess(response.data.message || "nova categoria cadastrada com sucesso")
            //limpar campo do formulario
            reset()
            
        } catch (error:any) {
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

            <h1> Criar novo Registro de Categoria </h1>
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
                            <label htmlFor="nameCatgory">Nome: </label>
                            <input 
                                id="nameCatgory"
                                type="text" 
                                placeholder="Nome da categoria"
                                className="border"
                                {...register("name")}
                            />
                        </div>
                        <br/>
                        <div>
                            <label htmlFor="typeCategory">Tipo: </label>
                            <select 
                                id="type"
                                className="border"
                                {...register("type")}
                                >
                                    <option value="income" style={{color:"#000000"}}>Receita</option>
                                    <option value="expense" style={{color:"#000000"}}>Despesa</option>

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