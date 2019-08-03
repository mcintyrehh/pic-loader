### Resonance Interview Test ###

* Build a basic file upload and view interface w/ AWS services
* Accept large img files up to 1GB 
* Use a combination of AWS services to generate a thumbnail for each file upload
* Display thubmails on interface once uploaded
* Convey to user that image thumbnail is being generated
* Display thumbnail once complete, without reloading the page


## Steps taken so far ##

* React app bootstrapped with create-react-app
* Basic front end skeleton created, using Ant Design UI framework 
* Created an AWS S3 bucket, opened for public access, CORS enabled from all ( * ) origins, and for GET, POST, PUT methods
* 


## Whats left ##

* Right now the Ant Design 'Avatar' element is creating thumbnails, this needs to be switched to a lambda fxn
* Create a Lambda function to fire whenever an img file is uploaded to my S3 bucket
* While uploading set component state to 'uploading', which in turn will set the image src to a loading gif
* While creating a thumbnail set component state to 'building', which in turn will set the image to some gif that conveys building (hammers?)
* Update component img url to the thumbnail URL
* Clean up UI
