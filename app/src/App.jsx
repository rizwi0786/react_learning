import { useEffect } from 'react';
import { useRoute, href } from './lib/router.js';
import { useStore, themeStore } from './lib/store.js';
import Home from './pages/Home.jsx';
import Lesson from './pages/Lesson.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Sprint from './pages/Sprint.jsx';

const NEXT_THEME = { auto: 'light', light: 'dark', dark: 'auto' };
const THEME_ICON = { auto: '◐', light: '☀', dark: '☾' };

export default function App() {
  const { parts, query } = useRoute();
  const theme = useStore(themeStore);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme);
  }, [theme]);

  let page;
  if (parts[0] === 'lesson' && parts[1]) page = <Lesson id={parts[1].replace(/-REV$/, '')} rev={parts[2] === 'rev' || /-REV$/.test(parts[1])} />;
  else if (parts[0] === 'roadmap') page = <Roadmap />;
  else if (parts[0] === 'sprint') page = <Sprint />;
  else page = <Home query={query} />;

  useEffect(() => { if (parts[0] !== 'lesson') window.scrollTo({ top: 0 }); }, [parts[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-in">
          <a className="brand" href={href('')}><span className="logo" aria-hidden="true">⚛</span> React Mastery</a>
          <nav className="topnav">
            <a href={href('')} className={!parts[0] ? 'on' : ''}>Course</a>
            <a href={href('sprint')} className={parts[0] === 'sprint' ? 'on' : ''}>⚡ Sprint</a>
            <a href={href('roadmap')} className={parts[0] === 'roadmap' ? 'on' : ''}>Roadmap</a>
            <button type="button" className="theme" onClick={() => themeStore.set(NEXT_THEME[theme])} aria-label={`Theme: ${theme}. Change theme`} title={`Theme: ${theme}`}>{THEME_ICON[theme]}</button>
          </nav>
        </div>
      </header>
      {page}
      <footer className="wrap foot">Progress is saved in this browser. Learn and Interview tracks are tracked separately. Built with React 19 + Vite.</footer>
    </>
  );
}
