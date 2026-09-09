'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importar biblioteca de validação de formulario
import * as yup from "yup"
// validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
//importar o componente para criar link
import Link from "next/link"
//importar hooks para manipular a navegação do usuario 
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";

//criar esquema de validação com yup
const schema = yup.object().shape({
    email: yup.string().email().required("email de usuario obrigatorio!"),
    password:yup.string().required("senha de usuario obrigatoria!").min(8, "a senha deve ter minimo de 8 caracteres")
})

export default function Login (){
    //instanciar o router para usar posteriormente
    const router = useRouter()
    //criar estado para controle de carregamento
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError ] = useState <string | null> (null) 
    // estado para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar o formulario com validações
    const {register, handleSubmit, formState :{errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para encaminhar dados para a API validar
    const onSubmit = async (data: {email:string ; password: string}) => {
        //inicar carregamento
        setLoading(true)
        //limpar erros anteriores
        setError(null)
        //limpa sucesso anterior 
        setSuccess(null)

        try{
            //fazer requisição para api enviar dados os dados
            const response = await instance.post("/login", data)
            //console.log(response.data)

            // capturar o token e armazenar em sessionStorage
            localStorage.setItem("token",response.data.user.token)

            //redirecionar o usuario para pagina principal 
            router.push("/dashboard")
        }
        catch (error: any) {
            //verificar se ocorreu erro de autenicação
            if(error.response && error.response.data && error.response.data.message){
                
                //mostrar mensagem caso seja um array de manssagem 
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join("-"))
                }   
                
                //mostrar mensagem caso seja somente uma menssagem
                else{
                    setError(error.response.data.message)
                }
            }  
        }
        finally{
            //parar de carregar 
            setLoading(false)
        }
    }

    useEffect (() => {
        const menssage = sessionStorage.getItem("successMenssage")
        if(menssage) {
            setSuccess(menssage)
            sessionStorage.removeItem("successMenssage")
        }
    },[])

    return (
        <div className="bg-login ">
            <div className="card-login">
                <div className="logo-wrapper-login">
                    <a href="/">
                    <img src="/image/dindinnn.png" alt="logo" className="logo-login" />
                    </a>
                </div>
                <h1 className="title-login ">FinControl</h1>
                <br />

                {/* mostrar carregamento */}
                {loading && <LoadingSpinner/>}
                {/* mostrar erro caso tenh */}
                {error && <p style={{color:"#AB080B"}}>{error}</p>}
                {/* mostrar mensagfem de sucesso caso tenha */}
                {success && <p style={{color:"#3CB648"}}>{success}</p>}
                {/* mostrar formulario caso não esteja carregando e não tenha erros */}
                {!loading && !error && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group-login">
                            <label htmlFor="email" className="form-label-login">*Email: </label>
                            <input 
                                id = "email"
                                type="email" 
                                placeholder= "Email de usuario"
                                {...register('email')}
                                className ="form-input-login"
                            />
                            {/* exibir erros de validação de campo  */}
                            {errors.email && <p style={{color:"#AB080B"}}>{errors.email.message}</p> }
                        </div>
                        <br /> 

                        <div className="form-group-login">
                            <label htmlFor="password" className="form-label-login">*Senha: </label>
                            <input
                                id = "password"
                                type="password"
                                placeholder="Senha"
                                {...register('password')}
                                className ="form-input-login"
                            />
                            {/* exibir erro de validação de campo */}
                            {errors.password && <p style={{color:"#AB080B"}}>{errors.password.message}</p>}
                        </div>

                        <div className="btn-group-login">
                            <Link href="/recover-password" className="link-login">Esqueceu a senha?
                            </Link>
                            <button type="submit" className="btn-primary-md" disabled = {loading}>
                            {loading ? "Acessando..." : "Entrar"}
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/users/create" className="link-login">Criar nova conta!</Link>
                        </div>
                        
                        <br/>
                    </form>
                )}
            </div>
        </div>
    )
}