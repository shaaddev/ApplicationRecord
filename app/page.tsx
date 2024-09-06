import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function LandingPage() {
  return (
    // <iframe
    //   src="/landing/index.html"
    //   style={{ width: "100%", height: "100vh", border: "none" }}
    // ></iframe>
    <main className="flex flex-col items-center justify-between p-10 lg:p-16">
      <h1>Hello!</h1>
      <p>Feel free to login below</p>
      <LoginLink postLoginRedirectURL="/application-record">
        Login
      </LoginLink>
    </main>
  );
}
