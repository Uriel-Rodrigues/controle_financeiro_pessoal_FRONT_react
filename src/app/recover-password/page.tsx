'use client'
//importar conexão com a API
import instance from "@/services/api";
//importar hook para manipular navegação do usuario 
import { useRouter } from "next/navigation";
//importar validação de formulario com yup
import * as yup from 'yup'
//adaptador para conectar o resolver a validações como yup
import { yupResolver } from "@hookform/resolvers/yup";
//biblioteca para gerenciar formulario
import { useForm } from "react-hook-form"; 
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState } from "react";
// importar biblioteca para criat Links
import Link from "next/link";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";

//esquema de validação yup
const schema = yup.object().shape({
    email: yup.string().required("o campo de email é obrigatorio!"),
})

export default function RecoverPassword () {
    //instanciar o router 
    const router = useRouter()
    //estado para controle de controle para carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)  
    //estado para controle de acerto 
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar formulario com validações 
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })

    //função para encaminhar dados para a api
    const onSubmit = async (data: {email: string, urlRecoverPassword?:string}) =>{
        //atribuir a url da aplicação
        data.urlRecoverPassword = "http://localhost:3000/recover-password/update-password"

        //iniciar o carregamento 
        setLoading(true)
        //limpar possivel erro anterior
        setError(null)
        //limpar possivel sucesso anterior
        setSuccess(null)

        try {
            // fazer requisição para a api
            const  response = await instance.post('/recover-password', data)
            
            //armazenar mensagem no sessionStorage  
            sessionStorage.setItem("successMenssage","E-mail enviado, verifique sua caixa de entrada no email de cadastro")

            //encaminar usuario para pagina de login
            router.push('/login')

        }
        catch(error:any){
            //verificar se existe erro de requisição
            if(error.response & error.response.data && error.response.data.menssage) {
                //retornar menssagem de erro em caso de ser um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem caso não seja um array
                    setError("erro ao recuperar a senha!")
                }
            }    
        }
        finally{
            //terminar o carrgamento
            setLoading(false)
        }
    }
    return(
        <div className="bg-login">

            {/* div central */}
            <div className="card-login">

                {/* div com a imagem */}
                <div className="logo-wrapper-login">
                    <img src="/image/dindinnn.png" alt="logo" className="logo-login"></img>
                </div>

                <h1 className="title-login">Recuperar senha</h1>

                {/* mostrar carregando */}
                {loading && <LoadingSpinner/>}
                {/* exibir erro se ouver */}
                {error && <p style={{color: "#AB080B"}}>{error}</p>}
                {/* exibir sucesso se ouver  */}
                {success && <p style= {{color: "#3CB648"}}>{success}</p>}
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        <div className="form-group-login">
                            <label htmlFor="email" className="form-label-login">E-mail: </label>
                            <input
                                id="email" 
                                type="text"
                                placeholder="Digite seu email"
                                className="form-input-login" 
                                {...register('email')}
                            />
                            {/* exibir erro de validação de campo */}
                            {errors.email && <p style={{color: "#AB080B"}}>{errors.email.message}</p>}
                        </div>
                        <div className="btn-group-login">
                            <Link href="/login" className="link-login">Login</Link>

                            <button type="submit" disabled = {loading} className="btn-primary-md">
                            {loading ? "carregando..." : "Recuperar"}  
                        </button>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href={'/users/create'} className="link-login">Criar nova conta!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}