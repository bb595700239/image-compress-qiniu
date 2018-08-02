<template>
  <div id="app">
    <div class="form-group">
      最大宽度：<input type="number" v-model="maxW">
    </div>
    <div class="form-group">
      最大高度：<input type="number" v-model="maxH">
    </div>
    <div class="form-group">
      图片质量：<input type="range" id="myRange" v-model="quality" max="1" min="0" step=".1">
    </div>
    <div class="form-group">
      <input type="file" @change="fileChange" multiple>
    </div>

    <div class="img-box">
      <img :src="img.base64.res" alt="" v-for="(img,index) in imgs" @click="detele(index)" :key="index">
    </div>
    <div class="url-box">
      <div class="url" v-for="(img,index) in imgs" :key="index">{{img.src}}</div>
    </div>
  </div>
</template>

<script>
  import { compressImg } from  './plugins/compress'
  import {token,action,domain} from "./plugins/qiniuToken";
  import axios from 'axios'
  export default {
    name: 'app',
    data () {
      return {
        imgs: [],
        maxW: 640,
        maxH: 640,
        quality: 1
      }
    },
    methods: {
	    async fileChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        const res = await Promise.all(compressImg(files,this.maxW,this.maxH,this.quality))
        this.imgs = this.imgs.concat(res)
        this.postQiniu()
      },
      detele(i) {
        this.imgs.splice(i,1)
      },
      postQiniu() {
        this.imgs.forEach((item, index) => {
          let formdata = new FormData()
          formdata.append('token',token())
          formdata.append('file',item.blob.res)
          axios.post(action,formdata).then(res => {
            item.src = domain+res.data.hash
            this.$set(this.imgs,index,item)
          })
        })
      }
    }
  }
</script>

<style scoped>
  .img-box{
    margin-top: 30px;
  }
 img{
   width: 100px;
   height: 100px;
   border-radius: 5px;
   overflow: hidden;
   background-color: #f0f0f0;
   object-fit: contain;
   border: 1px solid #ccc;
   margin-right: 20px;
   cursor: pointer;
 }
  .form-group{
    margin-top: 10px;
  }
</style>
