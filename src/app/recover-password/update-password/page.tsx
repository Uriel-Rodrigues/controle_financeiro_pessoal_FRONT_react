'use client'
//importa hooks do react para usar o estado e os efeitos colaterais
import React, {useEffect, useState} from "react";
//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup";
//imporar função para gerenciar o formulario
import { useForm } from "react-hook-form";
//hook para manipular a navegação do usuario, useSearchParams para obter parametros da URL  
import { useRouter, useSearchParams } from "next/navigation";
//importar biblioteca de validação de formulario
import * as yup from 'yup'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importar biblioteca para criar links 
import Link from "next/link";


//schema de validação com yup 
const schema = yup.object().shape({
    password:yup.string().required("o campo senha é obrigatorio!")
})

export default function updatePassword () {
    //instanciar o objeto router
    const router = useRouter()
    //instanciar o objeto para capturar os parametros da URL
    const searchParams = useSearchParams()
    //instancia para controle de loading
    const [loading,setLoading] = useState <boolean> (false)
    //instancia para controle de erro
    const [error, setError] = useState <string | null> (null)
    // instancia para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)
    
    //iniciar formulario com validações
    const {register, handleSubmit, formState: {errors}, reset} = useForm ({
        resolver: yupResolver(schema)
    })

    //função para enviar dados para a api
    const onSubmit = async (data: {password:string, recoverPassword?: string, email?: string}) => {
        //chave recuperar senha
        data.recoverPassword = searchParams.get("key") || ""
        //email do usuario 
        data.email = searchParams.get("email") || ""

        // iniciar carregamento 
        setLoading(true)
        //limpar o erro anterior
        setError(null)
        //limpar acerto anterior 
        setSuccess(null)

        try {
            //fazer requisição para a API envair os dados
            const response = await instance.put("/update-password",data)
            //limpar campo do formulario 
            reset()
            //salvar a mesnagem no sessionStorage antes de direcionar
            sessionStorage.setItem("successMenssage", response.data.menssage || "senha atualizada com sucesso")
            //redirecionar usuario para pagina de login
            router.push("/login")
        }
        catch (error: any){
            //verificar de o erro contem menssagem de validação 
            if(error.response && error.response.data && error.response.data.menssage){
                
                //exibe menssagem caso seja um array de mensagens
                if(Array.isArray(error.response.data.menssgae)) {
                    setError(error.response.data.menssage.join("-"))
                }else {
                    //salva a menssagem no sessionStorage antes de redirecionar 
                    setError(error.response.data.menssage)
                }
            } else{
                //mensagem generica de error
                setError("erro ao atualizar a senha")
            }
        }finally{
            setLoading(false)       
        }
    }
    //hook para verificar se o token existe 
    useEffect(() => {
        //iniciar o carregamento 
        setLoading(true)

        //recuperar o email e key da URL 
        const email = searchParams.get("email") || ""
        const recoverPassword = searchParams.get("key") || ""

        //verificar se o token existe 
        if(!email || !recoverPassword) {
            //salvar a menssagem no sessionStorage antes de redirecionar 
            sessionStorage.setItem("errorMenssage","dados invalidos para recuperar a senha")

            //redirecionar para o login se nao tiver email e key
            router.push("/login")
        }

        //verificar a validade da chave na api
        const validatekey = async () => {
            try{
                //fazer a requisição à API 
                await instance.post("/validate-recover-password", {email,recoverPassword})
            }
            catch (error:any){
                //verificar de o erro contem menssagem de validação 
                if(error.response && error.response.data && error.response.data.menssage){
                
                //exibe menssagem caso seja um array de mensagens
                if(Array.isArray(error.response.data.menssgae)) {
                    sessionStorage.setItem("errorMenssage",error.response.data.menssage.join("-"))
                }
                else {
                    //salva a menssagem no sessionStorage antes de redirecionar 
                    sessionStorage.setItem("errorMenssage",error.response.data.menssage)
                }

            } else{
                //salvar a menssagem no sessionStorage antes de redirecionar 
                sessionStorage.setItem("errorMenssage", "dados invalidos para recuperar a senha") 
            }
            //redirecionar para o login se nao tiver email e key 
            router.push("/login")
            } 
            
            finally{
            setLoading(false)
            }
        }
        //chama a função para validar token 
        validatekey()
    },[])

    return (
        <div>
            <h1>Recuperar Senha</h1>

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Senha com mínimo 6 caracteres"
                        {...register('password')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.password && <p style={{ color: "#f00" }}>{errors.password.message}</p>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Atualizar"}
                </button>
            </form>
            <Link href="/login">Login</Link>
        </div>
    )
   
}
