import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

class CreateTopic extends Component {
    state = {
        description: '',
        url: '',
    }

    render() {
        return (
            <div className="">

                <div className=" container row">
                  <h2 className="container offset-by-three columns">Neuer Post</h2>
                    <input
                        className="offset-by-three columns six columns"
                        value={this.state.url}
                        onChange={e => this.setState({ url: e.target.value })}
                        type="text"
                        placeholder="Thema"
                    />
                </div>
                  <div className=" container row">
                    <input
                        className="offset-by-three columns six columns"
                        value={this.state.description}
                        onChange={e => this.setState({ description: e.target.value })}
                        type="text"
                        placeholder="Beschreibung"
                    />
                </div>
                <div className=" container row">
                <button className=" offset-by-three columns six columns" onClick={() => this._createTopic()}>Submit</button>
            </div>
            </div>
        )
    }

    _createTopic = async () => {
        const { description, url } = this.state
        await this.props.postMutation({
            variables: {
                description,
                url,
            },
            update: (store, { data: { post } }) => {
                const first = LINKS_PER_PAGE
                const skip = 0
                const orderBy = 'createdAt_DESC'
                const data = store.readQuery({
                    query: FEED_QUERY,
                    variables: { first, skip, orderBy },
                })
                data.feed.links.splice(0, 0, post)
                data.feed.links.pop()
                store.writeQuery({
                    query: FEED_QUERY,
                    data,
                    variables: { first, skip, orderBy },
                })
            },
        })
        this.props.history.push(`/top`)
    }
}

// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateTopic)
