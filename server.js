const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;

app.get('/ott', async (req, res) => {
    try {
        let toffeeResponse = await axios.get('https://raw.githubusercontent.com/Jeshan-akand/Toffee-Channels-Link-Headers/main/toffee_channel_data.json');
        let toffeeChannelData = toffeeResponse.data.channels;

        let tsportsResponse = await axios.get('https://raw.githubusercontent.com/byte-capsule/TSports-m3u8-Grabber/main/TSports_m3u8_headers.Json');
        let tsportsChannelData = tsportsResponse.data.channels;

        let combinedChannelData = [...toffeeChannelData, ...tsportsChannelData];

        combinedChannelData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        let formattedChannels = '';

        for (let i = 0; i < combinedChannelData.length; i++) {
            const channel = combinedChannelData[i];

            formattedChannels += `#EXTINF:-1 tvg-chno="${i + 1}" tvg-id="" tvg-logo="${channel.logo}", ${channel.name}\n`;
            formattedChannels += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36\n`;

            const cookieProperty = 'cookie' in channel.headers ? 'cookie' : 'Cookie';
            formattedChannels += `#EXTHTTP:${JSON.stringify({ [cookieProperty]: channel.headers[cookieProperty] })}\n`;

            formattedChannels += `${channel.link}\n`;
        }

        res.send(formattedChannels);
    } catch (error) {
        console.error('Error fetching API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/ns', async (req, res) => {
  try {
      let toffeeResponse = await axios.get('https://raw.githubusercontent.com/Jeshan-akand/Toffee-Channels-Link-Headers/main/toffee_channel_data.json');
      let toffeeChannelData = toffeeResponse.data.channels;

      let tsportsResponse = await axios.get('https://raw.githubusercontent.com/byte-capsule/TSports-m3u8-Grabber/main/TSports_m3u8_headers.Json');
      let tsportsChannelData = tsportsResponse.data.channels;

      let combinedChannelData = [...toffeeChannelData, ...tsportsChannelData];

      combinedChannelData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

      let formattedChannels = [];

      for (let i = 0; i < combinedChannelData.length; i++) {
        const channel = combinedChannelData[i];
        const cookieProperty = 'cookie' in channel.headers ? 'cookie' : 'Cookie';

          formattedChannels.push({
              name: channel.name,
              link: channel.link,
              logo: channel.logo,
              origin: channel.link.substring(0, channel.link.indexOf('/', channel.link.indexOf('//') + 2)),
              userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36',
              cookie: channel.headers[cookieProperty]
          });
      }

      res.json(formattedChannels);
  } catch (error) {
      console.error('Error fetching API:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
