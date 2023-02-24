import React, {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {NextPage} from "next"
import Head from "next/head"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Fab from '@mui/material/Fab'

import Footer from "../../../layouts/footer"
import Nav from "../../../layouts/nav"
import Message from "../../../components/message"
import Util from "../../../lib/util"
import MemoForm from "../../../components/memo-form"
import Breadcrumb from "../../../components/breadcrumb"
import DocReader, {Doc} from "../../../lib/doc-reader"
import FirebaseAuth from '../../../lib/firebase-auth'

const initialDoc = {
  id: '',
  folder_id: '',
  title: '',
  body: '',
  created_at: 0,
  updated_at: 0
}

const Page: NextPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [doc, setDoc] = useState<Doc>(initialDoc)
  const [mode, setMode] = useState<string>('read')
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  const docId = router.query.docId as string

  const docReader = new DocReader()
  const fa = new FirebaseAuth()

  const readDoc = async () => {
    if (typeof docId !== 'string') {
      return
    }
    const _doc = await docReader.getDoc(docId)
    if (_doc) { setDoc(_doc) }
  }

  useEffect(() => {
    if (!fa.loggedIn()) {
      router.replace('/login').catch(e => console.log(e))
      return
    }
    setDoc(initialDoc)
    readDoc().catch(err => {
      router.replace('/login').catch(e => console.log(e))
    })
  }, [docId])

  const handleClickEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    setMode('edit')
    if (!titleRef.current || !bodyRef.current) { return }
    (titleRef.current as HTMLInputElement).value = doc.title;
    (bodyRef.current as HTMLTextAreaElement).value = doc.body!;
  }

  const handleClickBack = (event: React.MouseEvent) => {
    event.preventDefault()
    setMode('read')
  }

  const handleSubmit = async (event: React.FormEvent|null) => {
    if (event) { event.preventDefault() }
    if (!titleRef.current || !bodyRef.current) {
      setMessage('error')
      return
    }

    const title = (titleRef.current as HTMLInputElement).value;
    const body = (bodyRef.current as HTMLInputElement).value;

    try {
      await docReader.updateDoc(docId, title, body)
      doc.title = title
      doc.body = body
      setDoc(doc)
      setMode('read')
    } catch (e: any) {
      setMessage(e.toString())
    }
  }

  const handleClickDelete = async (event: React.MouseEvent) => {
    event.preventDefault()

    if (!confirm('Are you sure?')) { return }

    try {
      await docReader.deleteDoc(docId)
      router.replace(`/docs/` + doc.folder_id).catch(e => console.log(e))
    } catch (e: any) {
      setMessage(e.toString())
    }
  }

  const textView =
    <Card>
      <CardHeader title={doc.title}/>
      <CardContent className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{ doc.body! }</ReactMarkdown>
      </CardContent>
    </Card>

  const formView = <MemoForm
    title={doc.title}
    body={doc.body}
    handleSubmit={handleSubmit}
    titleRef={titleRef}
    bodyRef={bodyRef}
    buttonName="Edit"
  />

  const docBody = (
    <div>
      <Breadcrumb folderId={doc.folder_id}/>
      <Box sx={{ py: 1}}/>
      { mode == 'read' ? textView : formView }

      {
        doc.updated_at ?
          <Box sx={{pt: 2, textAlign: 'right'}}>
            <Chip label={ Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at) } variant="outlined" color="info"/>
          </Box> : <></>
      }
    </div>
  )

  return (
    <div>
      <Head>
        <title>Document</title>
      </Head>

      <Nav loggedIn={true}/>

      <main>
        <h1>Document</h1>

        <Message message={message} color="error"/>

        { doc && doc.id ? docBody : <Message message="Loading..." color="success"/> }

      </main>

      <Footer/>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} className="fab-buttons">
        {
          mode == 'read' ?
            <>
              <Fab color="error" onClick={handleClickDelete}>
                <i className="material-icons left">delete</i>
              </Fab>
              <Fab color="primary" onClick={handleClickEdit}>
                <i className="material-icons left">edit</i>
              </Fab>
            </> : <>
              <Fab color="warning" onClick={handleClickBack}>
                <i className="material-icons left text-white">reply</i>
              </Fab>
            </>
        }
      </Box>

    </div>
  )
}

export default Page
