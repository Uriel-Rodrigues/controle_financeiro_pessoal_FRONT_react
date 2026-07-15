## Requisitos 
* Conferir a versão do Node.js 22 ou superiror: node -v
* Conferir se está instalado o npx: npx -v

## como rodar o projeto baixado

Alterar o endereço do API no arquivo src/sevices/api.tsx

instalar todas as dependencias indicadas pelo package.json.
```
npm install
```

rodar o projeto React.
```
npm run dev
```
acessar no navegador a URL
```
http://localhost:3000/
```
## sequencia para criar o projeto 

*1 - Criar o projeto com React e Next.js O ponto "." indica que deve ser criado no próprio diretorio*
```
npx create-next-app@latest .
```
*2 - Rodar o projeto React* 
```
npm run dev
```
*3 - Acessar no navegador a URL*
```
http://localhost:3000
``` 
*4 - baixar pacote para conectar a aplicação com a API*
```
npm i axios
```
*5 - instalar a dependenia yup para validar o fomulario. o react-hook-form para gerenciar o formulario. o resolvers para conectar react-hook-form com yup*
```
npm install @hookform/resolvers yup react-hook-form
```
## como enviar e baixar os arquivos do git rub

*1 - Baixar os arquivos do git*
```
git clone -b <branch_name> <repository_url> .
```
*2 - Verificar em qual branch*
```
git branch
```
*3 - Baixar as atualizações do Github*
```
git pull
```
*4 - adicionar todos os arquivos modificados no staging area - area de preparação*
```
git add
```
*5 - Commit representa um conjunto de alterações em um especifico da historia do seu projeto, registra apenas as alterações adicionais ao indice de preparação. O comando -m permite que insira a mensagem de commit diretamente na linha de comando* 
```
git commit -m "base projeto"
```
*6 - enviar os commits locais, para um repositorio remoto.*
```
git push <remote> <branch>
git push origin develop
```