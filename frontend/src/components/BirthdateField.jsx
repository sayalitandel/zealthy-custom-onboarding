const todayStr = new Date().toISOString().slice(0, 10);

export default function BirthdateField({ value, onChange, error }) {
  return (
    <>
      <label htmlFor="birthdate">Birthdate</label>
      <input
        id="birthdate"
        name="birthdate"
        type="date"
        max={todayStr}
        min="1900-01-01"
        value={value}
        onChange={onChange}
      />
      {error && <div className="error">{error}</div>}
    </>
  );
}