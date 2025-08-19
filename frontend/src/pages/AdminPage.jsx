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
      const other = page === 'page2' ? 'page3' : 'page2';

      const thisSet = new Set(prev[page]);
      const otherSet = new Set(prev[other]);

      const isChecked = thisSet.has(comp);

      if (isChecked) {
        if (thisSet.size === 1) {
          return prev;
        }
        thisSet.delete(comp);
      } else {
        thisSet.add(comp);
        otherSet.delete(comp);
      }
      
      // const s = new Set(prev[page]);
      // s.has(comp) ? s.delete(comp) : s.add(comp);
      // return { ...prev, [page]: [...s] };
      return { ...prev, [page]: [...thisSet], [other]: [...otherSet] };
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
      {ALL.map(c => {
        const checked = !!cfg[page]?.includes(c);
        const onlyOnPage = checked && (cfg[page]?.length === 1);

        return (
        <label key={c} style={{marginRight:12}}>
          <input type="checkbox" checked={checked} disabled={onlyOnPage} onChange={() => toggle(page, c)} /> {c}
        </label>
        );
      })}
    </div>
  );

  return (
    <div
      style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}
    >
      <h2>Admin — Configure Onboarding Pages</h2>
      <p style={{ margin: "8px 0 16px", color: "#444" }}>
        Configure which data components appear on each page.{" "}
        <b>Each page must have at least one component</b>. A component can
        appear on <b>only one</b> of the two pages.
      </p>
      {row("page2")}
      {row("page3")}
      <button onClick={save}>Save</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
