
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './upload.css';
import AWS from 'aws-sdk';
import { Row, Col, message } from 'antd';
import { reject } from 'q';

require('dotenv').config();

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        infoText: "",
        imageUrl: "",
        fileData: null,
        generating: false,
        loadingStatus: "default",
    };
    this.onClickHandler = this.onClickHandler.bind(this);
  }
  displayIcons = {
    default: {
      url: "https://image.flaticon.com/icons/png/128/109/109612.png"
    },
    loading: {
      url: "https://media.giphy.com/media/m1Nf6FsRdop2M/giphy.gif"
    },
    compressing: {
      url: "https://media3.giphy.com/media/jncdxhzZ5ZaAfNUvXG/giphy.gif?cid=790b7611f8213e99554115b2633b9e7b8f9cbff13206c7df&rid=giphy.gif"
    }

  }

  aWSLogic = (object, fileName) => {
    const toggleGenerating = () => {
      this.setState({generating: this.state.generating ? false : true})
      return this.toggleGenerating
    }
    toggleGenerating();
    AWS.config.logger = console;
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
      region: 'us-east-1'
    });
    const S3 = new AWS.S3();
    const lambda = new AWS.Lambda();
    console.log("DEBUG filename", this.state.fileData.name);
    console.log("DEBUG file type", this.state.fileData.type);

    const objParams = {
      Bucket: process.env.REACT_APP_BUCKET,
      Key: process.env.REACT_APP_BUCKET_KEY + fileName,
      Body: this.state.fileData,
      ContentType: this.state.fileData.type, // TODO: You should set content-type because AWS SDK will not automatically set file MIME
      ACL:'public-read'
    };
    const updateURL = (url) => {
      this.setState({imageUrl: url})
      console.log(this.state.imageUrl);
    }
    let putPromise = new Promise(function(resolve, reject) {
      S3.putObject(objParams)
      .send(function(err, data) {
        if (err) {
          console.log("Error!")
          reject(err);
        }
        else {
          console.log("SEND FINISHED");
          console.log(fileName);
          resolve(objParams)
        }
      })
    })
    putPromise.then(function(file) {
      console.log("in second part of promise");
      const payloadJSON = {
        "Records":[  
          {  
            "eventVersion":"2.0",
            "eventSource":"aws:s3",
            "awsRegion":"us-west-2",
            "eventTime":"1970-01-01T00:00:00.000Z",
            "eventName":"ObjectCreated:Put",
            "userIdentity":{  
              "principalId":"AIDAJDPLRKLG7UEXAMPLE"
            },
            "requestParameters":{  
              "sourceIPAddress":"127.0.0.1"
            },
            "responseElements":{  
              "x-amz-request-id":"C3D13FE58DE4C810",
              "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
            }, 
            "s3":{  
              "s3SchemaVersion":"1.0",
              "configurationId":"testConfigRule",
              "bucket":{  
                "name":"pic-loader/uploads",
                "ownerIdentity":{  
                  "principalId":"A3NL1KOZZKExample"
                },
                "arn":"arn:aws:s3:::pic-loader/uploads"
              },
              "object":{  
                "key":fileName,
                "size":1073741824,
                "eTag":"d41d8cd98f00b204e9800998ecf8427e",
                "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
              }
            }
          }
        ]
      }
      console.log(payloadJSON);
      const lambdaParams = {
        FunctionName:'CreateThumbnail',
        InvocationType: "Event",
        Payload: JSON.stringify(payloadJSON)
      }
      lambda.invoke(lambdaParams, (err, data) => {

        if (err) console.log(err, err.stack); // an error occurred
        else {
          toggleGenerating();
          console.log(lambdaParams);
          console.log(data);
          updateURL(`https://pic-loader.s3.amazonaws.com/uploadsresized/resized-${fileName}`)
        };
      });

    })

    // S3.putObject(objParams)
    //   .send(function(err, data) {
    //     if (err) {
    //       console.log("Something went wrong");
    //       console.log(err.code);
    //       console.log(err.message);
    //     } else {
    //       console.log("SEND FINISHED");
    //       console.log(fileName);
    //       const payloadJSON = {
    //         "Records":[  
    //           {  
    //             "eventVersion":"2.0",
    //             "eventSource":"aws:s3",
    //             "awsRegion":"us-west-2",
    //             "eventTime":"1970-01-01T00:00:00.000Z",
    //             "eventName":"ObjectCreated:Put",
    //             "userIdentity":{  
    //               "principalId":"AIDAJDPLRKLG7UEXAMPLE"
    //             },
    //             "requestParameters":{  
    //               "sourceIPAddress":"127.0.0.1"
    //             },
    //             "responseElements":{  
    //               "x-amz-request-id":"C3D13FE58DE4C810",
    //               "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
    //             },
    //             "s3":{  
    //               "s3SchemaVersion":"1.0",
    //               "configurationId":"testConfigRule",
    //               "bucket":{  
    //                 "name":"pic-loader/uploads",
    //                 "ownerIdentity":{  
    //                   "principalId":"A3NL1KOZZKExample"
    //                 },
    //                 "arn":"arn:aws:s3:::pic-loader/uploads"
    //               },
    //               "object":{  
    //                 "key":fileName,
    //                 "size":1024,
    //                 "eTag":"d41d8cd98f00b204e9800998ecf8427e",
    //                 "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
    //               }
    //             }
    //           }
    //         ]
    //       }
    //       console.log(payloadJSON);
    //       const lambdaParams = {
    //         FunctionName:'CreateThumbnail',
    //         InvocationType: "Event",
    //         Payload: JSON.stringify(payloadJSON)
    //       }
    //       lambda.invoke(lambdaParams, (err, data) => {

    //         if (err) console.log(err, err.stack); // an error occurred
    //         else {
    //           console.log(lambdaParams);
    //           console.log(data);
    //           updateURL(`https://pic-loader.s3.amazonaws.com/uploadsresized/resized-${fileName}`)
    //         };
    //       });
        
    //     }
    //   });
  }
  handleChange = info => {
    console.log(info.target.files[0])
    const file = info.target.files[0]
    this.setState({
      fileData: file,
      loaded: 0,
    })
  };
  onClickHandler = () => {
    console.log(this.state.fileData.name);


    this.aWSLogic(this.state.fileData, this.state.fileData.name);
  }

  render() {

    return (
      <div>
	      <Row>
          <Col span={12} offset={6}>
            <Row>
              <Col span={20} offset={2} className="formColumn">
                <div className="form-container" style={{backgroundImage: `url(${this.state.generating ? this.displayIcons.loading.url : (this.state.imageUrl || this.displayIcons.default.url) })`}}> </div>
                  <form className="form" method="post" action="#" id="#">
                    <input
                      {...this.props}
                      type="file" 
                      className="form-control" 
                      multiple=""
                      onChange={this.handleChange}/>
                  </form>

              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
                <button 
                  type="button" 
                  className="btn"
                  onClick={this.onClickHandler}>
                    Upload
                </button>
              </Col>
        </Row>
          </Col>
	      </Row>

      </div>
        

    );
  }
}

export default Avatar;
          
