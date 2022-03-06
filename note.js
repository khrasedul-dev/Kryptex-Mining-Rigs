// const axios = require('axios')
// const cheerio = require('cheerio')



// const visit = axios.get('https://kryptex-miners.com/shop/gpu-miner/8-gpu-gtx-1660-6gb-ti-miner-box-v-4-for-sale/')
// visit.then((html)=>{

//     const $ = cheerio.load(html.data)

//     //fetch product info
//     const title = $('.entry-title').text()
//     const sale_price = $('.price-wrapper > p > ins > span > bdi  ').text()
//     const regular_price = $('.price-wrapper > p > del >span > bdi ').text()
//     const short_desc = $('.product-short-description>p').text()
//     const image = $('.woocommerce-product-gallery__image > a').attr().href
    
//     const data = {
//         image,
//         title,
//         regular_price,
//         sale_price,
//         short_desc
//     }

//     console.log(data)

// }).catch((e)=>console.log(e))




// ctx.telegram.sendPhoto(ctx.chat.id , `${data.image}`,{
//     reply_markup: {
//         inline_keyboard:[
//             [{text: "Preview" , url: data.links},{text: "Order" , url: data.links}]
//         ]
//     },
//     caption: `<b>${data.title}</b> \n<del>${data.regular_price} </del> ${data.sale_price} \n\n${(data.short_desc).slice(0,80)}...`,
//     parse_mode: "HTML"
// }).catch((e)=>console.log(e))





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
        }else{
            ctx.reply(`Product not found !`)
        }

        pagination(ctx)

    }).catch((e)=>console.log(e))
})








// bot.on('text',ctx=>{
    
//     const input = ctx.update.message.text

//     const findQuery = {
//         $or: [{title: new RegExp( input, "gi")},{short_desc: new RegExp( input, "gi")}]
//     }

//     productModel.find(findQuery).limit(per_page).sort({date: 1}).then((data)=>{
//         if (data.length > 0) {
//             data.map((data)=>{
//                 ctx.telegram.sendPhoto(ctx.chat.id , `${data.image}`,{
//                     reply_markup: {
//                         inline_keyboard:[
//                             [{text: "Preview" , url: data.links},{text: "Order" , url: data.links}]
//                         ]
//                     },
//                     caption: `<b>${data.title}</b> \n<del>${data.regular_price} </del> ${data.sale_price} \n\n${(data.short_desc).slice(0,80)}...`,
//                     parse_mode: "HTML"
//                 }).catch((e)=>console.log(e))
//             })
//         }else{
//             ctx.reply(`Product not found !`)
//         }


//     }).catch((e)=>console.log("error on data search"))

// })

