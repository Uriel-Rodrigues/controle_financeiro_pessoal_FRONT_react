'use client'
//importar hook usado para meniulçar a navegação do usuario 
import { useRouter } from "next/navigation"
//importar hook que permit capturar a URL da pagina do usuario 
import {usePathname } from "next/navigation"

const SideBar = ({isOpen, setIsOpen}: {isOpen: boolean; setIsOpen: (isOpen: boolean) => void}) => {
    //istanciar o objeto router 
    const router= useRouter()
    //istanciar o objeto pasthName capturar URL
    const pasthName = usePathname()
    
    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    }

    //função compara a url encaminhada (parametro) e url da pagina atual do usuario 
    const isActive = (path: string) => {
        return pasthName === path
    }

    return (
        <div className="flex">
            {/* <!-- sidBar --> */}
            <aside id="sidebar" className={`sidebar sm:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="sidebar-container">
                    <button id="closeSidebar" className="sidebar-close-button" onClick={() => setIsOpen(false)}>
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="sidebar-header">
                        <span className="sidebar-title">FinControl</span>
                    </div>
                    <nav className="sidebar-nav">
                        <a href="/dashboard" className= {`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}>
                            {/* <!-- svg home (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>Dashboard</span>
                        </a>
                        
                        <a href="/users/me" className={`sidebar-link ${isActive("/users/me") ? "active":""}`}>
                            {/* <!-- svg user-group (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                            <span>Meus perfil</span>
                        </a>

                        <a href="/financialGoals/list" className={`sidebar-link ${isActive("/financialGoals/list") ? "active":""}`}>
                            {/* <!-- svg exclamation-triangle (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            <span>Metas Financeiras</span>
                        </a>

                        <a href="/transaction/list" className={`sidebar-link ${isActive("/transaction/list") ? "active":""}`}>
                            {/* <!-- svg cursor-arrow-ripple (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                            </svg>
                            <span>Transações</span>
                        </a>

                        <a href="/categories/list" className={`sidebar-link ${isActive("/categories/list") ? "active":""}`}>
                            {/* <!-- svg cursor-arrow-ripple (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                            </svg>
                            <span>Categorias</span>
                        </a>

                        <a href="#" className="sidebar-link" onClick={handleLogaut}>
                            {/* <!-- svg arrow-left-start-on-rectangle (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                            <span>Sair</span>
                        </a>
                    </nav>
                </div>
            </aside>
        </div>
    )
}

export default SideBar