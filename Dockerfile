FROM node

LABEL maintainer="Felipe Aguayo"

LABEL description="This is a simple user manager application that allows you to add users and edit users."

LABEL cohort="16"

LABEL animal="Tiger"

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

RUN npm install

CMD [ "npm", "start" ]



