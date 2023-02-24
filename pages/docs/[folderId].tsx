import {NextPage} from "next";
import {useRouter} from "next/router"
import React, {useEffect, useRef, useState} from "react"
import Link from "next/link"
import Head from "next/head"

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Fab from '@mui/material/Fab'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'

import {
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material/'

import DocReader, {Doc, Folder} from "../../lib/doc-reader"
import Util from "../../lib/util"
import Nav from "../../layouts/nav"
import Message from "../../components/message"
import Footer from "../../layouts/footer"
import FirebaseAuth from '../../lib/firebase-auth'

const Page: NextPage = () => {
  const router = useRouter()
  const docReader = new DocReader()
  const fa = new FirebaseAuth()

  const [folders, setFolders] = useState<Folder[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [levels, setLevels] = useState<Folder[]>([])
  const [message, setMessage] = useState<string|null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [dialogOpened, setDialogOpen] = useState<boolean>(false)
  const folderNameRef = useRef(null)

  const folderId = router.query.folderId as string

  const readAll = async () => {
    if (folderId == undefined) { return }
    setLevels(await docReader.levels(folderId))
    setFolders(await docReader.getFolders(folderId))
    setDocs(await docReader.getDocs(folderId))
    setLoaded(true)
  }

  useEffect(() => {
    if (!fa.loggedIn()) {
      router.replace('/login').catch(e => console.log(e))
      return
    }
    readAll().catch(err => {
      router.replace('/login').catch(e => console.log(e))
    })
  }, [folderId])

  const handleClickAddFolder = (event: React.MouseEvent) => {
    event.preventDefault()
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleClickSaveFolder = () => {
    setMessage(null)
    if (!folderNameRef.current) {
      return
    }

    const folderName = (folderNameRef.current as HTMLInputElement).value
    if (folderName.length == 0) {
      setDialogOpen(false)
      setMessage('input folder name')
      return
    }
    docReader.addFolder(folderId, folderName).then(newId => {
      router.replace('/docs/' + newId).catch(e => console.log(e))
      setDialogOpen(false)
    })
  }

  const handleClickRemoveFolder = () => {
    if (!confirm('are you sure?')) { return }
    try {
      docReader.deleteFolder(folderId).then(_ => {
        router.replace('/docs/00000').catch(e => console.log(e))
      })
    } catch (e: any) {
      setMessage(e.toString())
    }
  }

  const levelElems = levels.map((folder, index) => {
    if ((levels.length - 1) == index) {
      return (
        <Box key={index}>{ folder.folder_name }</Box>
      )
    } else {
      return (
        <Box key={index}>
          <Link href={`/docs/${folder.id}`}>
            { folder.folder_name }
          </Link>
          <span>&gt;</span>
        </Box>
      )
    }
  })

  const DocListItem = ({href, children, className}: {href: string, children: JSX.Element[], className: string}) => {
    return (
      <ListItem component={Link} href={href} sx={{borderBottom: '1px gray solid'}} className={className}>
        <Box sx={{display: 'flex', gap: 1, width: '100%'}}>
          { children }
        </Box>
      </ListItem>
    )
  }

  const folderElems = folders.map((folder: Folder, index: number) => {
    return (
      <DocListItem key={index} href={`/docs/${folder.id}`} className="folder">
        <Box className="material-icons">folder</Box>
        <Box>{folder.folder_name}</Box>
      </DocListItem>
    )
  })

  const docElems = docs.map((doc: Doc, index: number) => {
    return (
      <DocListItem key={index} href={`/docs/${doc.folder_id}/${doc.id}`} className="doc">
        <Box className="material-icons">description</Box>
        <Box>{doc.title}</Box>
        <Box sx={{ flex: '1 0 100px', textAlign: 'right' }}>
          <Chip label={Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at)} variant="outlined" color="success"/>
        </Box>
      </DocListItem>
    )
  })

  const foldersElement = (
    <div>
      <Box sx={{display: 'flex', gap: 1}} className="breadcrumb">
        <Box component={Link} href="/docs/00000">Top</Box>
        <span>&gt;</span>
        { levelElems }
        <span onClick={handleClickAddFolder}>[+]</span>
      </Box>

      <List className="memo-titles">
        {folderElems}
        {docElems}
      </List>
    </div>
  )

  return (
    <div>
      <Head><title>Documents</title></Head>
      <Nav loggedIn={true}/>

      <main>
        <h1>Documents</h1>

        <Message message={message} color="error"/>

        { loaded ? foldersElement : <Message message="Loading..." color="success"/>  }

      </main>

      <Footer/>

      <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}} className="fab-buttons">
        <Link href={`/docs/` + folderId + '/new'}>
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
        <Fab color="secondary" aria-label="remove" onClick={handleClickRemoveFolder}>
          <RemoveIcon />
        </Fab>
      </Box>

      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Folder</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={folderNameRef}
            label="Folder name"
            type="text"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          <Button onClick={handleClickSaveFolder}>Save</Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Page
