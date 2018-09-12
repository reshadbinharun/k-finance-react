import React, { Component } from 'react'
import './App.css'
import ButtonLogin from './ButtonLogin'
import { Divider } from 'semantic-ui-react'
import Banner from './Banner'
import FBLogin from './FBLogin'
import logo from './logo.jpg'
import Komb from './Komb'
import Portfolio from './Portfolio'
import axios from 'axios'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false,
      guest: false,
      name: '',
      email: ''
    }
    this.updateFB = this.updateFB.bind(this)
    this.guestLogin = this.guestLogin.bind(this)
    this.logout = this.logout.bind(this)
    this.exit = this.exit.bind(this)
    //this.makeNewUser = this.makeNewUser.bind(this)
  }
  componentDidMount(){
      document.title = "KFinance"
  }

  // makeNewUser(){
  //   console.log("making new user")
  //   axios.post('/addUser',{user:this.state.email}).then( (response) => {

  //   }).catch(function (err) {
  //     console.log(err)
  //   });
  // }

  updateFB(res){
    console.log("about to update info from facebook", res);
    this.setState({
      loggedIn: true,
      name:res.name,
      email: res.email
    //}, this.makeNewUser)
    })
  }

  guestLogin(){
    console.log("guest login called")
    this.setState({
      guest: true
    }, console.log(this.state.guest))
  }

  logout(){
    this.setState({
      loggedIn: false
    })
  }

  exit(){
    this.setState({
      guest: false
    })
  }
  render() {
    const loggedIn = this.state.loggedIn, name = this.state.name, email = this.state.email, guest = this.state.guest;
    if (!loggedIn && !guest){
      return (
        <div className="App">
          <Banner/>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
          <FBLogin changeInfo={this.updateFB} />
          <ButtonLogin changeInfo={this.guestLogin}/>
          <Divider/>
        </div>
      );
    }
    //lifting
    else if (guest && !loggedIn){
      //diplay for guest
      return (
            <div className="well">
              <p> Browsing Guest-mode </p>
              <Komb/>
              <button onClick={this.exit}> Exit </button>
            </div>

            );
    }
    else if (loggedIn)
      //logged in display
      {
        return (
            <div>
              <p> Logged In </p>
              <Banner/>
              <button onClick={this.logout}> Logout </button>
              <Komb/>
              <Portfolio user={this.state.email}/>
            </div>
            );
      }
  }
}

export default App;
