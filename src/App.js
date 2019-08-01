import React from 'react';
import { Layout, Row, Col } from 'antd';
import './App.css';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <Row>
            <Col span={8} offset={8}>
              <div className="logo">
                <span role="img" aria-label="thumbs up emoji">👍</span>
                Thumbpic
                <span role="img" aria-label="thumbs up emoji">📸</span>
              </div>
            </Col>
          </Row>
        </Header>
        <Content>
          <div className="container">
            {/* <Row> <Link></Link><Button>TV</Button></Row> */}
            
          </div>
        </Content>
        <Footer style={{ backgroundColor: '#03152a' }}>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
