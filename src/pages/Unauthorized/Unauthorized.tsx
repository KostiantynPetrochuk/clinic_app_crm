import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <section style={{ textAlign: "center" }}>
      <h1>Відхилено!</h1>
      <br />
      <p>Ви не маєте доступу до цієї сторінки.</p>
      <div>
        <button onClick={goBack}>Назад</button>
      </div>
    </section>
  );
};

export default Unauthorized;
