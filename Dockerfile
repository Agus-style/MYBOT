FROM nikolaik/python-nodejs:latest
RUN apt update -y && apt upgrade -y
RUN apt-get install -y --no-install-recommends \
  neofetch \
  ffmpeg \
  wget \
  yarn \
  sudo \
  tesseract-ocr \
  imagemagick

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /root/MYBOT
COPY . .
RUN npm install -g npm@9.7.1
RUN npm install nodemon -g


RUN yarn install

RUN pwd
RUN ls


RUN ls

#ngak guna tapi jangan di ilangin     "postinstall": "npm i typescript -g && tsc -p ./node_modules/@adiwajshing/baileys/ && cp ./node_modules/@adiwajshing/baileys/src/Defaults/baileys-version.json ./node_modules/@adiwajshing/baileys/lib/Defaults/baileys-version.json"



EXPOSE 5000
CMD ["npm","run","linux"] 
