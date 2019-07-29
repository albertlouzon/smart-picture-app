import React from 'react';
import './App.css';


export default class Snackbar extends  React.Component {
  constructor(props) {
    super(props);
    this.content = this.props.content;
    this.isActive = this.props.isActive;
    this.state = {
      content: this.content,
      isActive: this.isActive
   }

  }

  componentDidMount() {
    console.log('showing value inside child snacknbar:  ', this.content);

  }

  render(){
    return (
          <div className={this.props.isActive ? 'showSnackbar' : ''} id="snackbar">
            {this.props.content}
          </div>
    )
  }
}


