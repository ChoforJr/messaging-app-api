# MESSAGING APP API

This the backend of the messaging app project I build to allow users to communicate with one another

## MESSAGING APP CLIENT GITHUB REPO

https://github.com/ChoforJr/messaging-app

# Author : FORSAKANG CHOFOR JUNIOR

# Run the command below in your terminal to genrate a key for secret key

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the output and assign it to a secret key of your choice in your .env file

# There will be a conflict with multer-storage-cloudinary package you may need the below

# command to bypass that error

npm install multer-storage-cloudinary --legacy-peer-deps
