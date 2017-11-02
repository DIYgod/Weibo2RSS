FROM node:6.11.5-onbuild
EXPOSE 1206
RUN npm install -g forever
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
ENTRYPOINT forever --spinSleepTime 1000 --minUptime 1000 index.js