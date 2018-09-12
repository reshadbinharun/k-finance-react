import React from 'react'
import { Grid, Image } from 'semantic-ui-react'
import logo from './logo.jpg'

const Banner = () => (
  <div>
    <Grid.Row>
      <img src={logo} />
    </Grid.Row>

    <Grid.Row>
      <p> Klaim your Investment Portfolio </p>
    </Grid.Row>
  </div>
)

export default Banner