import React, { Component } from 'react'
import LinkList from './LinkList'
import CreateTopic from './CreateTopic'
import Header from './Header'
import Login from './Login'
import { Switch, Route, Redirect } from 'react-router-dom'
import Search from './Search'


class App extends Component {
    render() {
        return (
            <div className='center w85'>
                <Header />
                <div className='ph3 pv1 background-gray'>
                    <Switch>
                        <Route exact path='/' render={() => <Redirect to='/login' />} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/create' component={CreateTopic} />
                        <Route exact path='/search' component={Search} />
                        <Route exact path='/top' component={LinkList} />
                        <Route exact path='/notes/:page' component={LinkList} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App
