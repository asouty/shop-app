import { render, screen } from "@testing-library/react";
import Authentication, { AuthMode } from "./Authentication.tsx";
import axios from "axios";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
const mockedAxios = jest.mocked(axios);

async function submitForm(emailInput: string, passwordInput: string) {
  userEvent.setup();
  const email = screen.getByPlaceholderText("Enter email");
  await userEvent.type(email, emailInput);
  const password = screen.getByPlaceholderText("Enter password");
  await userEvent.type(password, passwordInput);
  await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
}
describe("when the user logged on", () => {
  it("sign in", async () => {
    let token = "";
    const setAuthenticated = (receivedToken: string) => {
      token = receivedToken;
    };
    mockedAxios.post.mockResolvedValue({ data: { token: "my_token" } });
    render(
      <BrowserRouter>
        <Authentication
          authMode={AuthMode.signing}
          setAuthenticated={setAuthenticated}
        />
      </BrowserRouter>,
    );
    screen.getByRole("link", { name: /Sign Up/i });
    await submitForm("a@a.com", "password");
    expect(token).toBe("my_token");
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/person/authenticate", {
      email: "a@a.com",
      password: "password",
    });
  });
  it("sign up", async () => {
    userEvent.setup();
    let token = "";
    const setAuthenticated = (receivedToken: string) => {
      token = receivedToken;
    };
    mockedAxios.post.mockResolvedValueOnce({});
    mockedAxios.post.mockResolvedValueOnce({ data: { token: "my_token" } });
    render(
      <BrowserRouter>
        <Authentication
          authMode={AuthMode.signup}
          setAuthenticated={setAuthenticated}
        />
      </BrowserRouter>,
    );
    screen.getByRole("link", { name: /Sign In/i });
    await submitForm("a@a.com", "password");
    expect(token).toBe("my_token");
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/person", {
      email: "a@a.com",
      password: "password",
    });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/person/authenticate", {
      email: "a@a.com",
      password: "password",
    });
  });
});
