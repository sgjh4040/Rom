import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Index';
import { RomMeasurement } from './pages/RomMeasurement';
import { Results } from './pages/Results';
import { CesProtocol } from './pages/CesProtocol';
import { CesPlayerPage } from './pages/CesPlayerPage';
import { CesFlutterPage } from './pages/CesFlutterPage';
import { Settings } from './pages/Settings';
import { Trends } from './pages/Trends';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/measure" element={<RomMeasurement />} />
        <Route path="/results" element={<Results />} />
        <Route path="/ces" element={<CesProtocol />} />
        <Route path="/ces-player" element={<CesPlayerPage />} />
        <Route path="/ces-flutter" element={<CesFlutterPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trends" element={<Trends />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
