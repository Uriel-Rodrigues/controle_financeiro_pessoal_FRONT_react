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
//exportar instancia para ser utilizada em outras partes do projeto
export default instance