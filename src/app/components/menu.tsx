//importar hooks para manipular a navegação do usuario 
import { useRouter } from "next/navigation"

export default function Menu() {
    //instanciar o router para usar depois
    const router = useRouter ()
    
    const handleLogout = () => {
        //remover o token do sessionStorage
        localStorage.removeItem("token")

        //redirecionar o usuario 
        router.push("/login")
    }


    return (
        <div>
            <ul>
                <li><a href="/users/me">Meu Perfil</a></li>
                <li><a href="/financialGoals/list">Metas Financeiras</a></li>
                <li><a href="/transaction/list">Transações</a></li>
                <li><a href="/categories/list">Categorias</a></li>
                <li><a href="#" onClick={handleLogout}>Sair</a></li>
            </ul>
        </div>
    )
}