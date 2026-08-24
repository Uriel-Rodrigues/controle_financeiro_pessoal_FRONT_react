'use client'
import DeleteButton from "@/app/components/deleteButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
//importa hooks paraextrai parametros da URL 
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"


interface Financial {
    id: number
    title: string,
    description: string,
    target_amount: number,
    current_amount: number,
    target_date: string, 
    status: string
}

export default function FinancialGoals(){
    //estado para pegar ID que vem pela URL 
    const {id} = useParams()
    //instanciar router
    const router = useRouter()
    //estado para armazenar dados vindos da API
    const [financialGoals, setFinancialGoals] = useState <Financial | null> (null)
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //função de requisição GET para a API
    const fetchFinancialGoals = async (id: string) => {
        try {
            //iniciar loading
            setLoading(true)
            //requisição GET para a API
            const response = await instance.get(`/financialGoals/${id}`)
            //atualizar estado com dados encontrados
            setFinancialGoals(response.data)
            //terminar carregamento
            setLoading(false)
            
        } catch (error: any) {
            //retornar mensagem de erro
            setError(`Não foi possivel carregar os dados solicitados: ${error}`)
            //terminar loading
            setLoading(false)
        } finally{
            //terminar loading
            setLoading(false)
        }
    }

    // redirecionar usuario apos deletar registro
    const handleSuccess = () => {
        //setar mensagem apos deletar
        sessionStorage.setItem("successMessage", "registro deletado com sucesso")
        //redirecionar usuario
        router.push("/financialGoals/list")

    }

    //hook ara atualizar a pagina quando o ID mudar 
    useEffect(() => {
        if(id){
            const idFinancial = Array.isArray(id) ? id[0] : id
            fetchFinancialGoals(idFinancial)
        }
    },[id]) // recarrega a pagina quanto o id mudar
 
    return(
        <div>

            <h1>Financial Goals details</h1>
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
                    <p>ID: {financialGoals?.id}</p>
                    <p>Titulo: {financialGoals?.title}</p>
                    <p>Descrição: {financialGoals?.description}</p>
                    <p>Valor alvo: {financialGoals?.target_amount}</p>
                    <p>Valor atual: {financialGoals?.current_amount}</p>
                    <p>Data alvo: {financialGoals?.target_date && new Intl.DateTimeFormat('pt-BR').format(new Date (financialGoals?.target_date))}</p>
                    <p>Status: {financialGoals?.status}</p>
                    <br />
                    <DeleteButton
                        id={String(financialGoals?.id)}
                        route="financialGoals"
                        setError={setError}
                        setSuccess={setSuccess}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}
        </div>
    )
}