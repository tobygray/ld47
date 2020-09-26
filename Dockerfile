FROM node:14.11
WORKDIR /srv/ld47
COPY . .
RUN npm install
RUN npm run-script build
EXPOSE 8080

CMD ["npm" "start" ]
