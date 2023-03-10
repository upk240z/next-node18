import React, {useRef, useState} from "react"
import {NextPage} from "next"
import Head from "next/head"
import Image from 'next/image'

import type {AlertColor} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import {
  Camera as CameraIcon
} from '@mui/icons-material'
import * as QRCode from 'qrcode'
import {BrowserQRCodeSvgWriter} from '@zxing/browser'

import Nav from "../../layouts/nav"
import Message from "../../components/message"
import {decodeQrcode, initCamera} from "../../lib/functions"

const Page: NextPage = () => {
  const [message, setMessage] = useState<string>('')
  const [msgClass, setMsgClass]  = useState<AlertColor>('success')
  const [resultJson, setResultJson] = useState<string>('')
  const [selectedImg, setSelectedImg] = useState<boolean>(false)
  const [activeCamera, setActiveCamera] = useState<boolean>(false)
  const [drawQr, setDrawQr] = useState<boolean>(false)

  const refInput = useRef(null)
  const refFile = useRef(null)
  const refImage = useRef(null)
  const refMovie = useRef(null)
  const refPicture = useRef(null)
  const refQrCanvas = useRef(null)
  const refSvgBox = useRef(null)

  const handleClick = (evt: any) => {
    if (!refFile.current) { return }
    const file = refFile.current as HTMLInputElement
    file.click()
  }

  const selectQrImage = (url: string) => {
    if (!refImage.current) { return }
    const imgElement = refImage.current as HTMLImageElement
    imgElement.src = url
    setSelectedImg(true)

    decodeQrcode(imgElement).then(result => {
      setMessage('')
      setResultJson(JSON.stringify(result, null, 2))
      setMsgClass('success')
      setMessage('Success')
    }).catch(e => {
      setMsgClass('error')
      setMessage(e)
      setResultJson('')
    })
  }

  const handleChangeImage = (evt: any) => {
    const fileElement = evt.target as HTMLInputElement
    if (
      !fileElement.files || fileElement.files.length == 0
    ) { return }

    const file = fileElement.files[0]
    if (refInput.current) {
      const inputElement = refInput.current as HTMLInputElement
      inputElement.value = file.name
    }

    selectQrImage(window.URL.createObjectURL(file))
  }

  const handleChangeCamera = (evt: any) => {
    const checkBox = evt.target as HTMLInputElement
    setActiveCamera(checkBox.checked)
    if (checkBox.checked) {
      initCamera(refMovie.current! as HTMLVideoElement)
    }
    setResultJson('')
    setSelectedImg(false)
  }

  const handleShotCamera = () => {
    if (!refMovie.current || !refPicture.current) { return }
    const movie = refMovie.current as HTMLVideoElement
    const picture = refPicture.current as HTMLCanvasElement
    picture.width = movie.clientWidth;
    picture.height = movie.clientHeight;
    const context = picture.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }
    context.drawImage(movie, 0, 0, picture.width, picture.height)
    selectQrImage(picture.toDataURL('image/jpeg'))
  }

  const handleChangeQrText = (evt: any) => {
    const textArea = evt.target as HTMLTextAreaElement
    if (
      textArea.value.length == 0 ||
      !refQrCanvas.current
    ) {
      setDrawQr(false)
      return
    }

    const canvas = refQrCanvas.current as HTMLCanvasElement

    QRCode.toCanvas(
      canvas,
      textArea.value,
      (err) => {
        if (err) {
          console.log(err)
          setMsgClass('error')
          setMessage('Error on generating QRCode')
          return
        }

        setMsgClass('success')
        setMessage('Generated QRCode')
        setDrawQr(true)
      }
    )

    if (!refSvgBox.current) { return }

    const writer = new BrowserQRCodeSvgWriter()
    const svg = writer.write(textArea.value, canvas.width, canvas.height)
    const box = refSvgBox.current as HTMLElement
    box.innerHTML = ''
    box.appendChild(svg)
  }

  return (
    <div className="container">
      <Head><title>QRCode</title></Head>
      <Nav/>
      <main>
        <h1>QRCode Reader</h1>
        <Message message={message} color={msgClass}/>

        <Paper
          sx={{mt: 3, p: 2}}
        >
          <Typography component="h2" variant="h6" color="secondary">
            Reader
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleChangeCamera}/>}
                label="Use camera"
              />
            </FormGroup>
          </Box>
          <Box sx={{ display: activeCamera ? 'none' : 'block' }}>
            <TextField
              inputRef={refInput}
              label="QRCode image file"
              variant="outlined"
              InputProps={{readOnly: true}}
              onClick={handleClick}
              fullWidth
            />
          </Box>
          <Box sx={{ display: activeCamera ? 'flex' : 'none', justifyContent: 'center'}}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }} color="secondary">
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={handleShotCamera}
                  color="success"
                >
                  <CameraIcon/>
                </Button>
                Camera
              </Typography>
              <video ref={refMovie} autoPlay playsInline style={{ width: '100%' }}></video>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{mt: 3, p: 2, display: selectedImg ? 'block' : 'none'}}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography variant="h6" color="secondary">
                Selected image
              </Typography>
              <Image ref={refImage} src="/favicon.ico" alt="Selected image"/>
            </Grid>
            <Grid item md={6} xs={12} sx={{ display: resultJson ? 'block' : 'none' }} >
              <Typography variant="h6" color="secondary">
                Decoded
              </Typography>
              <pre>{resultJson}</pre>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography component="h2" variant="h6" color="secondary">
            Generator
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Text" variant="outlined" fullWidth multiline minRows={2}
              onChange={handleChangeQrText}
            />
          </Box>
          <Box sx={{ mt: 2, display: drawQr ? 'flex' : 'none', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="PNG" color="primary" variant="outlined"/>
              </Box>
              <Box>
                <canvas ref={refQrCanvas}></canvas>
              </Box>
            </Box>
            <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="SVG" color="success" variant="outlined"/>
              </Box>
              <Box ref={refSvgBox}>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 1, border: 1, display: 'none' }}>
          <input ref={refFile} type="file" onChange={handleChangeImage}/>
          <canvas ref={refPicture}></canvas>
        </Box>
      </main>
    </div>
  )
}

export default Page
