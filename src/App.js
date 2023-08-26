import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { BaseMap } from './Components/Map/map.base.tsx';
import { buildBaseMapProps } from './Config/Builders/base.map.builder.tsx';
function App() {
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path={'/map'} element={<BaseMap {...buildBaseMapProps()}/>}/>
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
