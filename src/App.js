import "@fontsource/lato"; // Defaults to weight 400
import "@fontsource/lato/400-italic.css"; // Specify weight and style
import "@fontsource/lato/400.css"; // Specify weight
import "@fontsource/source-serif-4"; // Defaults to weight 400
import "@fontsource/source-serif-4/400-italic.css"; // Specify weight and style
import "@fontsource/source-serif-4/400.css"; // Specify weight
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Gallery } from "./Components/Gallery/gallery.tsx";
import { BaseMap } from './Components/Map/map.base.tsx';
import { buildBaseMapProps } from './Config/Builders/base.map.builder.tsx';
import { ENV_VARS } from "./Helpers/env.js";
function App() {
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path={'/map'} element={<BaseMap {...buildBaseMapProps()}/>}/>
                  <Route path={'/gallery'} element={<Gallery channelId={ENV_VARS["CHANNEL_ID"]}/>}/>

              </Routes>

          </BrowserRouter>
      </>
  );
}

export default App;
