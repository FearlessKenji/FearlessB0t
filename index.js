const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [
		Discord.Guilds,
		Discord.GuildMessages,
		Discord.GuildMessageReactions
		]
});
const fs = require('fs')
const Stream = require("./modules/getStreams.js")
const Auth = require("./modules/auth.js")
const Channel = require("./modules/channelData.js")
const config = require('./config.json')
const CronJob = require('cron').CronJob;
const ST = new Date();

//ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    //update the authorization key on startup
    UpdateAuthConfig()
});

// Function to calculate the elapsed time
function calculateUptime() {
    const CURR = new Date();
    const uptime = CURR - ST;

    // Convert elapsed time to seconds
    const uptimeS = Math.floor(uptime / 1000);
	const uptimeM = Math.floor(uptimeS / 60);
	const uptimeH = Math.floor(uptimeM / 60);
	const uptimeD = Math.floor(uptimeH / 24);

    // Print the elapsed time
    return `I have been awake for ${uptimeD} days, ${uptimeH % 24} hours, ${uptimeM % 60} minutes, ${uptimeS % 60} seconds`
}

// Event triggered when a message is received
client.on('message', async (message) => {
	if (message.author.bot) return; // Ignore messages from other bots

	// Check if the message was sent in a specific channel
	if (message.channel.id === 872507018227908689){ //DM channel ID
		console.log(`New DM from ${message.author.tag}: ${message.content}`);
	} else {
		console.log(`New message in #${message.channel.name} from ${message.author.tag}: ${message.content}`);
	}
	// React with a Unicode emoji
	if (message.content === '!react'){
		const sentMessage = await message.reply({
		content: 'You can react with Unicode emojis!',
		fetchReply: true,
	});
	sentMessage.react('🙂'); // Replace with your desired emoji
	}

	// React with a custom emoji (replace with your own emoji ID)
	if (message.content === '!react-custom'){
		const sentMessage = await message.reply({
			content: 'You can react with custom emojis!',
			fetchReply: true,
		});
		sentMessage.react('123456789012345678'); // Replace with your custom emoji ID
	}
	
	// Display runtime as a reply
	if (message.content === "!uptime"){
		const sentMessage = await message.reply({
			content: calculateUptime(),
			fetchReply: true
		})
	}
});

//function that will run the checks
var Check = new CronJob(config.cron,async function () {
    const tempData = JSON.parse(fs.readFileSync('./config.json'))

    tempData.channels.map(async function (chan, i) {
        if (!chan.ChannelName) return;
        
        let StreamData = await Stream.getData(chan.ChannelName, tempData.twitch_clientID, tempData.authToken);
        if (StreamData.data.length == 0) return

        StreamData = StreamData.data[0]

		function dateToString (a) {
			a = new Date(a)
			month = a.getMonth() + 1
			month = month.toString().padStart(2, '0');
			day = a.getDate().toString().padStart(2, '0');
			year = a.getFullYear()
  
			date = month + `/` + day + `/` + year
  
			hours = a.getHours();
			minutes = a.getMinutes().toString().padStart(2, '0');
			ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12;
			time = hours +`:`+ minutes +` `+ ampm

			return date + ` at ` + time;
		}
		
		startTime = dateToString(StreamData.started_at)
		editTime = dateToString(Date.now())
		
        //get the channel data for the thumbnail image
        const ChannelData = await Channel.getData(chan.ChannelName, tempData.twitch_clientID, tempData.authToken)
        if (!ChannelData) return;

        //structure for the embed
        var SendEmbed = {
            "title": `${StreamData.user_name} is now live`,
            "description": StreamData.title,
            "url": `https://www.twitch.tv/${StreamData.user_login}`,
            "color": 15548997,
            "fields": [
                {
                    "name": "Playing:",
                    "value": StreamData.game_name,
                    "inline": true
                },
                {
                    "name": "Viewers:",
                    "value": StreamData.viewer_count,
                    "inline": true
                },
                {
                    "name": "Twitch:",
                    "value": `[Watch stream](https://www.twitch.tv/${StreamData.user_login})`
                },
                (chan.DiscordServer ? {
                    "name": "Discord Server:",
                    "value": `[Join here](${chan.DiscordServer})`
                } : {
                    "name": "** **",
                    "value": "** **"
                })
            ],
            "footer": {
                "text": `Started ` + startTime +`. Last edited ` + editTime + `.`
            },
            "image": {
                "url": `https://static-cdn.jtvnw.net/previews-ttv/live_user_${StreamData.user_login}-640x360.jpg?cacheBypass=${(Math.random()).toString()}`
            },
            "thumbnail": {
                "url": `${ChannelData.thumbnail_url}`
            }
        }

        //get the assigned channel
        const sendChannel = client.guilds.cache.get(config.DiscordServerId).channels.cache.get(config.channelID)

        if (chan.twitch_stream_id == StreamData.id) {
            sendChannel.messages.fetch(chan.discord_message_id).then(msg => {
                //update the title, game, viewer_count and the thumbnail
				if(config.roleID){
					msg.edit(`An <@&${config.roleID}> has gone live! They're streaming ${StreamData.game_name}!`, { embed: SendEmbed })
				} else {
					msg.edit(`An affiliate has gone live! They're streaming ${StreamData.game_name}!`, { embed: SendEmbed })
				}
			})
        } else {
            //this is the message when a streamer goes live. It will tag the assigned role
			if(config.roleID){
				await sendChannel.send(`An <@&${config.roleID}> has gone live! They're streaming ${StreamData.game_name}!`, { embed: SendEmbed }).then(msg => {
					const channelObj = tempData.channels[i]
					channelObj.discord_message_id = msg.id
					channelObj.twitch_stream_id = StreamData.id
				})
			} else {
				const affiliateMsg = `An affiliate has gone live! They're streaming ${StreamData.game_name}`
				await sendChannel.send(`${affiliateMsg}`, { embed: SendEmbed }).then(msg => {
					const channelObj = tempData.channels[i]
					channelObj.discord_message_id = msg.id
					channelObj.twitch_stream_id = StreamData.id
				})
			}
		}
        //save config with new data
        fs.writeFileSync('./config.json', JSON.stringify(tempData, null, 2))
    })
});

//update the authorization key every hour
var updateAuth = new CronJob('0 * * * *', async function () {
    UpdateAuthConfig()
});

//get a new authorization key and update the config
async function UpdateAuthConfig(){
    let tempData = JSON.parse(fs.readFileSync('./config.json'));

    //get the auth key
    const authKey = await Auth.getKey(tempData.twitch_clientID, tempData.twitch_secret);
    if (!authKey) return;

    //write the new auth key
    var tempConfig = JSON.parse(fs.readFileSync('./config.json'));
    tempConfig.authToken = authKey;
    fs.writeFileSync('./config.json', JSON.stringify(tempConfig, null, 2));
}

//start the timers
updateAuth.start()
Check.start();

//login
client.login(config.token);
