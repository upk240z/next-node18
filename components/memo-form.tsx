import React from "react"

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

const MemoForm = ({
  title,
  titleRef,
  body,
  bodyRef,
  handleSubmit,
  buttonName
}: any) => {
  const handleTextKeyDown = (event: React.KeyboardEvent) => {
    if (event.key == 'Tab') {
      event.preventDefault()
      const element = event.target as HTMLTextAreaElement
      const pos = element.selectionStart
      const text = element.value
      element.value = text.substr(0, pos) + '    ' + text.substr(pos)
      element.setSelectionRange(pos + 4, pos + 4)
    }
  };

  const handleFormKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.key == 's') {
      event.preventDefault()
      handleSubmit(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <Card>
        <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <TextField
            name="title"
            label="Title"
            type="text"
            required={true}
            defaultValue={title}
            inputRef={titleRef}
          />
          <TextField
            name="body"
            label="Body"
            type="text"
            required={true}
            defaultValue={body}
            multiline
            minRows={10}
            inputRef={bodyRef}
            onKeyDown={handleTextKeyDown}
          />
          <Button type="submit" variant="contained" className="w-full">{buttonName}</Button>
        </CardContent>
      </Card>
    </form>
  )
}

export default MemoForm
