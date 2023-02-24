import {NextPage} from "next"
import Head from "next/head"
import React, {useState} from "react"
import {useRouter} from "next/router";

import type {AlertColor} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import Footer from "../layouts/footer"
import Nav from "../layouts/nav"
import Message from "../components/message"
import FirebaseAuth from "../lib/firebase-auth";

const Page: NextPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setClass] = useState<AlertColor>('error')
  const fa = new FirebaseAuth()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setMessage(null)

    const { email, password } = event.target.elements

    fa.signIn(email.value, password.value).then(loggedIn => {
      if (loggedIn) {
        setClass('success')
        setMessage('認証OK')
        router.replace('/docs/00000').catch(e => console.log(e))
      } else {
        setClass('error')
        setMessage('Wrong mail or password')
      }
    })
  }

  return (
    <div>
      <Head><title>Login</title></Head>
      <Nav/>
      <main>
        <h1>Login</h1>
        <Message message={message} color={msgClass} />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Mail"
                    type="text"
                    required={true}
                    defaultValue=""
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    required={true}
                    defaultValue=""
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{mt: 3}}>
                <Button type="submit" variant="contained" fullWidth>Login</Button>
              </Box>
            </CardContent>
          </Card>
        </form>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
