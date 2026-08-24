'use client'
import DeleteButton from "@/app/components/deleteButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
import { FetchStrategy } from "next/dist/client/components/segment-cache/types"
//importa hooks paraextrai parametros da URL 
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"

interface Transaction {
    id: number, 
    type: string,
    description: string,
    amount: number,
    transation_date: string,
    observations?: string | null,
    created_at: string,
    updated_at: string
}

export default function Transactions () {
    //pegar dados da requisição pela URL 
    const {id} = useParams()
    //instanciar router para usar posteriormente 
    const router = useRouter()

    //estado para armazenar dados do susuario 
    const [transaction, setTransaction] = useState <Transaction | null> (null)
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //função para realiza requisição tipo GET para a API
    const fetchTransaction = async (id: string) => {
        try {
            //iniciar carregamento
            setLoading(true) 
            //realizar requisição para a API
            const response = await instance.get(`/transaction/${id}`)
            //atualzar dados do usuario com o que foi retornado
            setTransaction(response.data)
            //terminar carregamento
            setLoading(false)  

        } catch (error) {
            //retornar mensagem em caso de erro
            setError(`erro nao foi possivel carregar o registro: ${error}`)
            //terminar carregamento
            setLoading(false)
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }

    // redirecionar usuario apos deletar registro
    const handleSuccess = () => {
        //setar mensagem apos deletar
        sessionStorage.setItem("successMessage", "registro deletado com sucesso")
        //redirecionar usuario
        router.push("/transaction/list")

    }

    // hook para buscar novos dados quando o id mudar
    useEffect(() => {
        if(id){
            const transactionId = Array.isArray(id) ? id[0] : id
            fetchTransaction(transactionId)
        }
    },[id])

    return(
        <div>

            <h1>Transaction details</h1>
            <br />

            {/* mostrar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar mensagem de erro casotenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de success caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <div>
                    <p>ID: {transaction?.id}</p>
                    <p>Tipo: {transaction?.type}</p>
                    <p>Descrição: {transaction?.description}</p>
                    <p>Valor: {transaction?.amount}</p>
                    <p>Data da transação: {transaction?.transation_date}</p>
                    <p>Obsrvações: {transaction?.observations}</p>
                    <p>Criado em: {transaction?.created_at}</p>
                    <p>Modificado em: {transaction?.updated_at}</p>
                    <br />
                    <DeleteButton
                        id={String(transaction?.id)}
                        route="transaction"
                        setError={setError}
                        setSuccess={setSuccess}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}
        </div>
    )
    
}