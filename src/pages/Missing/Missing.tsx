import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants";

const Missing = () => {
  return (
    <article style={{ padding: "100px" }}>
      <h1>Йой!</h1>
      <p>Сторінку не знайдено</p>
      <div>
        <Link to={APP_ROUTES.HOME}>На домашню сторінку</Link>
      </div>
    </article>
  );
};

export default Missing;
