import React, { useEffect, useState } from 'react';
import { getFlowConfig, updateFlowConfig } from '../utils/api';

const ALL = ['aboutMe','address','birthdate'];

export default function AdminPage() {
  const [cfg, setCfg] = useState({ page2: [], page3: [] });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try { setCfg(await getFlowConfig()); }
      catch { setMsg('Failed to load config'); }
    })();
  }, []);

  const toggle = (page, comp) => {
    setCfg(prev => {
      const s = new Set(prev[page]);
      s.has(comp) ? s.delete(comp) : s.add(comp);
      return { ...prev, [page]: [...s] };
    });
  };

  const save = async () => {
    if (!cfg.page2.length || !cfg.page3.length) { setMsg('Each page needs at least one component'); return; }
    try { await updateFlowConfig(cfg); setMsg('Saved'); }
    catch { setMsg('Save failed'); }
  };

  const row = (page) => (
    <div style={{marginBottom:16}}>
      <h3>{page.toUpperCase()}</h3>
      {ALL.map(c => (
        <label key={c} style={{marginRight:12}}>
          <input type="checkbox" checked={cfg[page]?.includes(c)} onChange={() => toggle(page, c)} /> {c}
        </label>
      ))}
    </div>
  );

  return (
    <div style={{maxWidth:720, margin:'40px auto', fontFamily:'system-ui'}}>
      <h2>Admin — Configure Onboarding Pages</h2>
      {row('page2')}
      {row('page3')}
      <button onClick={save}>Save</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
