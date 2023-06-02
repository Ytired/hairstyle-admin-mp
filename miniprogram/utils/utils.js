export function getUrl(files) {
	if (!files) return []
	for (var i = 0; i < files.length; i++) {
		if (files[i].url.substring(0, 5) == 'cloud') {
			files[i].fileid = files[i].url
			var arr = files[i].url.split('/')
			arr[0] = 'https:'
			arr[2] = arr[2].split('.')[1] + '.tcb.qcloud.la'
			files[i].url = arr.join('/')
		}
	}

	return files
}
