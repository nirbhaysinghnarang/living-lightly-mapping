import BaseMap from "./Components/Map/base.map";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import { ApplicationConfiguration } from "./Config";
import { env_vars } from "./Helpers/env";
const ApplicationConfiguration = {

}
function App() {

  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path={'/map'} element={<BaseMap/>}/>
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
