# build:

FROM node:10

# The Dockerfile's author
LABEL Alec Maly

# Create app directory
WORKDIR /usr


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY ./src ./src

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# RUN npm run

# Bundle app source
# COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

