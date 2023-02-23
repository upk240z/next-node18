import React, {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/router";

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import {ListItemText, ListItemButton} from '@mui/material';

import FirebaseAuth from "../lib/firebase-auth"

const Nav = ({loggedIn}: any) => {
  const router = useRouter()
  const [drawerOpen, setDrawer] = useState<boolean>(false)
  const fa = new FirebaseAuth()

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawer(open)
    }

  const handleLogout = () => {
    fa.signOut()
    router.replace('/login').catch(e => console.log(e))
  }

  const MenuButton = ({href, label}:{href: string, label: string}) => {
    return (
      <ListItemButton component={Link} href={href} sx={{ p: 0 }}>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    )
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{color: 'primary.main', flex:'1 0 10px'}} component={Link} href="/">
              <Box color="white">Next.js</Box>
            </Typography>
            { loggedIn ? <Button color="inherit" onClick={handleLogout}>Logout</Button> : null }
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 300 }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemIcon><i className="material-icons">home</i></ListItemIcon>
              <MenuButton href="/" label="Top"/>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem className="text-center">
              <ListItemText primary="Examples" className="text-center"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <MenuButton href="form-function" label="Form(Function component)"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <MenuButton href="form-class" label="Form(Class component)"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <MenuButton href="/posts" label="Posts"/>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem className="text-center">
              <ListItemText primary="Tools" className="text-center"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/json" label="JSON"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/yaml" label="YAML"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/datetime" label="Datetime"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/regex" label="RegEx"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/holidays" label="Holidays"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <MenuButton href="/tools/qrcode" label="QRCode"/>
            </ListItem>
          </List>
        </Box>
      </Drawer>

    </>
  )
}

export default Nav
