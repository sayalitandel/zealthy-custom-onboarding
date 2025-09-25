export default function AboutMeField({ value, onChange, error }) {
  return (
    <>
      <label htmlFor="aboutMe">About Me</label>
      <textarea id="aboutMe" name="aboutMe" value={value} onChange={onChange} />
      {error && <div className="error">{error}</div>}
    </>
  );
}