import { useState } from "react";
import instance from "@/services/api";

interface DeleteButtonProps{
    id: string //ID da situaçãoa se excluida
    route: string //rota para requisição
    onSuccess?: () => void //função de callback apos sucesso
    setError: (menssage: string | null) => void //função de callback para retornar menssagem de erro s
    setSuccess: (menssage: string | null) => void //função de callback para retornar menssagem de sucesso
}

export default function DeleteButton({id, route, onSuccess, setError, setSuccess}: DeleteButtonProps){
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    
    const handleDelete = async () => {
        // evita multiplos cliques
        if(loading) {
            return
        }
        
        //iniciar o carregamento 
        setLoading(true)
        //limpa o erro anterior
        setError(null)
        //limpa o sucesso anterior
        setSuccess(null)

        try {
            //fazer a solicitação para a API
            const response = await instance.delete(`/${route}/delete/${id}`) //ex:/users/3
            //resposta de erro
            setSuccess(response.data.menssage || "registro deletado com sucesso")
            //chamar a função de sucesso 
            if(onSuccess){
                onSuccess()
            }
        }
        catch (error: any){
            //verifica se exite erro de validação
            setError(error.response?.data?.menssage || "erro ao deletar o registro")
        }
        finally{
            //temina o carregamento
            setLoading(false)
        }
    }
    return (
        <div>
            <button onClick={handleDelete} disabled = {loading} className="btn-danger hidden md:flex items-center space-x-1">
                {/* <!-- svg trash (Heroicons) --> */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                {loading?"Excluindo..." : "Apagar"}
            </button>
        </div>
    )
}