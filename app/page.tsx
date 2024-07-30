import { List, ListItem, Typography } from '@mui/material'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Typography color="error">testing</Typography>
      <List>
        <ListItem> sidebar</ListItem>
        <ListItem> hero</ListItem>
        <ListItem> news</ListItem>
        <ListItem> recent review</ListItem> 
        <ListItem> trending</ListItem>
        <ListItem> starting</ListItem>
        <ListItem>ending</ListItem>
        <ListItem> popular list</ListItem>
        <ListItem> top airing </ListItem>
        <ListItem> top upcoming</ListItem>
        <ListItem> most popular</ListItem>
      </List>
    </div>
  );
};

export default Home