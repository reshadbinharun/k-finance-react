import React from 'react'
import axios from 'axios'
import Transact from './Transact'
class Portfolio extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: '',
      stocks: []
    } 
    this.populateStocks = this.populateStocks.bind(this)
    
  }
  populateStocks(stocks){
    return stocks.map(function(stock){
      return(
      <li value = {stock.stock} key ={stock.stock}> 
        {stock.stock} : {stock.quantity} units
      </li>)
    })
  }


  componentDidMount(){
    axios.post('/getPortfolio',{user:this.props.user}).then( (response) => {
        console.log(response.data);
        if (response.data.length!=0){
            this.setState({
            user: this.props.user,
            stocks: response.data[0].stocks
          })
        }else{
          this.setState({
            user: this.props.user
          })
        }  
      })
      .catch(function (error) {
        console.log(error);
        });

    }

  render(){
    const stocks = this.state.stocks;
      return(
        <div className="label">
          <p> Your portfolio is as follows </p>
          <ul>
            {this.populateStocks(stocks)} 
          </ul>
          <Transact user={this.state.user}/>
        </div>
      )

    }
    
}

export default Portfolio