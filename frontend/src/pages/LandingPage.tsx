import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { hasAuthSession } from "../utils/authSession";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isLoggedIn = hasAuthSession();
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-main px-6">
      <div className="ambient-orb motion-float left-[-5rem] top-20 h-52 w-52 bg-bg-primaryBtn/20" />
      <div className="ambient-orb motion-float-delayed right-[-4rem] top-32 h-64 w-64 bg-bg-secondaryBtn" />
      <div className="ambient-orb motion-float bottom-10 right-[18%] h-40 w-40 bg-bg-tag" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div
          className="glass-panel motion-fade-up max-w-5xl rounded-[2rem] border border-border-soft px-8 py-12 text-center shadow-2xl"
          style={{ "--motion-delay": "60ms" } as CSSProperties}
        >
          <p
            className="motion-fade-up text-sm font-semibold uppercase tracking-[0.35em] text-text-secondary"
            style={{ "--motion-delay": "140ms" } as CSSProperties}
          >
            Your Calm Knowledge Hub
          </p>
          <h1
            className="motion-fade-up mb-6 mt-4 text-4xl font-extrabold text-text-primary sm:text-6xl"
            style={{ "--motion-delay": "220ms" } as CSSProperties}
          >
            Welcome to <span className="text-bg-primaryBtn">Brainly</span>
          </h1>
          <p
            className="motion-fade-up mx-auto mb-8 max-w-2xl text-lg text-text-secondary sm:text-xl"
            style={{ "--motion-delay": "300ms" } as CSSProperties}
          >
            Organize your ideas, save valuable content, and build your second
            brain. Brainly keeps your links, notes, and references in one place
            with a smoother, more thoughtful flow.
          </p>
          <div
            className="motion-fade-up flex justify-center"
            style={{ "--motion-delay": "380ms" } as CSSProperties}
          >
            <Button
              name="Get Started"
              type="primary"
              size="lg"
              onClickHandler={handleGetStarted}
            />
          </div>
        </div>

        <div className="mt-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          {[
            "Collect articles, videos, and documents in one place.",
            "Search your own mental library through clean filters.",
            "Share a curated brain that feels polished and personal.",
          ].map((item, index) => (
            <div
              key={item}
              className="glass-panel motion-fade-up rounded-2xl border border-border-soft px-5 py-4 text-left text-sm text-text-secondary shadow-lg"
              style={
                { "--motion-delay": `${460 + index * 90}ms` } as CSSProperties
              }
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
