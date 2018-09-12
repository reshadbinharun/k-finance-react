import React from 'react'
import axios from 'axios'
class Transact extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: '',
      stock: '',
      buy: '',
      quantity: 0
    } 

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.populateChoices = this.populateChoices.bind(this);
    this.submitFormNew = this.submitFormNew.bind(this);
    
  }

  handleChange(e){
    e.preventDefault();
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submitForm(e){
    e.preventDefault();
    axios.post('/updatePortfolio', {
      user: this.props.user,
      stock: this.state.stock,
      quantity: this.state.quantity,
      buy: this.state.buy //TEST EMAIL
    })
    .then( (response) => {
      console.log(response);
      this.setState({
        user:this.props.user
      })

    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  submitFormNew(e){
    e.preventDefault();
    axios.post('/newStock', {
      user: this.props.user,
      stock: this.state.stock,
      quantity: this.state.quantity //TEST EMAIL
    })
    .then( (response) => {
      console.log(response);
      this.setState({
        user:this.props.user
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  populateChoices(buy_sell){
    return buy_sell.map(function(buy){
      return(
      <option value = {buy} key ={buy}> {buy}</option>)
    })
  }

  render(){
    const buy_sell = ['Pick a transaction', 'BUY', 'SELL']
      return(
        <div className="label">
          <p> Modify your position on existing stock </p>
          <form onSubmit={this.submitForm}>
            <input type="text" name='stock' placeholder='TIKR' onChange={this.handleChange}/>
            <select name = "buy" options= {buy_sell} onChange={this.handleChange}>
                {this.populateChoices(buy_sell)}
            </select>
            <input type="number" name='quantity' placeholder='units...' onChange={this.handleChange}/>
            <input type="submit" value="Update!"/>
          </form>
          <p> Purchase new stock </p>
          <form onSubmit={this.submitFormNew}>
            <input type="text" name='stock' placeholder='TIKR' onChange={this.handleChange}/>
            <input type="number" name='quantity' placeholder='units...' onChange={this.handleChange}/>
            <input type="submit" value="Initiate Position!"/>
          </form>
        </div>
      )

    }
    
}

export default Transact