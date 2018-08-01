/**
 * Created by joubn on 2018/08/01.
 */

const compressImgSource = (img,maxW,maxH,quality) => {

	let canvas = document.createElement('canvas');
	let width = img.width;
	let height = img.height;
	let max_width = maxW || 640;
	let max_height = maxH || 640;
	quality = quality || 1

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
	canvas.width = width;
	canvas.height = height;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

	let resBase64, resBlob, imgInfo={base64:{},blob:{}};

	return new Promise((resolve, reject) => {

		resBase64 = canvas.toDataURL("image/jpeg",quality); // 截取canvas对应的jpg图片，并且画质为70%（默认就是70%，可以改变）
		imgInfo.base64.res = resBase64
		imgInfo.base64.width = canvas.width
		imgInfo.base64.height = canvas.height

		canvas.toBlob(blob => {
			resBlob = blob
			imgInfo.blob.res = resBlob
			imgInfo.blob.width = canvas.width
			imgInfo.blob.height = canvas.height
			resolve(imgInfo);
		}, "image/jpeg", quality)
	})

}


const compressImg = (files,maxW,maxH,quality) => {
	if(typeof FileReader==='undefined'){
		new Error( '不支持图片上传' );
		return false;
	}
	files = Array.prototype.slice.call(files)
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
							image.onload = () => {
								compressImgSource(image, maxW, maxH, quality).then(res=>{
									resolve(res);
								})
							}
						};
					})
				)
			}
		})

	return promArr
}

export {compressImg, compressImgSource}
