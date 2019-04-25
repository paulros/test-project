FROM node:11.6.0-alpine as base

USER node
WORKDIR /home/node

COPY sonat-chat/package.json sonat-chat/yarn.lock ./
RUN yarn

COPY sonat-chat/public public
COPY sonat-chat/src src
RUN yarn build

FROM nginx:1.15.2-alpine as release
RUN apk add --no-cache jq

COPY --from=base /home/node/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
