//importar instancia Axios e o tipo axiosInstance para tiágem da instancia
import axios, { AxiosInstance } from "axios";

//definir o tipo para a instancia do axios
//criar uma instancia personalizada do axios com configuração padrão 
const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080", // dfinir url bae ára todas asrequisições
    headers: {
        "Content-Type": "application/json", //definir cabeçalho padrão para envio de dados no formato json
    }
})

//interceptor para adicionar o token automaticamente nas requisições
instance.interceptors.request.use((config)=> {
    //verificar se esta no cliente antes de acessar o localStorage
    if(typeof window !== "undefined"){
        const token = localStorage.getItem("token")
        if(token) {
            config.headers.Authorization = `Bearer ${token}` 
        }
    }
    return config
}, (error) =>{
    return Promise.reject(error)
}

)

//exportar instancia para ser utilizada em outras partes do projeto
export default instance