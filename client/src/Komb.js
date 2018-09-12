import React from 'react'
import axios from 'axios'
import { Segment } from 'semantic-ui-react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
class Komb extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ticker: '',
      loaded: false,
      resp: ''

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    console.log(this.state.ticker)
    axios.post('/komb', {
        ticker: this.state.ticker})
      .then( (response) => {
        console.log(response.data);
        this.setState({
          loaded: true,
          resp: response.data
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleChange(e){
    console.log(e.target.name)
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  render(){
    var loaded = this.state.loaded;
    const html_res = this.state.resp;
    if (loaded) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
              <p><label> Enter TICKER symbol for stock of choice </label>
              <input type="text" name="ticker" placeholder="Enter a symbol e.g. AAPL" onChange = {this.handleChange}/></p>
              <input type="submit" value="Submit"/>
          </form>
          <div>
            <p> Response should be here loaded now! </p> 
            <div> { ReactHtmlParser(html_res) } </div>
          </div>
        </div>
      )
    } else {
      return(
        <form onSubmit={this.handleSubmit}>
          
            <p><label> Enter TICKER symbol for stock of choice </label>
            <input type="text" name="ticker" placeholder="Enter a symbol e.g. AAPL" onChange = {this.handleChange}/></p>
            <input className= "btn-success" type="submit" value="Submit"/>
        </form>
      )

    }
  }
    
}

export default Komb
