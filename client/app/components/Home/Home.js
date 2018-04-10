import React, { Component } from 'react';
import 'whatwg-fetch';

import { getFromStorage, setInStorage } from '../../utils/storage';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSignedIn: false,
      signInError: '',
      signUpError: '',
    };

  }

  componentDidMount() {
    const token = getFromStorage('the_main_app');
    if (token) {
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            })
          }

        });
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  onSignIn(e, data) {
    e.preventDefault();
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            isLoading: false,
            isSignedIn:true,
            signInError: '',
            signUpError: '',
          });
        }
        setInStorage('the_main_app', json.token);
      })
      .catch(err=>{
        this.setState({
          isLoading: false,
          signInError: err
        });
      });
  }

  onSignUp(e, data) {
    e.preventDefault();
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signInError: '',
            signUpError: '',
          });
        }
      })
      .catch(err=>{
        this.setState({
          isLoading: false,
          signInError: err
        });
      });
  }


  render() {
    const {isLoading, token, isSignedIn} = this.state;
    if (isLoading) {
      return (<div><p>...Loading</p></div>)
    }
    if(isSignedIn){
      return (<div><p>You is Signed In</p></div>)
    }
    if (!token) {
      return (<div>
        <SignIn submit={(e, data) => this.onSignIn(e, data)}/>
        <SignUp submit={(e, data) => this.onSignUp(e, data)}/>
      </div>)
    }
    return (
      <div>
        <p>You are signed up</p>
      </div>
    );
  }
}

export default Home;
