import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = (theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1, 
  },
  moreVert: {
    color: 'white',
  },
  moreVertButton: {
    position: 'absolute',
    right: 0
  },
  userButton: {
  },
  userIcon: {
    color: 'white'
  },
  title: {
    position: 'absolute',
    right: '50%',
  },
  toolbar: {
    flowGrow: 1
  }
})


class Bar extends React.Component {
  static defaultProps = {
    title: 'Title',
    userName: 'Name',
    userMenu: <MenuItem>Menu</MenuItem> 
  }

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
      userMenuAnchorEl: null,

    }
  }

  render() {
    const { classes } = this.props
    return (
      <AppBar position='absolute' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {this.renderUserButton(this.props.name)}
          <Typography variant='title' color='inherit'>
            {this.props.userName} 
          </Typography>
          <Typography variant='title' color='inherit' align='justify' className={classes.title}>
            {this.props.title} 
          </Typography>
          {this.renderMoreVertButton()}
          {this.renderMenu()}
          {this.renderUserMenu(this.props.userMenu)}
          {this.props.children}

        </Toolbar>
      </AppBar>
    )
  }

  renderUserMenu(children) {
    const handleClose = () => {
      this.setState({
        userMenuAnchorEl: null
      })
    }

    return (
      <Menu
        id='user_menu'
        anchorEl={this.state.userMenuAnchorEl}
        open={Boolean(this.state.userMenuAnchorEl)}
        onClose={handleClose}>
        {children}
      </Menu>
    )
  }

  renderUserButton(name) {
    const handleClick = event => {
      this.setState({
        userMenuAnchorEl: event.currentTarget
      })
    }

    return (
      <IconButton 
        className={this.props.classes.userButton}
        onClick={handleClick}>
        <AccountCircle className={this.props.classes.userIcon}/>
        {/* <Typography variant='title' color='inherit'>{name}</Typography> */}
      </IconButton>
    )
  }

  renderMoreVertButton() {
    const handleClick = event => {
      this.setState({
        anchorEl: event.currentTarget
      })
    }

    return (
      <IconButton 
        className={this.props.classes.moreVertButton}
        onClick={handleClick}>
        <MoreVert className={this.props.classes.moreVert}/>
      </IconButton>
    )
  }

  renderMenu() {
    const handleClose = (page = 'manager') => {
      this.setState({
        anchorEl: null
      })
      
      this.props.changePage(page)
    }
    
    return (
      <Menu
        id='menu'
        anchorEl={this.state.anchorEl}
        open={Boolean(this.state.anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={() => handleClose('manager')}>Manager</MenuItem>
        <MenuItem onClick={() => handleClose('parking')}>User-parking</MenuItem>
        <MenuItem onClick={() => handleClose('rental')}>User-rent</MenuItem>
      </Menu>
    )
  }

}

export default withStyles(styles)(Bar)