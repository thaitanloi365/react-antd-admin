FROM nginx:alpine


COPY ./dist /usr/share/nginx/html
COPY ./docker/heroku/nginx.conf /etc/nginx/nginx.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'