import React, { Component } from 'react';
import Home from './Home.js';
import { Route ,Switch } from 'react-router-dom';
import CreatePolicyDash from "./CreatePolicyDash.js";
import CreateClaimPolicy from "./CreateClaimPolicy.js";
import Admin from "./admin.js";

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route path='/' exact component={Home}/> 
          <Route path='/createpolicydash' exact component={CreatePolicyDash}/>
          <Route path='/createclaimdash' exact component={CreateClaimPolicy}/>
          <Route path='/admin' exact component={Admin}/>
         </Switch>
      </div>
      
    );
  }
}
export default App;