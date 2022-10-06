import { useNavigate } from "react-router-dom";
import Add from "../img/addAvatar.png";
import { firebaseSignUp } from "../utils/firebase.js";

const Register = () => {
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    const user = await firebaseSignUp(email, password, displayName, file);
    
    if (user) {
      navigate("/");
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Users Chat</span>
        <span className="title">Register</span>
        <form onSubmit={(e) => submitHandler(e)}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
        </form>
        <p>You do have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
