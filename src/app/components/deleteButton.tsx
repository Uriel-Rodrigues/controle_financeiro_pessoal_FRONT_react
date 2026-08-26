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
        const confirmDelet = window.confirm(
            "Tem certeza que deseja deletar esse registro?\n\n" + 
            "Essa ação não podera ser desfeita."
        )
        if(!confirmDelet){
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
                {loading?"Excluindo..." : "Apagar"}
            </button>
        </div>
    )
}