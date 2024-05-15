FROM node:18-alpine

# expose backend port
EXPOSE 3000

# create necessary work directory
RUN mkdir -p /backend/bin 
WORKDIR /backend

# copy local files to container
COPY package.json /backend/package.json
COPY tsconfig.json /backend/tsconfig.json
COPY src /backend/src


# install packages
RUN yarn

# Build Application
RUN yarn build

ENTRYPOINT ["yarn","run","start"]
