require('dotenv').config();

const config = {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || ''
};

module.exports = config;