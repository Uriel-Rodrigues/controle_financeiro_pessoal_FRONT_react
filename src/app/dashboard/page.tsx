'use client'
// importar o componente de proteção de rotas
import ProtectedRoute from "../components/protectedRoute"
//importar biblioteca para usar criar links
import Link from "next/link"
//importar componente menu 
import Menu from "../components/menu"
// importar componente de layout
import Layout from "../components/layout"
// importar componente com grafico de transações
import TransactionBarChart from "../components/Graphic/transaction/BarChart/Transaction"
// importar componente com grafico de metas financeiras
import FinancialGoalsAreaChart from "../components/Graphic/financialGoals/AreaChart/financialGoals"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"
//importar instancia de conexão com a API
import instance from "@/services/api"
// importar componente de alerta
import AlertMessage from "@/app/components/alertMessage";
//importar componente de spinner de loading
import LoadingSpinner from "@/app/components/loadinSpinner";

interface TransactionReport{
    month: string,
    transactions: number
}
interface FinancialGoalsReport{
    month: string,
    financialGoals: number
}
export default function Home () {
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)
    //estado para armazenar dados do grafico de metas transações
    const [transactionReport, SetTransactionReport] = useState <TransactionReport[]>([])
    //estado para armazenar dados do grafico de metas financeiras
    const [financialGoalsReport, SetFinancialGoalsReport] = useState <FinancialGoalsReport[]>([])

    const fetchReports = async () => {
        try {
            setLoading(true)
            setError(null)
            setSuccess(null)

            //multiplas requisições
            const [transactionReport, financialGoalsReport] = await Promise.all([
                instance.get("/transaction-report"),
                instance.get("/financialGoals-report")
            ])

            //atribuir dados que a api retornou
            SetTransactionReport(transactionReport.data)
            SetFinancialGoalsReport(financialGoalsReport.data)
            
        } catch (error) {
            //mensagem generica de erro 
            setError(`erro ao carregar dados do dashboard: ${error}`)
        }finally{
            //terminar carregamento 
            setLoading(false)
        }
    }

    useEffect(()=> {
        fetchReports()
    },[])

    return (
        <ProtectedRoute>
            <Layout>
                <main className="main-content"> 
                     <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Dashboard</h2>
                            <nav className="breadcrumb">
                                <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                            </nav>
                        </div>
                    </div>

                    <div  className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Pagina inicial</h3>
                            <div className="content-box-btn">
                            </div>
                        </div>

                        {/* mostrar carregando */}
                        {loading && <LoadingSpinner/>}
                        {/* mostrar mensagem de erro casotenha */}
                        <AlertMessage type="error" message={error}/>
                        {/* mostrar mensagem de success caso tenha */}
                        <AlertMessage type="success" message={success}/>

                        <div className="flex flex-col md:flex-row justify-center py-5 px-5">
                            <TransactionBarChart data= {transactionReport}/>
                            <FinancialGoalsAreaChart data={financialGoalsReport}/>
                        </div>
                    </div>
                </main>
            </Layout>

        </ProtectedRoute>
    )
}