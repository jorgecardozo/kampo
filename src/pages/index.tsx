// La ruta '/' siempre redirige (ver getServerAuth). Este componente no se renderiza.
const Home = () => null

export default Home

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
