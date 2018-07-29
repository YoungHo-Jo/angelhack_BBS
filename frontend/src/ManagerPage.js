import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Snackbar
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import styled from '../node_modules/styled-components';

const styles = theme => ({
  root: {
    width: '300px',
    backgroundColor: theme.palette.background.paper,
  },
  manager: {
    flexGlow: 1,
    width: '100%',
    height: '100px',
  },
  managerText: {
    marginTop: '50px'
  },
});

const MListItem = (area, button) => {
  return (
    <ListItem button={button}>
      <ListItemText primary={area.bicycleCnt} />
      <ListItemText primary={area.acummProfit} />
    </ListItem>
  )
}

class SimpleList extends React.Component {
  static defaultProps = {
    classes: PropTypes.object.isRequired,
    tableHeader: {
      bicycleCnt: '# of Bikes',
      acummProfit: 'Credit'
    },
    area: [
      {
        acummProfit: 10,
        bicycleCnt: 10,
        lat: 10,
        lon: 20,
      },
    ],
  }

  constructor(props) {
    super(props)

    this.state = {
      openSnackBar: false,
      earnedCredit: null
    }
  } 

  renderSnackBar = () => {

    const handleClose = () => {
      this.setState({
        openSnackBar: false,
        earnedCredit: null
      })
    }

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        open={this.state.openSnackBar}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id='message-id'>You earned {this.state.earnedCredit} !!</span>}/>
    )
  }  

  render() {
    const { classes } = this.props;

    var totalCredit = 0
    this.props.area.forEach(element => {
      totalCredit += element.acummProfit
    }) 

    return (
      <div className={classes.root}>
        <div className={classes.manager}>
          <Typography 
            variant='display1'
            align='center'
            className={classes.managerText}>
            Total Credit ${totalCredit} 
          </Typography>
        </div>

        <Divider />
        <List component="nav">
          {
            MListItem(this.props.tableHeader)
          }
          <Divider />
          { 
            this.props.area.map(element => MListItem(element, true))
          }
        </List>
        { this.renderSnackBar() }
      </div>
    );
  }

  showSnackbar = (credit) => {
    this.setState({
      openSnackBar: true,
      earnedCredit: credit
    })
  }

  componentDidMount() {
    this.props.onRef(this)


  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }



}

SimpleList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);