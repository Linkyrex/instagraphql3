import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import {AUTH_TOKEN} from '../constants'
import '../styles/skeleton.css'
import '../styles/normalize.css'

class Header extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <div className="">
                <div className="">
                    {authToken && (
                      <div className="container">

                        <div className="row">
                          <div className="three columns">
                            <Link to="/notes/1" className="button button-primary ">
                                Notizen
                            </Link>
                          </div>
                          <div className="three columns">
                            <Link to="/top" className="button button-primary">
                                Top-Notizen
                            </Link>
                          </div>
                          <div className="three columns">
                            <Link to="/search" className="button button-primary">
                                Suche
                            </Link>
                          </div>
                          <div className="three columns">
                            <div
                                className="button button-primary"
                                onClick={() => {
                                    localStorage.removeItem(AUTH_TOKEN)
                                    this.props.history.push(`/`)
                                }}
                            >
                                logout
                            </div>
                          </div>
                          </div>


                            <div className="offset-by-three columns six columns">
                                <Link to="/create" className="button">
                                    Neuer Post
                                </Link>
                            </div>
                        </div>


                    )}
                </div>

            </div>
        )
    }
}

export default withRouter(Header)
