FROM node

COPY . /var/www/html
COPY package.json /var/www/html

CMD [ "node", "index" ]

EXPOSE 3000
