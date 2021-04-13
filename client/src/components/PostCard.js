import React, { useContext } from 'react'
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'


function PostCard({
    post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {

    const { user } = useContext(AuthContext)

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)} </Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                {/* Like Button */}
                <LikeButton
                    user={user}
                    post={{ id, likes, likeCount }}
                />
                {/* Comment Button */}
                <MyPopup
                    content="Comment on text"
                >
                    <Button
                        labelPosition='right'
                        className="commentButton"
                        size='large'
                        as={Link}
                        to={`/posts/${id}`}
                    >
                        <Button color='red' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic
                            color='black'
                            pointing='left'
                        >
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>


                {/* Delete buttton */}
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard