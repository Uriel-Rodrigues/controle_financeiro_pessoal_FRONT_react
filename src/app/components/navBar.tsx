'use client'

//importa hooks para manipular a navegação do usuario
import { useRouter } from "next/navigation";

// importa hooks do react para usar o estado "useState", os efeitos colaterais "useEffect" e useRef para criar uma referencia ao elemento
import { useEffect, useRef, useState } from "react";

const NavBar = ({setIsOpen}: {setIsOpen: (isOpen:boolean) => void}) => {

    //estado para controlar se o dopdown esta aberto ou fechado. começa com "false"(fechado)
    const [dropdownOpen, setDropdowOpen] = useState(false)

    //criar uma refrencia para armazenar o elemento do dropdown
    const dropdownRef = useRef<HTMLDivElement>(null)

    //useEffect é executado quando o componente é montado e desmontado 
    useEffect(() => {
        //função para detectar cliques fora do dropdown
        function handleClickOutside(event: MouseEvent) {

            //verificar se o dropdown tem um valor e se o clique NÃO foi dentro do dropdown
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                //fechar o dropdown se o clique foi fora dele
                setDropdowOpen(false)
            }
        }

        //adicionar um ouvinte de evento para detectar clics no documento inteiro 
        document.addEventListener('mousedown', handleClickOutside)

        //função de limpeza: remove o evento ao desmontar o componente
        return () => {
           document.removeEventListener('mousedown',handleClickOutside)
        }

    },[])// o array vazio indica que o efeito só roda na montagem e desmontagem do componente


    //istanciar o objeto router 
    const router= useRouter()

    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    }

    return (
        <div>
            {/* <!-- Navbar --> */}
            <nav className="navbar">
                <div className="navbar-container" >
                    <button id="toggleSidebar" className="menu-button" onClick={() =>setIsOpen(true) } >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                    <div className="user-container">
                        <div ref={dropdownRef} >
                            {/* <!-- Dropdown --> */}
                            <button id="userDropdowButton" className="dropdown-button" onClick={() => setDropdowOpen(!dropdownOpen)}>
                                Usuario
                                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                // {/* <!-- conteudo do dropdown --> */}
                                <div id="dropdownContent" className="dropdown-content">
                                    <a href="#" className="dropdown-item ">Perfil</a>
                                    <a href="#" onClick={handleLogaut} className="dropdown-item ">Sair</a>
                                </div> 
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar