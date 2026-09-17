import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import PartnersPage from './src/app/components/PartnersPage';
import './src/styles/index.css';
import './src/styles/contrast-fixes.css';
document.documentElement.lang = 'fr';
document.body.style.margin = '0';
createRoot(document.getElementById('root')!).render(<div className="sbre-theme theme-light"><HashRouter><PartnersPage/></HashRouter></div>);
