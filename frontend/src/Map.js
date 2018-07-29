import React from 'react'
import GoogleMapReact from 'google-map-react'
import styled from 'styled-components'
import { PersonPinCircle } from '@material-ui/icons'
import { meters2ScreenPixels } from 'google-map-react/utils';
import { 
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button
 } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'


const circleSize = 100 // meter

const Ctn = styled.div`
  height: 100vh;
  width: 100%;

  position: absolute;
  left: 0;
  top: 0;

  z-index: 1;
`

const Area = styled.span`
  height: ${props => `${props.size.h}px`};
  width: ${props => `${props.size.w}px`};

  background-color: rgba(255, 0, 0, 0.5);

  border-radius: 50%;
  display: inline-block;
  /* display: table-cell */
  text-align: center;
  align-items: center;
  /* transform: translateX(${props => `${props.w / 2}px`}) translateY(${props => `${props.h / 2}px`}); */
  transform: translateX(${props => `-${props.size.w/2}px`}) translateY(${props => `-${props.size.h/2}px`});
`

const Bike = styled.span`
  height: ${props => `${props.size.h}px`};
  width: ${props => `${props.size.w}px`};

  background-color: rgba(255, 0, 0, 0.9);

  border-radius: 50%;
  display: inline-block;
  text-align: center;
  align-items: center;
`

const UserPos = styled.div`
  width: 40px;
  height: 40px;

  background-color: transparent;
`
const styles = theme => ({
  personIcon: {
    width: '40px',
    height: '40px',
    // color: theme.palette.primary
  }
})

class Map extends React.Component {
  static defaultProps = {
    center: {
      lat: 37.756143,
      lng: -122.4325681
    },
    user: {
      lat: 37.756143,
      lng: -122.4325681
    },
    zoom: 18,
    managerAreas: [
      {
        lat: 40.744,
        lon: -73.940,
        bicycleCnt: 10,
      },
      {
        lat: 40.74690,
        lon: -73.95420,
        bicycleCnt: 20
      },
      {
        lat: 40.74790,
        lon: -73.98520,
        bicycleCnt: 15 
      }
    ],
    nonAreaBikes: []
  }

  constructor(props) {
    super(props)

    this.state = {
      zoom: props.zoom,
      areaSize: meters2ScreenPixels(circleSize, {lat: props.center.lat, lng: props.center.lng}, props.zoom),
      dialogOpen: false,
      center: props.center
    }
  }

  handleChange = (event) => {
    console.log('map zoom level: ', event.zoom)
    console.log(event)

    var nearest = null;
    this.props.managerAreas.forEach(element => {
      var dist = this.getDistanceFromLatLonInM(event.zoom.lat, event.zoom.lng, element.lat, element.lon)
      if(nearest === null || dist < nearest ) {
        nearest = {
          dist: dist,
        }
      }
    })

    this.setState({
      zoom: event.zoom,
      areaSize: meters2ScreenPixels(circleSize, {lat: this.props.center.lat, lng: this.props.center.lng}, event.zoom),
      center: event.center,
      theNearest: nearest
    })
  } 

  renderAreas = (size, area) => {
    const onClickArea = () => {
      this.setState({
        dialogOpen: true
      })
    }

    if(this.state.zoom >= 16) {
      return (
        <Area
          size={size}
          lat={area.lat}
          lng={area.lon}/>
      )
    } else {
      return (
        <Button
          mini
          variant='fab'
          color='secondary'
          lat={area.lat}
          lng={area.lon}
          onClick={onClickArea}>
          <Typography align='center' variant='button'>
            {area.bicycleCnt}
          </Typography>
        </Button>
      )
    }
  }

  renderBikes = (bike) => {
    const onClickBike = () => {
      this.setState({
        dialogOpen: true
      })
    }
    if(this.state.zoom >= 1 && bike.rent === false) {
      return (
        <Bike
          size={{ w: 20, h: 20}}
          lat={bike.lat}
          lng={bike.lon}
          onClick={onClickBike}/>
      )
    }
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
          {'Do you want to rental the bike?'} 
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'>
            Rental bike information
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose()
              console.log(this.state.theNearest < circleSize)
            }}
            color='primary'
            autoFocus>
            Rent 
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    return ( 
      <Ctn>
        <GoogleMapReact 
          bootstrapURLKeys={{ key: 'AIzaSyB9qQng_25hltM6k2RHITuQYr4psF0srPQ' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={this.handleChange}>
          {
            this.props.managerAreas.map(element => this.renderAreas(this.state.areaSize, element))
          }
          {
            this.props.areaBikes.map(element => this.renderBikes(element))
          }
          {
            this.props.nonAreaBikes.map(element => this.renderBikes(element))
          }
          <UserPos
            lat={this.state.center.lat}
            lng={this.state.center.lng}>
            <PersonPinCircle className={this.props.classes.personIcon}/>
          </UserPos>
        </GoogleMapReact> 
        { this.renderDialog() }
      </Ctn>
    )
  }

  getDistanceFromLatLonInM(lat1,lng1,lat2,lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d * 1000;
  }

}


export default withStyles(styles)(Map)