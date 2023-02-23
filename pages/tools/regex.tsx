import React, {useState} from "react";
import {NextPage} from "next";
import Head from "next/head";

import type {AlertColor} from '@mui/material'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'

import Nav from "../../layouts/nav";
import Message from "../../components/message";
import Footer from "../../layouts/footer";

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<AlertColor>('success')
  const [matchStrings, setMatch] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setMessage(null)
    setMatch([])

    try {
      const regex = eval(event.target.regex.value)
      const result = regex.exec(event.target.target.value)
      if (result === null) {
        setMsgClass('error')
        setMessage('Unmatched')
        return
      }

      setMatch([...result].map((value, index) => {
        return value
      }))
      setModalOpen(true)
    } catch (e: any) {
      setMsgClass('error')
      setMessage(e.toString())
    }
  }

  const handleClick = () => {
    setMatch([])
  }

  const matchElements = matchStrings.map((value, index) => {
    return (
      <List key={index}>
        <Divider/>
        <ListItem sx={{ pt: 2, pb: 0 }}>
          <Chip label={index} variant="outlined" color="success"/>
          <ListItemText sx={{ ml: 1 }}>{value}</ListItemText>
        </ListItem>
      </List>
    )
  })

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  return (
    <div>
      <Head><title>RegEx</title></Head>
      <Nav/>
      <main>
        <h1>RegEx checker</h1>

        <Message message={message} color={msgClass}/>

        <form onSubmit={handleSubmit}>
          <Card className="mt-5">
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="regex"
                    label="RegEx"
                    type="text"
                    required={true}
                    defaultValue=""
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="target"
                    label="Target"
                    type="text"
                    required={true}
                    defaultValue=""
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>Check</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>

        <Modal
          open={ modalOpen }
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={ modalStyle }>
            <h2>Match results</h2>
            { matchElements }
          </Box>
        </Modal>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
