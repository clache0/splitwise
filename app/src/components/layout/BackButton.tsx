import { useNavigate } from "react-router"

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="back-button button"
      onClick={() => navigate(-1)}
    >
      Back
    </div>
  )
}
export default BackButton;