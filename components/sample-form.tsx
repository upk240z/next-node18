import React from "react"

import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem  from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

const SampleForm = ({handle}: any) => {
  const now = (new Date()).toISOString().substr(0,10)

  return (
    <form onSubmit={handle}>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="When is your event?"
            type="date"
            defaultValue={now}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>What type of event is it?</InputLabel>
            <Select
              labelId="demo-simple-select-hoge"
              id="demo-simple-select"
              label="What type of event is it?"
            >
              <MenuItem value={1}>Corporate event</MenuItem>
              <MenuItem value={2}>Wedding</MenuItem>
              <MenuItem value={3}>Birthday</MenuItem>
              <MenuItem value={4}>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            name="key"
            label="Timestamp"
            type="text"
            required={true}
            defaultValue="k01"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            name="value"
            label="Value"
            type="text"
            required={true}
            defaultValue="v01"
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </Grid>

      </Grid>

    </form>
  )
}

export default SampleForm
