import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Guide from './Guide'
class App extends Component {
  constructor () {
    super()
    this.state = {
      visible: false
    }
  }
  handleStart() {
    this.setState({
      visible: true
    })
  }
  handleCancel() {
    this.setState({
      visible: false
    })
  }
  render() {
    return (
      <div>
        <Guide 
          visible={this.state.visible} 
          onCancel={this.handleCancel.bind(this)} >
            <div data-step="1" data-tip='Hello World' style={{ width: '200px', height: '40px'}}>Step1</div>
      </Guide>
      <button onClick={this.handleStart.bind(this)}>start</button>
    </div>
    );
  }
}

export default App;