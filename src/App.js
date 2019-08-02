import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Avatar  from './components/Upload/Upload'
import AWS from "aws-sdk";
import 'antd/dist/antd.css';
import './App.css';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      test: true
    }
  }

    render() {
    return (
      <div className="App">
        <Row>
          <Col span={8} offset={8}>
            <div className="logo">
              <span role="img" aria-label="thumbs up emoji">👍</span>
              Thumbpic
              <span role="img" aria-label="thumbs up emoji">📸</span>
            </div>
          </Col>
        </Row>

        
        <Row>
          <Col span={14} offset={5}>
            <div className="container">
              <Avatar/>
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}

export default App;
