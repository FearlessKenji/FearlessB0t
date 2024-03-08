import request from 'request'

async function getKey(clientID, clientSecret) {
    return new Promise((resolve, reject) => {
        request.post(
            `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
            (error, res, body) => {
                if (error) {
                    return console.error(error)
                }
                try{
                    resolve(JSON.parse(body).access_token)
                }catch(e){
                    reject(e)
                }
            }
        )
    });
}

export default function () {
	console.log(`Imported auth data.`)
}
