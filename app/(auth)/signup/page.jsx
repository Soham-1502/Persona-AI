// import SignUpStyles from "./SignUp.css";
// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const handleChange = ({ currentTarget: input }) => {
//     setData({ ...data, [input.name]: input.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = "http://localhost:8080/api/users";
//       const { data: res } = await axios.post(url, data);
//       localStorage.setItem("token", res.data); // optional
//       navigate("/"); // ✅ Corrected redirection
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.status >= 400 &&
//         error.response.status <= 500
//       ) {
//         setError(error.response.data.message);
//       }
//     }
//   };

//   return (
//     <div className={SignUpStyles.signup_container}>
//       <div className={SignUpStyles.signup_form_container}>
//         <div className={SignUpStyles.left}>
//           <h1> Welcome Back </h1>
//           <Link to="/login">
//             <button type="button" className={SignUpStyles.white_btn}>
//               Sign In
//             </button>
//           </Link>
//         </div>
//         <div className={SignUpStyles.right}>
//           <form
//             className={SignUpStyles.signup_form_container}
//             onSubmit={handleSubmit}
//           >
//             <h1> Create Account </h1>
//             <input
//               type="text"
//               placeholder="First Name"
//               name="firstName"
//               onChange={handleChange}
//               value={data.firstName}
//               required
//               className={SignUpStyles.input}
//             ></input>

//             <input
//               type="text"
//               placeholder="Last Name"
//               name="lastName"
//               onChange={handleChange}
//               value={data.lastName}
//               required
//               className={SignUpStyles.input}
//             ></input>

//             <input
//               type="email"
//               placeholder="email"
//               name="email"
//               onChange={handleChange}
//               value={data.email}
//               required
//               className={SignUpStyles.input}
//             ></input>
//             <input
//               type="password"
//               placeholder="password"
//               name="password"
//               onChange={handleChange}
//               value={data.password}
//               required
//               className={SignUpStyles.input}
//             ></input>
//             {error && <div className={SignUpStyles.error_msg}>{error}</div>}
//             <button type="submit" className={SignUpStyles.green_btn}>
//               Sign Up
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import "./SignUp.css"; // Fixed import

// const SignUp = () => {
//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
  
//   const handleChange = ({ currentTarget: input }) => {
//     setData({ ...data, [input.name]: input.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = "http://localhost:5000/api/auth/register"; // Fixed port to 5000
//       console.log("Submitting data:", data); // Debugging line
//       const { data: res } = await axios.post(url, data);
//       localStorage.setItem("token", res.data);
//       navigate("/Home");
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.status >= 400 &&
//         error.response.status <= 500
//       ) {
//         setError(error.response.data.message);
//       }
//     }
//   };

//   return (
//     <div className="signup_container"> {/* Fixed className */}
//       <div className="signup_form_container"> {/* Fixed className */}
//         <div className="left"> {/* Fixed className */}
//           <h1>Welcome Back</h1>
//           <Link to="/login">
//             <button type="button" className="white_btn"> {/* Fixed className */}
//               Sign In
//             </button>
//           </Link>
//         </div>
//         <div className="right"> {/* Fixed className */}
//           <form
//             className="form_container" 
//             onSubmit={handleSubmit}
//           >
//             <h1>Create Account</h1>
//             <input
//               type="text"
//               placeholder="First Name"
//               name="firstName"
//               onChange={handleChange}
//               value={data.firstName}
//               required
//               className="input" 
//             />

//             <input
//               type="text"
//               placeholder="Last Name"
//               name="lastName"
//               onChange={handleChange}
//               value={data.lastName}
//               required
//               className="input" /* Fixed className */
//             />

//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               onChange={handleChange}
//               value={data.email}
//               required
//               className="input" /* Fixed className */
//             />
            
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               onChange={handleChange}
//               value={data.password}
//               required
//               className="input" /* Fixed className */
//             />
            
//             {error && <div className="error_msg">{error}</div>} {/* Fixed className */}
            
//             <button type="submit" className="green_btn"> {/* Fixed className */}
//               Sign Up
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = "http://localhost:5000/api/auth/register";
      console.log("Submitting data:", data);

      const response = await axios.post(url, data);

      // ✅ FIXED: Access the correct response structure
      console.log("Response:", response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Show success message with generated username
        const generatedUsername = data.firstName + data.lastName;
        console.log("Account created! Username:", generatedUsername);

        // Navigate to home/dashboard
        navigate("/Home");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        // ✅ FIXED: Access the correct error message structure
        setError(error.response.data.message || "Registration failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="white_btn">
              Sign In
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Create Account</h1>

            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={data.firstName}
              required
              className="input"
            />

            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={data.lastName}
              required
              className="input"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
              minLength="6"
            />

            {/* Username Preview */}
            {data.firstName && data.lastName && (
              <div className="username_preview">
                <small>
                  Your username will be:{" "}
                  <strong>{data.firstName + data.lastName}</strong>
                </small>
              </div>
            )}

            {error && <div className="error_msg">{error}</div>}

            <button type="submit" className="green_btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;