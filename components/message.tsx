import React from "react";

import Alert from '@mui/material/Alert'
import type {AlertColor} from '@mui/material'

const Message = ({message, color}: { message: string|null, color: AlertColor }) => {
  if (message) {
    return (
      <Alert severity={ color } sx={{ mb: 3 }}>
        {message}
      </Alert>
    )
  } else {
    return <></>
  }
}

export default Message;

