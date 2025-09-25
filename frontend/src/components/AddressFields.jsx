export default function AddressFields({ value, onChange, errors = {} }) {
  return (
    <>
      <label htmlFor="street">Street Address</label>
      <input id="street" name="street" value={value.street} onChange={onChange}/>
      {errors.street && <div className="error">{errors.street}</div>}

      <label htmlFor="city">City</label>
      <input id="city" name="city" value={value.city} onChange={onChange}/>
      {errors.city && <div className="error">{errors.city}</div>}

      <label htmlFor="state">State</label>
      <input id="state" name="state" value={value.state} onChange={onChange}/>
      {errors.state && <div className="error">{errors.state}</div>}

      <label htmlFor="zip">ZIP Code</label>
      <input
        id="zip" name="zip" value={value.zip}
        onChange={(e) => onChange({ target: { name:'zip', value: e.target.value.replace(/\D/g,'') } })}
        inputMode="numeric" maxLength={5}
      />
      {errors.zip && <div className="error">{errors.zip}</div>}
    </>
  );
}