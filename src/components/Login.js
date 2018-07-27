import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class Login extends Component {
    state = {
        login: true, // switch between Login and SignUp
        email: '',
        password: '',
        name: '',
    }

    render() {
        return (
            <div className="container">

                <h2 className="container row ">{this.state.login ? 'Login' : 'Sign Up'}</h2>
                <div className="container">
                    {!this.state.login && (
                      <div className="row">
                        <input className="six columns"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                            type="text"
                            placeholder="Benutzername"
                        />
                      </div>
                    )}
                    <div className="row">
                    <input className="six columns"
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="email"
                        placeholder="E-Mail"
                    />
                  </div>
                  <div className="row ">
                    <input className="six columns"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Passwort"
                    />
                </div>
                </div>
                <div className="container row">
                    <div className=" button six columns" onClick={() => this._confirm()}>
                        {this.state.login ? 'login' : 'Account erstellen'}
                    </div>
                    <div
                        className= "  button six columns"
                        onClick={() => this.setState({ login: !this.state.login })}
                    >
                        {this.state.login
                            ? 'Account erstellen?'
                            : 'Account vorhanden?'}
                    </div>
                </div>
            </div>
        )
    }

        _confirm = async () => {
            const { name, email, password } = this.state
            if (this.state.login) {
                const result = await this.props.loginMutation({
                    variables: {
                        email,
                        password,
                    },
                })
                const { token } = result.data.login
                this._saveUserData(token)
            } else {
                const result = await this.props.signupMutation({
                    variables: {
                        name,
                        email,
                        password,
                    },
                })
                const { token } = result.data.signup
                this._saveUserData(token)
            }
            this.props.history.push(`/`)
        }

        _saveUserData = token => {
            localStorage.setItem(AUTH_TOKEN, token)
        }
    }

    const SIGNUP_MUTATION = gql`
      mutation SignupMutation($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
          token
        }
      }
    `

    const LOGIN_MUTATION = gql`
      mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `

    export default compose(
        graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
        graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
    )(Login)
