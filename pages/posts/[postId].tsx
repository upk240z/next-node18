import React from "react";
import type {NextPage} from 'next'
import Link from "next/link"
import Head from "next/head"
import axios from "axios";

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Footer from "../../layouts/footer"
import Nav from "../../layouts/nav"
import withLoading from "../../components/with-loading";

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export function getStaticProps({params}: any) {
  return {
    props: {
      postId: params.postId
    },
    revalidate: 60
  }
}

const Page: NextPage = ({postId}: any) => {
  const PostDocument: React.FunctionComponent = ({title, body}: any) => {
    return (
      <Card>
        <CardHeader title={title}/>
        <CardContent>
          { body }
        </CardContent>
      </Card>
    )
  }

  const Wrapped = withLoading(PostDocument, () => {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data)
  })

  return (
    <div className="container">
      <Head>
        <title>Post</title>
      </Head>

      <Nav/>

      <main>
        <h1>Post</h1>

        <Wrapped/>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Link href="/posts">Back to List</Link>
        </Box>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
