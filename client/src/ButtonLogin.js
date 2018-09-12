import React from 'react'
import { Button } from 'semantic-ui-react'
import FBLogin from './FBLogin'

class ButtonLogin extends React.Component {
	constructor(props){
		super(props)
		this.update = this.update.bind(this)
	}
	update(){
		console.log("button clicked")
		this.props.changeInfo();
	}
  render(){
  	return(
	<div>
	  <Button secondary onClick={this.update}>Continue as Guest</Button>
	</div>
  	)
  } 
 }

export default ButtonLogin

//https://react.semantic-ui.com/elements/button/#types-button