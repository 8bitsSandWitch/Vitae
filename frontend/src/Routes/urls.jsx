import React from 'react'
import { Route, Switch } from 'react-router-dom'


const urls = () => {
  return (
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/services" component={Services} />
    </Switch>
  )
}

export default urls