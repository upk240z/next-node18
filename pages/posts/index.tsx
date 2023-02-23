import type {NextPage} from 'next'
import Head from "next/head"
import Link from "next/link"
import axios from "axios";
import useSWR from 'swr'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'

import Footer from "../../layouts/footer"
import Nav from "../../layouts/nav"
import Message from "../../components/message";

type Post = {
  userId: number,
  id: number,
  title: string,
  body: string
}

const FetchResults = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => {
    return res.data
  })
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/posts', fetcher)

  if (error) {
    return <Message message={error.toString()} color="error"></Message>
  }

  if (!data) {
    return <Message message="Loading..." color="success"></Message>
  }

  const list = data.map((post: Post) => {
    return (
      <ListItem key={ post.id }>
        <ListItemButton>
          <Link href={`/posts/${post.id}`}>{ post.title }</Link>
        </ListItemButton>
      </ListItem>
    )
  })

  return (
    <List>
      { list }
    </List>
  )
}

const Page: NextPage = () => {

  return (
    <div className="container">
      <Head>
        <title>Posts</title>
      </Head>

      <Nav/>

      <main>
        <h1>Posts</h1>

        <FetchResults/>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
