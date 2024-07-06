import React, {Fragment} from "react";

/*** Layout */
import Header from './componentes/layout/Header';
import Navegacion from './componentes/layout/Navegacion';

function App() {
  return(
    <Fragment>
      <Header />

      <div class="grid contenedor contenido-principal">
        <Navegacion />  
        
        <main class="caja-contenido col-9">
        </main>
      </div>

    </Fragment>
  )
}

export default App;
