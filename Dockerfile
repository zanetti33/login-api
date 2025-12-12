# default image for node
FROM node:18-alpine
# set workdir
WORKDIR /app
# set libraries
COPY ./package*.json ./
# install everything
RUN npm install
# include the project files
COPY ./index.js . 
COPY ./src ./src
COPY ./docs ./docs
RUN apk add openssl
# 1. Generate a private key
RUN openssl genrsa -out private.pem 2048
# 2. Extract the public key from the private key
RUN openssl rsa -in private.pem -pubout -out public.pem
# run the app
CMD ["node", "index.js"]