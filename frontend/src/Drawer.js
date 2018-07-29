import React, {Component} from 'react'
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles'


const drawerWidth = 450 

const styles = theme => ({
  drawerPager: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit*3,
    minWidth: 0
  },
  toolbar: theme.mixins.toolbar
}) 

class MyDrawer extends Component {
  render() {

    const { classes } = this.props
    
    return (
      <Drawer
        open={this.props.open}
        variant={this.props.open ? "permanent" : "temporary"}
        classes={{
          paper: classes.drawerPager
        }}>
        <div className={classes.toolbar}/>
        {this.props.children}
      </Drawer>
    )
  }
}

export default withStyles(styles)(MyDrawer);