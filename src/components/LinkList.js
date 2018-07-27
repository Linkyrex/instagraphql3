import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'

class LinkList extends Component {

    _updateCacheAfterVote = (store, createVote, linkId) => {
        // 1
        const data = store.readQuery({ query: FEED_QUERY })

        // 2
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes

        // 3
        store.writeQuery({ query: FEED_QUERY, data })
    }

    _updateCacheAfterDelete = (store, deleteLink, linkId) => {
        // 1
        const data = store.readQuery({ query: FEED_QUERY })

        // 2
        const deletedLink = data.feed.links.find(link => link.id === linkId)
        deletedLink.votes = deleteLink.link

        // 3
        store.writeQuery({ query: FEED_QUERY, data })
    }

    _subscribeToNewLinks = () => {
        this.props.feedQuery.subscribeToMore({
            document: gql`
      subscription {
        newLink {
          node {
            id
            url
            description
            createdAt
            postedBy {
              id
              name
            }
            votes {
              id
              user {
                id
              }
            }
          }
        }
      }
    `,
            updateQuery: (previous, { subscriptionData }) => {
                const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
                const result = {
                    ...previous,
                    feed: {
                        links: newAllLinks
                    },
                }
                return result
            },
        })
    }

    componentDidMount() {
        this._subscribeToNewLinks()
        this._subscribeToNewVotes()
    }

    _subscribeToNewVotes = () => {
        this.props.feedQuery.subscribeToMore({
            document: gql`
      subscription {
        newVote {
          node {
            id
            link {
              id
              url
              description
              createdAt
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
            user {
              id
            }
          }
        }
      }
    `,
        })
    }

    _getLinksToRender = (isNewPage) => {
        if (isNewPage) {
            return this.props.feedQuery.feed.links
        }
        const rankedLinks = this.props.feedQuery.feed.links.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
        return rankedLinks
    }

    _nextPage = () => {
        const page = parseInt(this.props.match.params.page, 10)
        if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
            const nextPage = page + 1
            this.props.history.push(`/notes/${nextPage}`)
        }
    }

    _previousPage = () => {
        const page = parseInt(this.props.match.params.page, 10)
        if (page > 1) {
            const previousPage = page - 1
            this.props.history.push(`/notes/${previousPage}`)
        }
    }

    _updateCacheAfterVote = (store, createVote, linkId) => {
        const isNewPage = this.props.location.pathname.includes('notes')
        const page = parseInt(this.props.match.params.page, 10)
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })

        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes
        store.writeQuery({ query: FEED_QUERY, data })
    }

    render() {

        if (this.props.feedQuery && this.props.feedQuery.loading) {
            return <div>Loading</div>
        }

        if (this.props.feedQuery && this.props.feedQuery.error) {
            return <div>Error</div>
        }

        const isNewPage = this.props.location.pathname.includes('notes')
        const linksToRender = this._getLinksToRender(isNewPage)


        return (
            <div className="container">

              {isNewPage?
              <h2 className="">Posts<hr></hr></h2>
              :
              <h2 className="">Top Posts<hr></hr></h2>
            }


                <div>


                    {linksToRender.map((link, index) => (
                        <Link
                            key={link.id}
                            updateStoreAfterVote={this._updateCacheAfterVote}
                            updateStoreAfterDelete={this._updateCacheAfterDelete}
                            index={index}
                            link={link}
                        />
                    ))}
                </div>

                {isNewPage &&
                <div className='offset-by-two columns row'>
                    <div className="four columns" onClick={() => this._previousPage()}>
  <button className="">Zurück</button>
                    </div>
                    <div className='four columns' onClick={() => this._nextPage()}>
  <button className="">Weiter</button>
                    </div>
                </div>
                }
            </div>
        )

    }
}

// 1
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

// 3
export default graphql(FEED_QUERY, {
    name: 'feedQuery',
    options: ownProps => {
        const page = parseInt(ownProps.match.params.page, 10)
        const isNewPage = ownProps.location.pathname.includes('notes')
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return {
            variables: { first, skip, orderBy },
        }
    },
})(LinkList)
