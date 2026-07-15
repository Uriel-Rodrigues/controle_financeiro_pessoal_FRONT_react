//diretiva  usada para indicar que este componente é executado no cliente
//especifica para next js 13+ quando se utiliza a renderização no lado do cliente
'use client'
import instance from "@/services/api";
import { useEffect, useState } from "react";

export default function TestConnection(){
    const [message, setMessage] = useState<string> ("carregando...")

    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await instance.get("/test-connection")
                
                setMessage(response.data.message || "conexão realizada com sucesso2") 
            } catch (error) {
                console.log(`erro ao testar a conexão: ${error}`)
                setMessage(`erro ao conectar com a API: ${error}`)     
            }
        }
        
        testConnection()
    }, [])

    return(
        <div>
            {message} <br />
        </div>
    )
}