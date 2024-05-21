FROM quay.io/a-s-w-i-n-s-p-a-r-k-y/x-bot-md:latest
RUN git clone https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X-BOT-MD /root/Sparky
WORKDIR /root/Sparky/
RUN npm install
CMD ["npm", "start"]
