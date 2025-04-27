// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';
import ProjectList from './components/ProjectList';
import ProjectManagement from './components/ProjectManagement';
import NavigationBar from './components/NavigationBar';
import './i18n/i18n';

function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/project/:id" element={<ProjectManagement />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;