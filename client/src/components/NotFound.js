import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>Sorry</h2>
      <p>this isn't a page!</p>
      <Link to="/">Back to the home</Link>
    </div>
  );
};

export default NotFound;
