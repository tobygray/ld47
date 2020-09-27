FROM registry.lislan.org.uk:5050/ld47/ld47-assets:latest
WORKDIR /srv/ld47
COPY . .
RUN npm install
RUN npm run-script build
EXPOSE 3000

CMD [ "npm", "start" ]
