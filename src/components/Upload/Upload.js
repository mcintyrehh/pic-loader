
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './upload.css';
import AWS from 'aws-sdk';
import { Upload, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  //File can be up to 1GB in size, divides total bytes 3 factors of 1024
  const isLt2M = file.size / 1024 / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1GB!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends Component {
  state = {
        loading: false,
    };
  
  customRequest({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials
  }) {
    AWS.config.update({
      accessKeyId: "AKIASDJJ62MMS4IGTSIH",
      secretAccessKey: "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",
      // sessionToken:
      //   "FQoGZXIvYXdzEGYaDDbXffvy9/DNV7DXvyLNAq9mOtFiIbUAE33I2H0mArBo8wTtDMkSYDLVcKKuAvl43UA6KI46BKNENFvCKuAPu2bgSL2SDiuLzJQvdo1Vai/5VjZ4Bd1TWsCRN1hz+tIaJcjoxrXoaPF+YU/DELKwSObUAeZjk5d6uvPRRc4kzpaAkKqFcJwh3VYpBobJzerS/GfQ8IMNq5On1phry6S23o3IeU9TdRQKXg9OU5hBWB7ZSNiLqDRpc6nfsG/EX9lkvzNh5f/8JueZem1JAIgf6r9w7MvFYfUFJw3kmSjYXXZrusgR9l5z+fMvhQUl0w7XzKPZuokl03vY5V+ZmxL6UXHvjeV+qNolbIp983TbCUfMQEiBU+SnmhfSYNGGq3FQGYK5wj1cIDuEy4tOrU5J0ZQjFwogEie2n6fD8muMeYltQXeZ8iekOQLEdbW58uR87dXXQvgbtSpd3BHk5CiDsJriBQ=="
    });

    const S3 = new AWS.S3();
    console.log("DEBUG filename", file.name);
    console.log("DEBUG file type", file.type);

    const objParams = {
      Bucket: "pic-loader",
      Key: "resonanceinterviewtest" + "/" + file.name,
      Body: file,
      ContentType: file.type // TODO: You should set content-type because AWS SDK will not automatically set file MIME
    };

    S3.putObject(objParams)
      .on("httpUploadProgress", function({ loaded, total }) {
        onProgress(
          {
            percent: Math.round((loaded / total) * 100)
          },
          file
        );
      })
      .send(function(err, data) {
        if (err) {
          onError();
          console.log("Something went wrong");
          console.log(err.code);
          console.log(err.message);
        } else {
          onSuccess(data.response, file);
          console.log("SEND FINISHED");
        }
      });
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        customRequest={this.customRequest}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar;
          