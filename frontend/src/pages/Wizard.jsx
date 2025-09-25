import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlowConfig, registerUser, updateUserStep } from '../utils/api';

import AboutMeField from '../components/AboutMeField';
import BirthdateField from '../components/BirthdateField';
import AddressFields from '../components/AddressFields';

const STORAGE_KEY = 'onboardingProgress'; 

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
  const [f, setF] = useState(initialF);
  const [resumeOffer, setResumeOffer] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    (async() => {
      const cfgData = await getFlowConfig();
      setCfg(cfgData);
    })();

    const saved = loadProgress();
    if (saved?.userId) setResumeOffer(saved);
  }, []);

  const on = e => {
    const next = { ...f, [e.target.name]: e.target.value};
    setF(next);
    if (userId) {
      saveProgress({ userId, step, data: next });
    }
  };

  const emailOk = (v) => /\S+@\S+\.\S+/.test(v);

  function validateStep(curStep) {
  const nextErrors = {};

  if (curStep === 1) {
    if (!f.email || !emailOk(f.email)) nextErrors.email = 'Please enter a valid email.';
    if (!f.password || f.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
  } else {
    const comps = curStep === 2 ? cfg.page2 : cfg.page3;

    if (comps.includes('aboutMe') && !f.aboutMe.trim()) {
      nextErrors.aboutMe = 'Please tell us a bit about yourself.';
    }

    if (comps.includes('birthdate')) {
      if (!f.birthdate) nextErrors.birthdate = 'Please select your birthdate.';
      else if (new Date(f.birthdate) > new Date()) nextErrors.birthdate = 'Birthdate cannot be in the future.';
    }
  }

  setErrors(nextErrors);
  return Object.keys(nextErrors).length === 0;
}

  const submit = async () => {
    if (step === 4) return;

    if (!validateStep(step)) {
      const el = document.querySelector(".error");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (step === 1) {

      try {
      const reg = await registerUser(f.email, f.password);
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

  const goBack = () => {
    if (step <= 1) return;
    setStep(step - 1);
  };

  if (!cfg && (step === 2 || step === 3)) return <p>Loading…</p>; 

  return (
    <div className="container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="stepper">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`dot ${step >= n ? "active" : ""}`} />
          ))}
        </div>

        <h3>{step <= 3 ? `Step ${step} of 3` : "All set!"}</h3>

        {step === 1 && (
          <>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="Email"
              value={f.email}
              onChange={on}
            />
            {errors.email && <div className="error">{errors.email}</div>}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={f.password}
              onChange={on}
            />
            {errors.password && <div className="error">{errors.password}</div>}

            {resumeOffer && (
              <div className="resume-banner">
                <div style={{ marginBottom: 8 }}>
                  Looks like you started onboarding earlier. Resume where you
                  left off?
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const saved = loadProgress();
                    if (!saved) return;
                    setUserId(saved.userId);
                    setStep(saved.step ?? 2);
                    setF((prev) => ({ ...prev, ...saved.data }));
                    setResumeOffer(null);
                  }}
                >
                  Resume
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {cfg.page2.includes("aboutMe") && (
              <AboutMeField
                value={f.aboutMe}
                onChange={on}
                error={errors.aboutMe}
              />
            )}
            {cfg.page2.includes("birthdate") && (
              <BirthdateField
                value={f.birthdate}
                onChange={on}
                error={errors.birthdate}
              />
            )}
            {cfg.page2.includes("address") && (
              <AddressFields
                value={{
                  street: f.street,
                  city: f.city,
                  state: f.state,
                  zip: f.zip,
                }}
                onChange={on}
                errors={errors.address || {}}
              />
            )}
          </>
        )}

        {step === 3 && (
          <>
            {cfg.page3.includes("aboutMe") && (
              <AboutMeField
                value={f.aboutMe}
                onChange={on}
                error={errors.aboutMe}
              />
            )}
            {cfg.page3.includes("birthdate") && (
              <BirthdateField
                value={f.birthdate}
                onChange={on}
                error={errors.birthdate}
              />
            )}
            {cfg.page3.includes("address") && (
              <AddressFields
                value={{
                  street: f.street,
                  city: f.city,
                  state: f.state,
                  zip: f.zip,
                }}
                onChange={on}
                errors={errors.address || {}}
              />
            )}
          </>
        )}

        {step <= 3 && (
          <div className="button-row">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={goBack}>
                Back
              </button>
            )}
            <button type="submit" disabled={step !== 1 && !cfg}>
              {step === 3 ? "Finish" : "Next"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="success-banner">
            <h3 style={{ margin: 0 }}>Submission successful 🎉</h3>
            <p style={{ margin: "8px 0 12px" }}>
              Your onboarding info has been saved.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                OK (Go to start)
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
