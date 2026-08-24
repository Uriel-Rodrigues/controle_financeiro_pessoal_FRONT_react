'use client'
import DeleteButton from "@/app/components/deleteButton"
//importar instancia de conexão com a API
import instance from "@/services/api"
//importa hooks paraextrai parametros da URL 
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState, useEffect} from "react"

interface Categories {
    id: number,
    name: string,
    type: string,
    created_at: string,
    updated_at: string
}

export default function Categories(){
    //estador par pegar dados encaminhados na URL
    const {id} = useParams()
    //instanciar router 
    const router = useRouter()
    //estado para armazenar dados do usuario
    const [categories, setCategories] = useState <Categories | null> (null) 
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //função para fazer requisição para a API
    const fetchCategories = async (id: string) => {
        try {
            //iniciar carregamento
            setLoading(true) 
            //realizar requisição para API
            const response = await instance.get(`/categories/${id}`)
            //atualizar dados do usuario
            setCategories(response.data) 
            //terminar loading 
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
        router.push("/transaction/list")

    }

    //hook para bucar novos dados quando o ID mudar
    useEffect( ()=> {
        if(id){
            const idCategories = Array.isArray(id) ? id[0] : id
            fetchCategories(idCategories)
        }
    },[id]) // recarrega a pagina quanto o id mudar

    return(
        <div>

            <h1>Categories details</h1>
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
                    <p>ID: {categories?.id}</p>
                    <p>name: {categories?.name}</p>
                    <p>type: {categories?.type}</p>
                    <p>Criador em: {categories?.created_at}</p>
                    <p>Modificado em: {categories?.updated_at}</p>
                    <br />
                    <DeleteButton
                        id={String(categories?.id)}
                        route="categories"
                        setError={setError}
                        setSuccess={setSuccess}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}
        </div>
    )
}