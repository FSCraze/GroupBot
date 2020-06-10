const fs = require('fs')
const discord = require('discord.js');
const bot = new discord.Client();
const prefix = '!';
var config = require("./config.json");
const url = 'https://mechgroupbuys.com/';
const axios = require('axios');
const cheerio = require('cheerio');
var item_name = '';
var count = 0;
var initC = 0;



function getDetails(){
	axios(url)
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
    //const statsTable = $('.statsTableContainer > tr');
    //console.log(statsTable.length);
   /* const tablesWrap = $('.builder-posts-wrap.clearfix.loops-wrapper.product.grid4');
    console.log(tablesWrap.length);
  
    tablesWrap.each(function() {
  	item_name = $(this).find('.post-title.entry-title').text().trim();
	item_name=item_name.replace(/\n/g," ");
	console.log(item_name[14])
	console.log(item_name.length)
 

}) */


const tablesWrap = $('.builder-posts-wrap.clearfix.loops-wrapper.product.grid4');
    //console.log(tablesWrap.length);

    tablesWrap.each(function() {
    	count = $(this).find('.post-content-inner').length;
    	item_name = $(this).find('.post-content-inner').eq(initC).text().trim();
    	console.log('total count = ' + count)
    	console.log('initC = ' + initC)

    	console.log(item_name.length)

    })




})
	.catch(console.error);
}


getDetails();
bot.on('message',(message) => {
	
	function botReact(){
		message.react('◀').then(() => message.react('▶'));
	}

	if(!message.author.bot){


		
		if(message.content.startsWith(prefix + "items")){

			message.channel.send('```'+ item_name + '```')


		}

	}

	else{
		if(message.content.startsWith('```')){
			botReact();
			reactShit();
			//setTimeout(reactShit, 5000);
		}

	}




	function reactShit(){

		/*const filter = (reaction, user) => {
			return ['◀', '▶'].includes(reaction.emoji.name);
		};

		message.awaitReactions(filter, { max: 2, time: 12000})
		.then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '◀') {
				initC++;
				getDetails();
				message.edit('```'+ item_name + '```');
			} else {
				initC--;
				getDetails();
				message.edit('```'+ item_name + '```');;



			}


		})
		.catch(collected => {
			message.reply('fuck');
		});*/

		const filter = (reaction, user) => {
			return reaction.emoji.name === '▶';
		};

		const collector = message.createReactionCollector(filter, {max: 10000, time: 120000 });

		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			if(initC<count){
				initC++;
				getDetails();
				message.edit('```'+ item_name + '```')
			}
			else if(initC==count){
				initC=0;
				getDetails();
				message.edit('End of list, continue to restart')
			}
				


		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});


		const filter1 = (reaction, user) => {
			return reaction.emoji.name === '◀';
		};

		const collector1 = message.createReactionCollector(filter1, {max: 10000, time: 120000 });

		collector1.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			if(initC>=0){
				initC--;
				getDetails();
				message.edit('```'+ item_name + '```')
			}
			else{
				initC=count;
				getDetails();
				message.edit('```'+ item_name + '```')
			}


		});

		collector1.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});

	








	}




});









bot.login(config.admin.token);
