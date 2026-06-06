import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ConvLab } from './pages/ConvLab';
import { BackboneLab } from './pages/BackboneLab';
import { NeckLab } from './pages/NeckLab';
import { HeadLab } from './pages/HeadLab';
import { AnchorLab } from './pages/AnchorLab';
import { NMSLab } from './pages/NMSLab';
import { FormulaLibrary } from './pages/FormulaLibrary';
import { PipelinePage } from './pages/PipelinePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/labs/conv" element={<ConvLab />} />
          <Route path="/labs/backbone" element={<BackboneLab />} />
          <Route path="/labs/neck" element={<NeckLab />} />
          <Route path="/labs/head" element={<HeadLab />} />
          <Route path="/labs/anchor" element={<AnchorLab />} />
          <Route path="/labs/nms" element={<NMSLab />} />
          <Route path="/formulas" element={<FormulaLibrary />} />
          <Route path="/pipeline" element={<PipelinePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
