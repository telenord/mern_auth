import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  onInputChange(input, e) {
    this.setState({
      [input]: e.target.value
    })
  }

  renderInputs() {
    return Object.keys(this.state).map((input, i) => {
      return (<div key={i} className="">
        <input
          name={input}
          type={input === 'email' || 'password' ? input : 'text'}
          placeholder={input.substr(0,1).toUpperCase()+input.substr(1)}
          value={this.state[input]}
          onChange={(e) => this.onInputChange(input, e)}
        />
      </div>)
    })
  }
  render() {
    return (
      <div>
        <p>Sign Up</p>
        <form onSubmit={(e)=>this.props.submit(e, this.state)}>
          {this.renderInputs()}
          <button>Sign Up</button>
        </form>
      </div>
    )
  }
}

export default SignUp;
