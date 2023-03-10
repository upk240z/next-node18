import React, {useState, useEffect} from "react"
import {NextPage} from "next"
import Head from "next/head"

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Footer from "../layouts/footer"
import Nav from "../layouts/nav"
import Message from "../components/message"
import SampleForm from "../components/sample-form"

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [savedSession, setSession] = useState<any>({})

  const readSession = async () => {
    const res = await fetch('/api/session')
    const sessions = await res.json()
    setSession(sessions)
  }

  useEffect(() => {
    readSession().then()
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    setMessage(null)

    const params: any = {}
    params[event.target.key.value] = event.target.value.value

    const res = await fetch('/api/session', {
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()

    if (result.result) {
      setMessage('OK')
    } else {
      setMessage('false')
    }

    readSession().then()
  }

  const lis = Object.keys(savedSession).map((key) => {
    return <li key={key}>{key}: {savedSession[key]}</li>
  })

  return (
    <div>
      <Head><title>Form(Function base)</title></Head>
      <Nav/>
      <main>
        <h1>Form(Function base)</h1>
        <Message message={message} color="success"/>

        <Card className="mt-5">
          <CardContent>
            <SampleForm handle={handleSubmit}/>
            <div className="mt-5">
              <ul className="list-group">
                {lis}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
