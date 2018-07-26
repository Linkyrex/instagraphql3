import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import {AUTH_TOKEN} from '../constants'

class Header extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <div className="flex pa1 justify-between nowrap orange">
                <div className="flex flex-fixed black">
                    {authToken && (
                        <div className="flex">
                            <Link to="/notes/1" className="ml1 no-underline black">
                                Notizen
                            </Link>
                            <div className="ml1">|</div>
                            <Link to="/top" className="ml1 no-underline black">
                                Top-Notizen
                            </Link>
                            <div className="ml1">|</div>
                            <Link to="/search" className="ml1 no-underline black">
                                Suche
                            </Link>
                            <div className="ml1">|</div>
                            <Link to="/create" className="ml1 no-underline black">
                                Erstellen
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex flex-fixed">
                    {authToken ? (
                        <div
                            className="ml1 pointer black"
                            onClick={() => {
                                localStorage.removeItem(AUTH_TOKEN)
                                this.props.history.push(`/`)
                            }}
                        >
                            logout
                        </div>
                    ) : (
                        <Link to="/login" className="ml1 no-underline black">
                            login
                        </Link>
                    )}
                </div>
            </div>
        )
    }
}

export default withRouter(Header)