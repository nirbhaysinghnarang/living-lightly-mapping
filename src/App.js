import "@fontsource/lato"; // Defaults to weight 400
import "@fontsource/lato/400-italic.css"; // Specify weight and style
import "@fontsource/lato/400.css"; // Specify weight
import "@fontsource/source-serif-4"; // Defaults to weight 400
import "@fontsource/source-serif-4/400-italic.css"; // Specify weight and style
import "@fontsource/source-serif-4/400.css"; // Specify weight
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BaseMap } from './Components/Map/map.base.tsx';
import { buildBaseMapProps } from './Config/Builders/base.map.builder.tsx';
function App() {
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path={'*'} element={<BaseMap {...buildBaseMapProps()}/>}/>
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
