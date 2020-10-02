FROM registry.lislan.org.uk:5050/ld47/ld47-assets:latest
ARG CI_COMMIT_SHORT_SHA
ARG CI_COMMIT_TIMESTAMP
WORKDIR /srv/ld47
COPY . .
RUN npm install
RUN npm run-script build
RUN npm run-script version -- $CI_COMMIT_SHORT_SHA $CI_COMMIT_TIMESTAMP
EXPOSE 3000

CMD [ "npm", "start" ]
