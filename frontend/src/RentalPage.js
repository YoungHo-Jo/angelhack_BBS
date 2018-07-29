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
    bottom: '100px',
    right: '50%',
    left: '50%'
  }
});

class RentalPage extends React.Component {
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
       
      </div>
    );
  }
}

export default withStyles(styles)(RentalPage);