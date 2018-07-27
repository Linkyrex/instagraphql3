import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

class Link extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
<div className="">
  <div className="row">

    <div className="one columns">
      <span className="">{this.props.index + 1}.</span>
    </div>


                  <div className="two columns">
                    {this.props.link.url}
                  </div>

                  <div className="three columns">
                    {this.props.link.description}
                  </div>

                  <div className="three columns">
                    {this.props.link.votes.length} Stimmen | von{' '}
                    {this.props.link.postedBy
                        ? this.props.link.postedBy.name
                        : 'Anon'}{' '}
                    {timeDifferenceForDate(this.props.link.createdAt)}
                  </div>

<div className="ones column">
                  {authToken && (

                        <div className="" onClick={() => this._voteForLink()}>
                            <button className="">Vote</button>
                        </div>

                        )}
                </div>

                <div className="ones column">
                                  {authToken && (

                                        <div className="" onClick={() => this._deleteLink()}>
                                            <button className="">DEL</button>
                                        </div>

                                        )}
                                </div>

</div>
<hr></hr>
</div>



        )
    }

    _voteForLink = async () => {
        const linkId = this.props.link.id
        await this.props.voteMutation({
            variables: {
                linkId,
            },
            update: (store, { data: { vote } }) => {
                this.props.updateStoreAfterVote(store, vote, linkId)
            },
        })
    }

   _deleteLink = async () => {
        console.log("wurde geklickt")
        const linkId = this.props.link.id
        await this.props.deleteMutation({
            variables: {
                linkId,
            },
            update: (store, { data: { del } }) => {
                this.props.updateStoreAfterDelete(store, del, linkId)
            },
        })
    }
}


const DELETE_LINK = gql`
  mutation deleteLink($linkId: ID!) {
    deleteLink(linkId: $linkId) {
      id
     }
   }
`

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`

export default graphql(VOTE_MUTATION, {
    name: 'voteMutation',
}, DELETE_LINK, {name: 'deleteMutation',})(Link)
