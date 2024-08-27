export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <img src={`${import.meta.env.BASE_URL}logo64.png`} alt="logo" />
      {/* <h1 className="logo_text">Admin</h1> */}
    </div>
  );
}
