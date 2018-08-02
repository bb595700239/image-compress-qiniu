/**
 * Created by joubn on 2018/08/01.
 */

const compressImgSource = (img,maxW,maxH,quality) => {

	const canvas = document.createElement('canvas');
	let width = img.width;
	let height = img.height;
	const max_width = maxW || 640;
	const max_height = maxH || 640;
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
	canvas.width = width
	canvas.height = height
	const wh = {width, height}
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

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
