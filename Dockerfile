FROM node:14.11
WORKDIR /srv/ld47
COPY . .

CMD [ "npm", "start" ]
