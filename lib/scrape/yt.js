const axios = require('axios'), fs = require('fs')


/**
 * Download YouTube Video via y2mate
 * @param {String} url YouTube Video URL
 * @param {String} quality (avaiable: 360p, 480p, 720p, 1080p)
 * (avaiable for audio: ``)
 * @param {String} type (avaiable: video, audio)
 */

const qualityV = ['360p', '480p', '720p', '1080p']
const qualityA = ['128kbps']

function y2mate(url) {
  return new Promise((resolve, reject) => {
    var reg = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/
    var id = url.match(reg)[1]
    var data_post = { k_query: url, k_page: 'home', hl: 'en', q_auto: 0 };
    var params = new URLSearchParams(Object.entries(data_post)).toString()
    axios('https://www.y2mate.com/mates/analyzeV2/ajax', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
      },
      method: 'POST',
      data: params
      
    }).then(({ data }) => {
      var hasil = {
        id: id,
        video: {},
        audio: {}
      }
      /** UNTUK VIDEO NYA*/
      //watashi buat filter untuk type "mp4" ama quality "360p - 1080p"
      const mp4 = Object.values(data.links.mp4).filter(obj => obj.f === "mp4" && /(360|480|720|1080)p/.test(obj.q)); 
      //watashi buat mapping untuk ngisi object json "video" di variabel "data"
      mp4.map(obj => { hasil.video[obj.q] = { size: obj.size, type: obj.f, targetConvert: obj.k } })

      /** UNTUK AUDIO NYA */
      const mp3 = Object.values(data.links.mp3)
      mp3.map(obj => { hasil.audio[obj.q] = { size: obj.size, type: obj.f, targetConvert: obj.k } })

      resolve(hasil)
    })
  })
}



function ytconvert(id, code_id) {
  return new Promise((resolve, reject) => {
    var postdata = { vid: id, k: code_id }
    var params = new URLSearchParams(Object.entries(postdata)).toString()
    axios('https://www.y2mate.com/mates/convertV2/index', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
      },
      data: params
    }).then(({ data }) => {
      resolve(data)
    })
  })
}




function youtubedl(url, type, quality) {
  return new Promise(async(resolve, reject) => {
    let kualitas
    switch(type) {
      case 'video':
        if(/https?:\/\/(?:www\.)?(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]+)/.test(url)) {
          kualitas = "720p"
        } else {
          kualitas = (quality ? (quality.includes(quality.match(/(\d+p)/)?.[1]) ? quality.match(/(\d+p)/)?.[1] : "480p") : '480p');
        }
      break
      case 'audio': 
        kualitas = '128kbps'
      break
    }
    var ex = await y2mate(url);
    var id = ex.id;
    var targetId = ex[type][kualitas].targetConvert;
    var size = ex[type][kualitas].size;
    var thumb = `https://i.ytimg.com/vi/${id}/0.jpg`
    var aw = await ytconvert(id, targetId);
    var { title, ftype, fquality, dlink } = aw
    resolve({
      status: true,
      creator: 'CAF',
      data: { id, thumb, title, ftype, fquality: kualitas, size, dlink }
    })
  })
}



module.exports = {
  youtubedl,
  youtubeAudio(url, kualitas){ 
    return youtubedl(url, 'audio', '128kbps')
  },
  youtubeVideo(url, kualitas){
    return youtubedl(url, 'video', kualitas)
  }
}
