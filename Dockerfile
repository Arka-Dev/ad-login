# Base image
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine

# Create app directory
WORKDIR /usr/src/app/mj-notify/otp-service

# Bundle app source
COPY package*.json ./
COPY . .
# Install app dependencies
RUN npm i -g @nestjs/cli@9.3.0
RUN apk update && apk upgrade && \
    apk add --no-cache git udev tzdata

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# RUN git config --global url."https://".insteadOf git://


# package install
RUN rm -f package-lock.json
# Remove existing node module
RUN rm -rf node_modules
RUN npm i --legacy-peer-deps

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
USER node
CMD ["npm", "run", "start:prod"]

