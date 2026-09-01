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
        <Layout>
            {/* mostrar carregando */}
            {loading && <p>Carregando...</p>}
            {/* mostar mensagem deerro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                // conteudo principal
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Categorias</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/categories/list`} className="breadcrumb-link">Categorias</a>
                                <span>/</span>
                                <span>Editar</span>
                            </nav>
                        </div>
                    </div>
                    <div>
                        <div className="content-box-header">
                            <h3 className="content-box-title">Cadastrar Categoria</h3>
                            <div className="content-box-btn">
                                <a href={`/categories/list`} className="btn-info aling-icon-btn">
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
                                <label htmlFor="nameCatgory" className="form-label">Nome: </label>
                                <input 
                                    id="nameCatgory"
                                    type="text" 
                                    placeholder="Nome da categoria"
                                    className="form-input"
                                    {...register("name")}
                                />
                            {/*exibir mensagem de erro na validação do campo*/}
                            {errors.name && <AlertMessage type="error" message={errors.name.message ?? null}/>}
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="typeCategory" className="form-label">Tipo: </label>
                                <select 
                                    id="type"
                                    className="form-input"
                                    {...register("type")}
                                    >
                                        <option value="income" style={{color:"#000000"}}>Receita</option>
                                        <option value="expense" style={{color:"#000000"}}>Despesa</option>

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