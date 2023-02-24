import React, {useEffect, useState} from "react"
import DocReader, {Folder} from "../lib/doc-reader"
import Link from "next/link"
import Box from '@mui/material/Box'

const Breadcrumb = ({folderId}: any) => {
  const [levels, setLevels] = useState<Folder[]>([])

  const docReader = new DocReader()

  const readLevels = async (fId: string) => {
    if (!fId) {
      return
    }
    setLevels(await docReader.levels(fId))
  }

  useEffect(() => {
    readLevels(folderId).catch(e => console.log(e))
  }, [])

  const levelElements = levels.map((folder, index) => {
    return (
      <Link key={index} href={`/docs/${folder.id}`}>
        { folder.folder_name }
      </Link>
    )
  })

  if (levelElements.length > 0) {
    levelElements.push(<span key={levelElements.length}>&gt;</span>)
  }

  return (
    <Box sx={{display: 'flex', gap: 1}} className="breadcrumb">
      <Link href="/docs/00000">Top</Link>
      <span>&gt;</span>
      { levelElements }
    </Box>
  )
}

export default Breadcrumb
