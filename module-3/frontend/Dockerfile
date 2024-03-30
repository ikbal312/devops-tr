FROM node:lts-alpine as builder

EXPOSE 3000

WORKDIR /code

RUN mkdir -p /code/node_modules && chown -R node:node /code

COPY package.json ./
USER node

RUN npm install 
COPY --chown=node:node . .
RUN npm run build
CMD [ "npm","start" ]


FROM nginx:stable-alpine as prod

EXPOSE 80
COPY --from=builder /code/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]




