import React from "react";
import type {NextPage} from 'next'
import Link from "next/link"
import Head from "next/head"

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Footer from "../../layouts/footer"
import Nav from "../../layouts/nav"

export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: any[] = await res.json()
  const paths = posts.map((post) => {
    const id: number = post.id
    return {
      params: {
        postId: id.toString(),
      }
    }
  })

  return {
    paths: paths,
    fallback: false,
  }
}

export async function getStaticProps(context: any) {
  const postId = context.params.postId
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  const post = await res.json()

  return {
    props: {
      title: post.title,
      body: post.body,
    },
    revalidate: 60
  }
}

const Page: NextPage = ({title, body}: any) => {
  return (
    <div>
      <Head>
        <title>Post</title>
      </Head>

      <Nav/>

      <main>
        <h1>Post</h1>

        <Card>
          <CardHeader title={title}/>
          <CardContent>
            { body }
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Link href="/posts">Back to List</Link>
        </Box>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
