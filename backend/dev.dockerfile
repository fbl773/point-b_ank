FROM node:20-alpine

# expose backend port
EXPOSE 3000

# create necessary work directory
WORKDIR /backend
RUN mkdir -p /srv/pblank/uploads

# copy local files to container
COPY package.json /backend/package.json
COPY tsconfig.json /backend/tsconfig.json
COPY yarn.lock /backend/yarn.lock
COPY src /backend/src

# install packages
RUN yarn install
RUN yarn build

CMD ["yarn","start"]
