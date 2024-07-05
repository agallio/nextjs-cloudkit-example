export default function LoginPage() {
  const onClick = async () => {
    try {
      const res = await fetch("/api/auth/login");
      const json = await res.json();

      if (json.serverErrorCode === "AUTHENTICATION_REQUIRED") {
        window.location.href = json.redirectURL;
        return;
      }

      console.log(json);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Login Page</h1>
      <button
        className="rounded-lg border bg-white px-2 py-1"
        onClick={onClick}
      >
        Login
      </button>
    </div>
  );
}
