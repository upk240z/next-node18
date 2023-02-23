import React, {useState} from "react";
import {NextPage} from "next"
import Head from "next/head";

import YAML from 'yaml'

import type {AlertColor} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

import Nav from "../../layouts/nav";
import Message from "../../components/message";
import Footer from "../../layouts/footer";
import ResultCanvas from "../../components/result-canvas";

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<AlertColor>('success')
  const [jsonText, setJson] = useState<string>('')
  const [phpText, setPhp] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()

    setMessage(null)
    setJson('');
    setPhp('');

    try {
      const parsed = YAML.parse(event.target.yaml.value)
      const json = JSON.stringify(parsed, null, 2)
      setJson(json)
      setPhp(
        json
          .replace(': ', ' => ')
          .replace(':', ' => ')
          .replace('{', '[')
          .replace('}', ']')
      )

      setMsgClass('success')
      setMessage('success')
    } catch (e: any) {
      setMsgClass('error')
      setMessage(e.toString())
    }
  }

  return (
    <div className="container">
      <Head><title>YAML</title></Head>
      <Nav/>
      <main>
        <h1>YAML Parser</h1>

        <Message message={message} color={msgClass}/>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <TextField
                name="yaml"
                label="YAML"
                multiline
                rows={4}
                fullWidth
              />
              <Box sx={{ mt: 2 }}>
                <Button fullWidth type="submit" variant="contained" className="w-full">Parse</Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        <ResultCanvas title="JSON" text={jsonText}/>
        <ResultCanvas title="PHP" text={phpText}/>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
