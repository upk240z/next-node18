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
  const [prettyText, setPretty] = useState<string>('')
  const [yamlText, setYaml] = useState<string>('')
  const [phpText, setPhp] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()

    setMessage(null)
    setPretty('')
    setYaml('');
    setPhp('');

    const json = event.target.json.value

    try {
      const parsed = JSON.parse(json)
      const pretty = JSON.stringify(parsed, null, 2)
      setPretty(pretty)
      setYaml(YAML.stringify(parsed))
      setPhp(
        pretty
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
      <Head><title>JSON</title></Head>
      <Nav/>
      <main>
        <h1>JSON Parser</h1>

        <Message message={message} color={msgClass}/>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <TextField
                name="json"
                label="JSON"
                multiline
                rows={4}
                fullWidth
              />
              <Box sx={{ mt: 2 }}>
                <Button fullWidth type="submit" variant="contained" color="primary" className="w-full">Parse</Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        <ResultCanvas title="YAML" text={yamlText}/>
        <ResultCanvas title="PHP" text={phpText}/>
        <ResultCanvas title="Pretty print" text={prettyText}/>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
