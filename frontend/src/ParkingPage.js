import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import {

} from '@material-ui/icons'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
    zIndex: 3,
    position: 'absolute',
    bottom: '10%',
    right: '50%',
    left: '50%'
  }
});

class ParkingPage extends React.Component {
  static defaultProps = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      dialogOpen: false
    }
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        {this.renderDialog()}
      </div>
    );
  }

  renderButton() {
    const handleOnClickOpen = () => {
      console.log('[Dialog] open')
      this.setState({
        dialogOpen: true
      })
    }

    return (
      <Button 
        variant='contained' 
        color='primary' 
        className={this.props.classes.button}
        onClick={handleOnClickOpen}>
        End Ride
      </Button>
    )
  }



  renderDialog() {
    const handleClose = () => {
      this.setState({
        dialogOpen: false
      })
    } 

    return (
      <Dialog
        open={this.state.dialogOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle
          id='alert-dialog-title'>
          {'Do you want to park the bike?'} 
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'>
            The parking fee is $5.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            color='primary'
            autoFocus>
            OK 
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ParkingPage);