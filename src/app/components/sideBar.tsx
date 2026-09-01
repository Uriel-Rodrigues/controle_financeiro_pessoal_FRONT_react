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
                            {/* <!-- svg user (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <span>Meus perfil</span>
                        </a>

                        <a href="/financialGoals/list" className={`sidebar-link ${isActive("/financialGoals/list") ? "active":""}`}>
                            {/* <!-- svg arrow-trending-up (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                            </svg>

                            <span>Metas Financeiras</span>
                        </a>

                        <a href="/transaction/list" className={`sidebar-link ${isActive("/transaction/list") ? "active":""}`}>
                            {/* <!-- svg arrows-right-left (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>

                            <span>Transações</span>
                        </a>

                        <a href="/categories/list" className={`sidebar-link ${isActive("/categories/list") ? "active":""}`}>
                            {/* <!-- svg rectangle-group (Heroicons) --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
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