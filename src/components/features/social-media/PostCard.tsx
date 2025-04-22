'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, Button, CardMedia } from '@mui/material';

interface User {
    username: string;
    avatarUrl: string;
}

interface PostCardProps {
    user: User;
    content: string;
    timestamp: string;
    link?: string;
    thumbnail?: string;
    type?: string;
}

const PostCard: React.FC<PostCardProps> = ({ user, content, timestamp, link, thumbnail, type = 'default' }) => {
    const renderMedia = () => {
        if (type === 'youtube' && link) {
            const youtubeEmbedUrl = link.replace('watch?v=', 'embed/');
            return (
                <CardMedia
                    component="iframe"
                    sx={{ aspectRatio: '16/9', border: 0 }}
                    src={youtubeEmbedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }

        if (thumbnail) {
            return (
                <CardMedia
                    component="img"
                    sx={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    image={thumbnail}
                    alt="Post thumbnail"
                />
            );
        }

        return null;
    };

    return (
        <Card sx={{ width: '100%', margin: 'auto', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardHeader
                avatar={<Avatar src={user.avatarUrl} alt={user.username} />}
                title={
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {user.username}
                    </Typography>
                }
                subheader={
                    <Typography variant="body2" color="text.secondary">
                        {new Date(timestamp).toLocaleString()}
                    </Typography>
                }
            />
            {renderMedia()}
            <CardContent>
                <Typography variant="body1" color="text.primary">
                    {content}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                {link && type !== 'youtube' && (
                    <Button size="small" color="primary" href={link} target="_blank" rel="noopener noreferrer">
                        View More
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default PostCard;
