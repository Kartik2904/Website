import './App.css';
import GenerateCertificate from './components/GenerateCertificate.js';
import { Login } from './components/Login.js';
import CertificateGenerator from './components/CertificateGenerator.js';
import { Register } from './components/Register.js';
import SearchRecord from './components/SearchRecord.js';
// import TodoFetch from "./components/TodoFetch.js";



function App() {

  return <>
  {/* {
   <TodoFetch/>
  }

  {
    <Register/>
  }
  {
    <Login/>
  } */}

  {
   <GenerateCertificate/>
  }
  </>
}

export default App;