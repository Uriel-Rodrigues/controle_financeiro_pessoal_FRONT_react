'use client'
// importar o componente de proteção de rotas
import ProtectedRoute from "../components/protectedRoute"
import Link from "next/link"
//importar componente menu 
import Menu from "../components/menu"

export default function Home () {
    return (
        <ProtectedRoute>
            <Menu/>
            
            <br/>

            <h1>Bem vindo ao Dashboard</h1>
            <Link href="/users/list">listar usuarios</Link>

        </ProtectedRoute>
    )
}