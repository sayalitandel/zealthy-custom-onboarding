import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlowConfig, registerUser, updateUserStep } from '../utils/api';

export default function Wizard() {
  const [cfg, setCfg] = useState(null);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [f, setF] = useState({ email:'', password:'', aboutMe:'', birthdate:'', street:'', city:'', state:'', zip:'' });

  const navigate = useNavigate();

  useEffect(() => { (async () => { const cfgData = await getFlowConfig(); setCfg(cfgData); })(); }, []);
  const on = e => setF(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (step === 4) return;

    if (step === 1) {
      if (!f.email || !f.password) { alert('Email & password required'); return; }

      try {
      const reg = await registerUser(f.email, f.password); // reg = { userId }
      setUserId(reg.userId);

      if (!cfg) {
        const resp = await getFlowConfig();
        const cfgData = resp?.data ?? resp;  
        setCfg(cfgData);
      }

      setStep(2);
     } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
      alert(msg || 'Register failed');
      console.error('register error:', err?.response?.data || err);
    } 
      return;
  }

    const comps = step === 2 ? cfg.page2 : cfg.page3;
    const payload = {};
    if (comps.includes('aboutMe')) payload.aboutMe = f.aboutMe;
    if (comps.includes('birthdate')) payload.birthdate = f.birthdate;
    if (comps.includes('address')) payload.address = { street: f.street, city: f.city, state: f.state, zip: f.zip };
    await updateUserStep(userId, payload);
    // if (step === 3) { window.location.href = '/data'; } else setStep(3);
    // if (step === 3) { navigate('/'); return; } else setStep(3);
    if (step === 3) { setStep(4);
       return; 
    } else { 
      setStep(3);
    }
  };

  if (!cfg && (step === 2 || step === 3)) return <p>Loading…</p>; 

  const fields = (page) => (
    <>
      {page.includes('aboutMe') && (<textarea name="aboutMe" placeholder="About me" value={f.aboutMe} onChange={on} />)}
      {page.includes('birthdate') && (<input name="birthdate" type="date" value={f.birthdate} onChange={on} />)}
      {page.includes('address') && (
        <>
          <input name="street" placeholder="Street" value={f.street} onChange={on} />
          <input name="city" placeholder="City" value={f.city} onChange={on} />
          <input name="state" placeholder="State" value={f.state} onChange={on} />
          <input name="zip" placeholder="Zip" value={f.zip} onChange={on} />
        </>
      )}
    </>
  );

  return (
    <div style={{display:'grid', gap:12, maxWidth:520}}>
      <h3>{step <= 3 ? `Onboarding — Step ${step} of 3` : 'All set!'}</h3>
      {step===1 && (
        <>
          <input name="email" placeholder="Email" value={f.email} onChange={on} />
          <input name="password" type="password" placeholder="Password" value={f.password} onChange={on} />
        </>
      )}
      {step===2 && fields(cfg.page2)}
      {step===3 && fields(cfg.page3)}
      {step <= 3 && (
        <button onClick={submit} disabled={step !== 1 && !cfg}>
          {step === 3 ? 'Finish' : 'Next'}
        </button>
      )}
      {step === 4 && (
      <div style={{
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        background: '#EEF7FF',
        border: '1px solid #B3DAFF'
      }}>
      <h3 style={{ margin: 0 }}>Submission successful 🎉</h3>
      <p style={{ margin: '8px 0 12px' }}>Your onboarding info has been saved.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => { window.location.href = '/'; }}>
          OK (Go to start)
        </button>
        {/* Optional for reviewers only: */}
        {/* <a href="/data"><button type="button">View Data (testing)</button></a> */}
      </div>
      </div>
    )}
      </div>
  );
}
