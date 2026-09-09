'use client'
import DeleteButton from "@/app/components/deleteButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
import { FetchStrategy } from "next/dist/client/components/segment-cache/types"
//importa hooks paraextrai parametros da URL 
import { useParams } from "next/navigation"
// hook para manipular navegação do usuario
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"
// importar componente de layout
import Layout from "@/app/components/layout"
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";

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
        <Layout>
            {/* mostrar carregando */}
            {loading && <LoadingSpinner/>}
            {/* mostrar mensagem de erro casotenha */}
            {error && <p>{error}</p>}
            {/* mostrar mensagem de success caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar conteudo se tudo ok */}
            {!loading && !error && (
                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Transações</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className=" breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href={`/transaction/list`} className=" breadcrumb-link">Transações</a>
                                <span>/</span>
                                <span>Visualizar</span>
                            </nav>
                        </div>
                    </div>

                    <div className="content-box">
                        <div  className="content-box-header">
                            <h3 className="content-box-title">Visualizar Transação</h3>
                            <div className="content-box-btn">
                                <a href={`/transaction/list`} className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>
                                <a href={`/transaction/edit`} className="btn-warning aling-icon-btn ">
                                    {/* <!-- svg pencil-square (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Editar</span>
                                </a>
                                < DeleteButton
                                    id = {String(transaction?.id)}
                                    route="product-categories"
                                    onSuccess={handleSuccess}
                                    setError={setError}
                                    setSuccess={setSuccess}
                                />
                            </div>
                        </div>
                        <div className="detail-box">
                            <div className="mb-1">
                                <span className="detail-content">ID: {transaction?.id}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Tipo: {transaction?.type}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Descrição: {transaction?.description}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Valor: {transaction?.amount}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Data da transação: {transaction?.transation_date}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Obsrvações: {transaction?.observations}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Criado em: {transaction?.created_at}</span>
                            </div>
                            <br />
                            <div className="mb-1">
                                <span className="detail-content">Modificado em: {transaction?.updated_at}</span>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </Layout>
    )
    
}