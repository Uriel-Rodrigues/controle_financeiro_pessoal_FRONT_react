//ReactNode permite que o children seja qualquer coisa renderizavel em jsx
import {ReactNode} from "react"
//importar op hook responsavel por validar o token 
import { useAuth } from "@/hooks/useAuth"

//criar interface para tipar o parametro 'children' do componente 
interface ProtectedRouteProps {
    children:  ReactNode
}

export default function ProtectedRoute ({children} : ProtectedRouteProps){
    //acessar a propriedade authenticated
    const {authenticated} = useAuth()
    //verificar se esta autenticado 
    if(!authenticated) {
        //mostrar alguma coisa em quanto redireciona 
        return <p>Carregando...</p>
    }
    //retorna o conteudo protegido caso o usuario esteja autenticado 
    return <>{children}</>
}