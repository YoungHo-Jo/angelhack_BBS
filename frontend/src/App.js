import React, { Component } from 'react'
import Map from './Map'
import Bar from './Bar'
import Drawer from './Drawer'
import ManagerPage from './ManagerPage';
import ParkingPage from './ParkingPage'
import RentalPage from './RentalPage'
import Api from './api.json'
import Amplify, { API } from 'aws-amplify'
import aws_exports from './aws-exports'

Amplify.configure(aws_exports)

let apiName = 'frontend'
let path = '/'

export default class App extends Component {
  static defaultProps = {
    managerTitle: 'My Areas',
    parkingTitle: 'Parking the Bike',
    rentalTitle: 'Rent'
  }

  constructor(props) {
    super(props)

    this.state = {
      page: 'manager',
      userPosition: {
        lat: 40.7446790,
        lng: -73.9485420
      },
      managerAreas: [],
      nonAreaBikes: [],
      areaBikes: [],
      areas: []
    }

    this.managerPage = React.createRef()
  }

  getManagerAreas = () => fetch(Api.getManagerAreas)
    .then((res) => res.json())
    .then(data => {
      console.log('getManagerAreas ')
      console.log(data)
      this.setState({
        managerAreas: data
    })})
    .catch((err) => console.log(err))

  getNonAreaBikes = () => fetch(Api.getNonAreaBikes)
    .then(res => res.json())
    .then(data => {
      console.log('getNonAreaBikes ')
      console.log(data) 
      this.setState({
        nonAreaBikes: data
      }
    )})
    .catch(err => console.log(err))
  
  getAreaBikes = () => fetch(Api.getAreaBikes) 
    .then(res => res.json())
    .then(data => {
      console.log('getAreaBikes ')
      console.log(data)
      this.setState({
        areaBikes: data
      })
    })
    .catch(err => console.log(err))
  
  componentDidMount() {

    API.get(apiName, path).then(res => {
      console.log(res)
    })

    this.getManagerAreas()
    this.getAreaBikes()
    this.getNonAreaBikes()
  }
    

  handlePageChange = (page) => this.setState({
    page: page
  })


  render() {
    switch(this.state.page) {
      case 'manager':
        return this.renderManager()
      case 'parking':
        return this.renderParking()
      case 'rental':
        return this.renderRental()
      default:
    }
  }

  renderManager() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Bar 
          title={this.props.managerTitle}
          userMenu={(<ManagerPage 
            area={this.state.managerAreas}/>)}
          userName='Manager'
          changePage={this.handlePageChange}/>
        <Map
          managerAreas={this.state.managerAreas}
          nonAreaBikes={this.state.nonAreaBikes}
          areas={this.state.areas}
          areaBikes={this.state.areaBikes}/>
      </div> 
    )
  }

  renderParking() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Bar 
          title={this.props.parkingTitle}
          changePage={this.handlePageChange}
          userName='User'/>
        <ParkingPage/>
        <Map
          managerAreas={this.state.managerAreas}
          nonAreaBikes={this.state.nonAreaBikes}
          areas={this.state.areas}
          user={this.state.userPosition}
          areaBikes={this.state.areaBikes}/>
      </div> 
    )
  }

  renderRental() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Bar 
          title={this.props.rentalTitle}
          changePage={this.handlePageChange}
          userName='User'/>
        <RentalPage/>
        <Map
          managerAreas={this.state.managerAreas}
          nonAreaBikes={this.state.nonAreaBikes}
          areas={this.state.areas}
          user={this.state.userPosition}
          areaBikes={this.state.areaBikes}/>
      </div> 
    )
  }
}