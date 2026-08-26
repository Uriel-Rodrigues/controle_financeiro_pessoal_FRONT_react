'use client'
import DeleteButton from "@/app/components/deleteButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
//importa hooks paraextrai parametros da URL 
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"
//importar componente layout
import Layout from "@/app/components/layout"

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
        <Layout>
            {/* mostrar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar mensagem de erro casotenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de success caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Metas Financeiras</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/financialGoals/list`} className=" breadcrumb-link">Metas Financeiras</a>
                                <span>/</span>
                                <span>Visualizar</span>
                            </nav>
                        </div>
                    </div>
                    <div className="content-box">
                        <div  className="content-box-header">
                            <h3 className="content-box-title">Meta Financeira</h3>
                            <div className="content-box-btn">
                                <a href={`/financialGoals/list`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>
                                <a href={`/financialGoals/edit?id=${id}`} className="btn-warning aling-icon-btn ">
                                    {/* <!-- svg pencil-square (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Editar</span>
                                </a>
                                < DeleteButton
                                    id={String(financialGoals?.id)}
                                    route="product-categories"
                                    onSuccess={handleSuccess}
                                    setError={setError}
                                    setSuccess={setSuccess}
                                /> 
                            </div>
                        </div>
                        <div className="detail-box">
                            <div className="mb-1">
                                <span className="detail-content">ID: {financialGoals?.id}</span>
                            </div>

                            <div className="mb-1">
                                <span className="detail-content">Titulo: {financialGoals?.title}</span>
                            </div>

                            <div className="mb-1">
                                <span className="detail-content">Descrição: {financialGoals?.description}</span>
                            </div>

                            <div className="mb-1">
                                <span className="detail-content">Valor alvo: {financialGoals?.target_amount}</span>
                            </div>

                            <div className="mb-1">
                                <span className="detail-content">Valor atual: {financialGoals?.current_amount}</span>
                            </div>

                            <div className="mb-1">
                                <span className="detail-content">Data alvo: {financialGoals?.target_date && new Intl.DateTimeFormat('pt-BR').format(new Date (financialGoals?.target_date))}</span>
                            </div>

                            <div>
                                <span className="detail-content">Status: {financialGoals?.status}</span>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </Layout>
    )
}