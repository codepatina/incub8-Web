import React, {useState} from 'react';
import incub8API from '../api/incub8API'
import { LoginContext } from '../context/loginContext'
import { Redirect, navigate } from '@reach/router'
import { ToastContainer } from 'react-toastify'
import formHasEmptyFields from "../utils/form-has-empty-fields";
import { errorNotification } from '../utils/toastNotifications';
import "react-toastify/dist/ReactToastify.css";
import '../styles/form.css'

const Login = (props) => {

      
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const formData = {
      username,
      password
    }

    

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await incub8API.post("/auth" , {"username": username, "password": password})
          console.log(response)
          localStorage.setItem("token", response.data.access_token)
          localStorage.setItem("user", response.data.username)
          localStorage.setItem("user_id", response.data.user_id)
          props.setToken(response.data.access_token)
          props.setUser(response.data.username)
          props.setUserID(response.data.username)
          navigate("/profile")

        } catch (error) {
          errorNotification(error.response.data.message)
        }
    }

    const renderFormOrRedirect = () => {
        if (props.user_id && props.token) {
          return <Redirect to="/profile" noThrow />
        } else {
        return (
          <section className="uk-flex uk-flex-row  uk-flex-middle	uk-flex-center uk-margin-xlarge-top">
            <div className="uk-animation-slide-left-small">
              <form
                className="register-form-step-1 uk-padding-small"
                onSubmit={handleSubmit}
              >
                <h1 className="form-title">Login to Existing Account</h1>
                <div className="uk-margin">
                  <label className="uk-form-label">Username</label>
                  <input
                    onChange={(event) => setUsername(event.target.value)}
                    name="username"
                    value={username}
                    className="uk-input uk-form-width-large"
                    type="text"
                  />
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label">Password</label>
                  <input
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    name="password"
                    className="uk-input uk-form-width-large"
                    type="password"
                  />
                </div>
                <button
                  disabled={formHasEmptyFields(formData)}
                  type="submit"
                  className="uk-button uk-button-default uk-text-capitalize login-form-submit-button"
                >
                  Submit
                </button>
              </form>
              <ToastContainer />
            </div>
          </section>
        );
    }
    }

    return (
      <>
        {renderFormOrRedirect()}
      </>
    )
    }


const LoginWithContext = () => {
    return (
        <LoginContext.Consumer>
            {value => {
                return <Login {...value} />
            }}
        </LoginContext.Consumer>
    )
}

export default LoginWithContext;