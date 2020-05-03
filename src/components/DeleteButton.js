import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

// import { DELETE_POST_MUTATION } from '../util/graphql'
import { FETCH_POSTS_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'
import Utl from '../util/utl'

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deleteItem] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false)
      if (!commentId) {
        const localData = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })

        const localClone = Utl.cloneDeepLodash(localData)

        localClone.getPosts = localClone.getPosts.filter(p => p.id !== postId)
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: localClone })
      }
      if (callback) callback()
    },
    variables: {
      postId,
      commentId,
    }
  });

  return (
    <>
      <MyPopup
        content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }}></Icon>
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteItem}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default DeleteButton;
