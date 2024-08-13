import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthMode = { signing: "signing", signup: "signup" } as const;

type AuthMode = (typeof AuthMode)[keyof typeof AuthMode];

interface Props {
  authMode: AuthMode;
  setAuthenticated: (token: string, personId: string) => void;
}

interface Person {
  password: string;
  email: string;
}

export default function Authentication(props: Props) {
  const emptyPerson: Person = { email: "", password: "" };
  const [person, setPerson] = useState<Person>(emptyPerson);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, [e.target.name]: e.target.value });
  }

  async function authenticate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (props.authMode == AuthMode.signup) {
      try {
        await axios.put("/api/person", person);
      } catch (e) {
        console.log(e);
      }
    }
    try {
      const response = await axios.post("/api/person/authenticate", person);
      props.setAuthenticated(response.data.token, response.data.id);
      navigate("/");
    } catch (e) {
      setErrorMessage("Authentication failed");
      console.log(e);
    }
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={authenticate}>
        <div className="Auth-form-content">
          <AuthModeLink authMode={props.authMode} />
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              name="email"
              value={person.email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              name="password"
              value={person.password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            {errorMessage && <h6 className="error"> {errorMessage} </h6>}
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

function AuthModeLink(props: { authMode: AuthMode }) {
  if (props.authMode === AuthMode.signing) {
    return (
      <>
        <h3 className="Auth-form-title">Sign In</h3>
        <div className="text-center">
          Not registered yet?{" "}
          <Link className="link-primary" to={"/" + AuthMode.signup}>
            Sign Up
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h3 className="Auth-form-title">Sign Up</h3>
        <div className="text-center">
          Already registered?{" "}
          <Link className="link-primary" to={"/" + AuthMode.signing}>
            Sign In
          </Link>
        </div>
      </>
    );
  }
}
