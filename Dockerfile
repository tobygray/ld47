FROM node:14.11
WORKDIR /srv/ld47
COPY package*.json ./
RUN npm install
RUN npm run-script build
COPY . .
EXPOSE 8080

CMD ["npm" "start" ]
