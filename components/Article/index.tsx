/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import { Article } from '@/server/dramaActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import Image from 'next/image'


const NewsArticle:React.FC<Article> = (props) => {
  return (
    <Box sx={{display: 'flex', flexDirection: "row", gap: 2, alignItems: "center", padding: 2}}>
      <Box sx={{ flexBasis: '40%' }}>
        <img
          src={props.urlToImage!}
          alt={props.title}
          width={500}
          height={300}
          sizes="100vw"
          style={{objectFit: 'contain', width: '100%', height: 'auto' }}
        />
      </Box>
      <Box>
        <Typography> News</Typography>
        <Typography>{props.title}</Typography>
        <Typography>4 hours ago</Typography>
      </Box>
    </Box>
  );
}


export default NewsArticle