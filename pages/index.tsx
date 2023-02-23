import React from 'react'
import type {NextPage} from 'next'
import Head from "next/head"
import Link from "next/link"

import * as QRCode from 'qrcode'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import styles from '../styles/Home.module.css'
import Footer from "../layouts/footer"
import Nav from "../layouts/nav"

const drawQr = (canvas: HTMLCanvasElement) => {
  QRCode.toCanvas(canvas, window.location.href, err => {
    if (err) { console.log(err) }
  })
}

const Home: NextPage = () => {
  const refCanvas = React.useRef(null)

  React.useEffect(() => {
    if (refCanvas.current) {
      drawQr(refCanvas.current as HTMLCanvasElement)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Top page</title>
      </Head>

      <div>
        <Nav/>

        <main>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 className={styles.title}>
                <a href="https://nextjs.org">Next.js</a>
              </h1>
            </Box>
            <Box>
              <canvas ref={refCanvas}></canvas>
            </Box>
          </Box>

          <h2>Examples</h2>

          <List>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/form-function">
                <ListItemText>Form(Function component)</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/form-class">
                <ListItemText>Form(Class component)</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/posts">
                <ListItemText>Posts</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
          </List>

          <h2>Tools</h2>

          <List>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/json">
                <ListItemText>JSON</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/yaml">
                <ListItemText>YAML</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/datetime">
                <ListItemText>Datetime</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/regex">
                <ListItemText>RegEx</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/holidays">
                <ListItemText>Holidays</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools/qrcode">
                <ListItemText>QRCode</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider/>
          </List>

        </main>

        <Footer/>
      </div>
    </>
  )
}

export default Home
