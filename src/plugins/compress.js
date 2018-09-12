/**
 * Created by joubn on 2018/08/01.
 */
import  MegaPixImage from './megapix/megapix-image'
import 'blueimp-canvas-to-blob'

const compressImgSource = (img,maxW,maxH,quality) => {
	const browser = {
		versions:function(){
			var u = navigator.userAgent;
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
				weixin: u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger', //是否微信
				qq: u.match(/\sQQ/i) == " qq" //是否QQ
			};
		}()
	};
	const canvas = document.createElement('canvas');
	let width = img.width;
	let height = img.height;
	const max_width = maxW || 640;
	const max_height = maxH || 640;
	quality = quality || .7

	if (width > max_width) {
		height *= max_width / width;
		height = Math.round(height);
		width = max_width;
	}
	if(height > max_height){
		width *= max_height / height;
		width = Math.round(width);
		height = max_height;
	}
	canvas.width = width
	canvas.height = height
	const wh = {width, height}
	//将图片放入canvas，并重置canvas大小
	if(browser.versions.ios || browser.versions.webApp){
		var mpImg = new MegaPixImage(img);
		mpImg.render(canvas, { width: width, height: height });
	}else{
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height);
	}
	let resBase64, base64, blob;

	return new Promise((resolve, reject) => {
		resBase64 = canvas.toDataURL("image/jpeg",quality);
		base64 = Object.assign({},wh,{res:resBase64})
		canvas.toBlob(data => {
			blob = Object.assign({},wh,{res:data})
			resolve({base64,blob});
		}, "image/jpeg", quality)
	})
}


const compressImg = ([...files],maxW,maxH,quality) => {
	if(typeof FileReader==='undefined'){
		new Error( '不支持图片上传' );
		return false;
	}

	let arr = [],promArr = [];

	files.forEach(file => {
		if (file.type.indexOf("image") == 0) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			promArr.push(
				new Promise((resolve, reject) => {
					reader.onload = (e) => {
						let image = new Image();
						image.src = e.target.result;
						image.crossOrigin = 'anonymous';
						image.onload = async () => {
						  let res = await compressImgSource(image, maxW, maxH, quality)
							resolve(res);
						}
					};
				})
			)
		}
	})

	return promArr
}

export {compressImg, compressImgSource}
