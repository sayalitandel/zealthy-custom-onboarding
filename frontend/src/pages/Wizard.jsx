import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlowConfig, registerUser, updateUserStep } from '../utils/api';

const STORAGE_KEY = 'onboardingProgress'; // saving progress locally

const initialF = {
  email:'', password:'', aboutMe:'', birthdate:'',
  street:'', city:'', state:'', zip:''
};

const loadProgress = () => {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
};
const saveProgress = (p) => localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
const clearProgress = () => localStorage.removeItem(STORAGE_KEY);

export default function Wizard() {
  
  const [cfg, setCfg] = useState(null);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  // const [f, setF] = useState({ email:'', password:'', aboutMe:'', birthdate:'', street:'', city:'', state:'', zip:'' });
  const [f, setF] = useState(initialF);
  const [resumeOffer, setResumeOffer] = useState(null);

  const navigate = useNavigate();

  // useEffect(() => { (async () => { const cfgData = await getFlowConfig(); setCfg(cfgData); })(); }, []);
  useEffect(() => {
    (async() => {
      const cfgData = await getFlowConfig();
      setCfg(cfgData);
    })();

    const saved = loadProgress();
    if (saved?.userId) setResumeOffer(saved);
  }, []);
  // const on = e => setF(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const on = e => {
    const next = { ...f, [e.target.name]: e.target.value};
    setF(next);
    if (userId) {
      saveProgress({ userID, step, data: next });
    }
  };

  const submit = async () => {
    if (step === 4) return;

    if (step === 1) {
      if (!f.email || !f.password) { alert('Email & password required'); return; }

      try {
      const reg = await registerUser(f.email, f.password); // reg = { userId }
      setUserId(reg.userId);

      saveProgress({ userId: reg.userId, step: 2, data: {} });

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

    if (step === 2) {
      const draft = {
        aboutMe: f.aboutMe,
        birthdate: f.birthdate,
        street: f.street,
        city: f.city,
        state: f.state,
        zip: f.zip,
      };
      saveProgress({ userId, step: 3, data: draft });
    }

    if (step === 3) { 
      clearProgress();
      setStep(4);
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
          <input name="zip" placeholder="Zip" value={f.zip} 
           onChange={(e) => setF(prev => ({ ...prev, zip: e.target.value.replace(/\D/g, '')}))}
           inputMode="numeric" maxLength={5}
            />
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

      {step === 1 && resumeOffer && (
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 8,
          background: '#FFF8E1', border: '1px solid #FFE082'
        }}>
          <div style={{ marginBottom: 8 }}>
            Looks like you started onboarding earlier. Resume where you left off?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                const saved = loadProgress();
                if (!saved) return;
                setUserId(saved.userId);
                setStep(saved.step ?? 2);
                setF(prev => ({ ...prev, ...saved.data }));
                setResumeOffer(null);
              }}
            >
              Resume
            </button>
           <button type="button" onClick={() => setResumeOffer(null)}>Not now</button>
          </div>
        </div>
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
      </div>
      </div>
    )}
      </div>
  );
}
