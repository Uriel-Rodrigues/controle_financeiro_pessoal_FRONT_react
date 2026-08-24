'use client'
//importa hooks do react para usar o estado e os efeitos colaterais
import { useEffect, useState } from "react"
//importar hooks para manipular a navegação do usuario 
import { useRouter } from "next/navigation"
//importar instancia de conecção com a api
import instance from "@/services/api"

export function useAuth (){
    //instanciar o router para usar depois
    const router = useRouter ()
    //estado para armazenar autenticação 
    const [authenticated, setAuthenticated] = useState <boolean> (false)
    //comtrole de carregamento
    const [loading, setLoading] = useState <boolean> (false)
    
    //Hookspara verificar se o token existe 
    useEffect(() => {
        //recperar o token do localStorage
        const token = localStorage.getItem("token")
        // verificar se o token existe 
        if(!token) {
            //se nao existir encaminha o usuario para a pagina de login 
            router.push("/login")
        }

        //função para verificar a validade do token 
        const validateToken = async() => {
            try {
                //fazer a requisição para a API
                await instance.get("/validate-token")
                
                //verifica a validade do token na API 
                setAuthenticated(true)
                    
            } catch (error) {
                localStorage.removeItem("token")
            }
            finally{
                //finalizar loading
                setLoading(false)
            }
        }

        //chamar a função validar token 
        validateToken()

    },[])
    //retornar a situação da autenticação
    return {authenticated, loading}
}