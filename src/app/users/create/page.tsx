'use client'
//importar instancia de conecção com a api
import instance from "@/services/api";
//importa hooks do react para usar o estado e os efeitos colaterais
import { useState ,useEffect } from "react";
//importar biblioteca de validação de formulario
import * as yup from "yup"
//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
// importar biblioteca para criação de links
import Link from "next/link";
// importar componente de alerta
import AlertMessage from "@/app/components/alertMessage";


interface User {
    name: string,
    email: string,
    password: string
}

const schema = yup.object().shape({
    name: yup.string().required("nome de usuario obrigatorio!").min(5,"nomde de usuario deve ter minimo de 5 caracteres!"),
    email: yup.string().email().required("email de usuario obrigatorio!"),
    password:yup.string().required("senha de usuario obrigatoria!").min(8, "a senha deve ter minimo de 8 caracteres")
})

export default function User() {
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)
    
    //hook para validação do formulario
    const {register, handleSubmit, formState: {errors}, reset } = useForm({
        resolver: yupResolver(schema)
    })
    
    //função para realizar requisição e capurar dados da api
    const onSubmit = async (data: {name:string, email:string, password: string}) => {

        //iniciar carregamento 
        setLoading(true)
        //limpar erro anterior
        setError(null)
        //limpar sucesso anterior
        setSuccess(null)
        try {
            //fazer requisição para a api
            const response = await instance.post("/users/create", data)
            //retornar mensagem de sucesso 
            setSuccess(response.data.message || "novo usuario cadastrado com sucesso")
            //resetar fomulario
            reset()

        } catch (error: any) {
            // verificar se egiste erro de validação
            if(error.response && error.response.data && error.response.data.message){
                //exibir mensagem caso seja um array
                if(Array.isArray(error.response.data.message)){
                    setError(error.response.data.message.join(" - "))
                }
                else{
                    //retornar mensagem se nao for array
                    setError(error.response.data.message)
                }
            }            
        } finally{
            // finalizar loading
            setLoading(false)
        }
    }

    return(
        <div className="bg-login">
            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-4 shadow-md sm:max-w-md sm:rounded-lg">

                <div className="flex justify-center mb-4">
                    <img src="/image/dindinnn.png" alt="logo" className="h-20 w-20" />
                </div>
                <h1 className="title-login"> Criar Nova Conta</h1>
                <br/>

                {/* mostrar carregando */}
                {loading && <p>Carregando...</p>}
                {/* mostar mensagem deerro caso tenha */}
                <AlertMessage type="error" message={error}/>
                {/* mostrar mensagem de sucesso caso tenha */}
                <AlertMessage type="success" message={success}/>

                {/* mostrar conteudo se tudo ok */}
                {!loading && !error && (  
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                            <div className="form-group-login">
                                <label htmlFor="nameUser" className="form-label-login">Nome: </label>
                                <input 
                                    id="nameUser"
                                    type="text" 
                                    placeholder="Nome de usuario"
                                    className="form-input-login"
                                    {...register("name")}
                                />
                                {/*exibir mensagem de erro na validação do campo*/}
                                {errors.name && <AlertMessage type="error" message={errors.name.message ?? null}/>}
                            </div>
                            <br/>
                            <div className="form-group-login">
                                <label htmlFor="emailUser" className="form-label-login">Email: </label>
                                <input 
                                    id="emailUser"
                                    type="email" 
                                    placeholder="Email de usuario"
                                    className="form-input-login"
                                    {...register("email")}
                                />
                                {/*exibir mensagem de erro na validação do campo*/}
                                {errors.email && <AlertMessage type="error" message={errors.email.message ?? null}/>}
                            </div>
                            <br/>
                            <div className="form-group-login">
                                <label htmlFor="passwordUser" className="form-label-login">Password: </label>
                                <input 
                                    id="passwordUser"
                                    type="password" 
                                    placeholder="Email de usuario"
                                    className="form-input-login"
                                    {...register("password")}
                                />
                                {/*exibir mensagem de erro na validação do campo*/}
                                {errors.password && <AlertMessage type="error" message={errors.password.message ?? null}/>}
                            </div>
                            <br/>
                            <div className="btn-group-login">
                                <Link href= "/login" className="link-login">Login</Link>
                                
                                <button type="submit" disabled={loading} className="btn-primary-md">
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )

}