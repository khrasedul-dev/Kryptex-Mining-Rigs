const { Telegraf , Composer} = require('micro-bot')
const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')

const productModel = require('./product')

const bot = new Telegraf('5013670828:AAFjbVkqn-DtYj44TXwW22jyhoTvq7PXuCs')

mongoose.connect('mongodb+srv://rasedul20:rasedul20@cluster0.pget2.mongodb.net/telegramProject?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch((e) => {
	console.log(e)
}).then((d) => console.log('Database connected')).catch((e) => console.log(e))



let per_page = 2



bot.start((ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id , "To search a product enter command /p product_name (Ex: /p gpu)." ,{
        reply_markup: {
            keyboard: [
                [{text: "Products"}],
                [{text: "Help"},{text: "About"}]
            ],
            resize_keyboard: true
        }
    }).catch((e)=>console.log(e))
})


bot.hears(/kryptex-miners.com/gi,ctx=>{
    const links = ctx.update.message.text

    const visit = axios.get(links)
    visit.then((html)=>{

        const $ = cheerio.load(html.data)

        const title = $('.entry-title').text()
        const sale_price = $('.price-wrapper > p > ins > span > bdi  ').text()
        const regular_price = $('.price-wrapper > p > del >span > bdi ').text()
        const short_desc = $('.product-short-description>p').text()
        const image = $('.woocommerce-product-gallery__image > a').attr().href
        
        const insertData = new productModel({
            title,
            image,
            regular_price,
            sale_price,
            short_desc,
            links
        })

        productModel.find({links: links}).then((data)=>{
            if(data.length>0){
                ctx.reply("The product already added in bot database")
            }else{
                insertData.save().then((data)=>ctx.reply('Your product added successfully')).catch((e)=>ctx.reply('Something is wrong. Please try again'))
            }
        }).catch((e)=>console.log("Data find in insert"))

    }).catch((e)=>console.log("Error on : add product"))

})



bot.hears('Products',async(ctx)=>{

    productModel.find().limit(per_page).sort({date: 1}).then((data)=>{

        if (data.length > 0) {
            data.map((data)=>{
                ctx.telegram.sendPhoto(ctx.chat.id , `${data.image}`,{
                    reply_markup: {
                        inline_keyboard:[
                            [{text: "Preview" , url: data.links},{text: "Order" , url: data.links}]
                        ]
                    },
                    caption: `<b>${data.title}</b> \n<del>${data.regular_price} </del> ${data.sale_price} \n\n${(data.short_desc).slice(0,80)}...`,
                    parse_mode: "HTML"
                }).catch((e)=>console.log(e))
            })

            pagination(ctx)

        }else{
            ctx.reply(`Product not found !`)
        }

    }).catch((e)=>console.log(e))

})

bot.hears('Help',ctx=>{
    ctx.telegram.sendMessage(ctx.chat.id , `Help: \n\nA. See our product /products \nB.To search a product enter command /p product_name \nEx: 1. /p gpu - Search gpu`)
})

bot.hears('About',ctx=>{
    ctx.telegram.sendMessage(ctx.chat.id , `This is not complete wait for your info`)
})

bot.command('p',ctx=>{

    const m = ctx.update.message.text 
    const f = m.replace('/p','')
    const input = f.trim()

    const findQuery = {
        $or: [{title: new RegExp( input, "gi")},{short_desc: new RegExp( input, "gi")}]
    }

    productModel.find(findQuery).limit(per_page).sort({date: 1}).then((data)=>{
        if (data.length > 0) {
            data.map((data)=>{
                ctx.telegram.sendPhoto(ctx.chat.id , `${data.image}`,{
                    reply_markup: {
                        inline_keyboard:[
                            [{text: "Preview" , url: data.links},{text: "Order" , url: data.links}]
                        ]
                    },
                    caption: `<b>${data.title}</b> \n<del>${data.regular_price} </del> ${data.sale_price} \n\n${(data.short_desc).slice(0,80)}...`,
                    parse_mode: "HTML"
                }).catch((e)=>console.log(e))
            })

            pagination(ctx)
            
        }else{
            ctx.reply(`Product not found !`)
        }


    }).catch((e)=>console.log("error on data search"))

})


let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']

bot.action(num, ctx=>{

    const page_number = ctx.update.callback_query.data

    productModel.find().limit(per_page).skip(per_page*page_number).then((data)=>{
        
        if (data.length > 0) {
            data.map((data)=>{
                ctx.telegram.sendPhoto(ctx.chat.id , `${data.image}`,{
                    reply_markup: {
                        inline_keyboard:[
                            [{text: "Preview" , url: data.links},{text: "Order" , url: data.links}]
                        ]
                    },
                    caption: `<b>${data.title}</b> \n<del>${data.regular_price} </del> ${data.sale_price} \n\n${(data.short_desc).slice(0,80)}...`,
                    parse_mode: "HTML"
                }).catch((e)=>console.log(e))
            })

            pagination(ctx)

        }else{
            ctx.reply(`Product not found !`)
        }

    }).catch((e)=>console.log(e))
})





function pagination(ctx) {

    productModel.find().then((data)=>{
    
        let page_list = []
        let page_count;
    
        let b = []
        let total_page_number = data.length / per_page;
        let h = 1 ;
        let i;
        let step = 5
        
    
        if ( ( data.length % per_page ) == 0 ) {
            page_count = (data.length / per_page)-1
        } else {
            const count = data.length / per_page
            page_count = Math.floor(count)
        }

        for(i = 1; i <= page_count; i++){
    
            if(i == step*h ){
    
                page_list.push(b);
                b = []
    
                h++;
    
            }
            
            if(page_count == i){
                page_list.push(b);
            }
    
            b.push({text: i , callback_data: i});
        
        }
        
    
        ctx.telegram.sendMessage(ctx.chat.id , "Go to Next Page \n\nPlease tap on any page number....",{
            reply_markup: {
                inline_keyboard: page_list
            }
        })


    }).catch((e)=>console.log(e))

}

bot.launch().catch((e)=>console.log(e))