import { Link } from "react-router-dom";
import errorImg from "../assets/404.jpg";

const NotFound = () => {
  return (
    <div className="h-screen bg-bg-main px-4 text-center text-text-primary flex flex-col justify-center items-center">
      <img src={errorImg} className="w-96"></img>
      {/* <h1 className="text-6xl font-bold text-text-primary mb-4 py-4">404</h1> */}
      <p className="text-lg text-text-secondary  mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <button className="rounded-lg bg-bg-primaryBtn px-6 py-3 text-text-primaryBtn shadow-md transition hover:bg-opacity-90">
          Go Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
