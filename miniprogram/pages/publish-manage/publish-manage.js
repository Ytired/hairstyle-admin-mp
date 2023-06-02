import { getUrl } from "../../utils/utils"

// pages/publish-manage/publish-manage.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '',
		content: '',
		show: false,
		list: [],
		fileList: [],
		imgList: [],
		showPreview: false
	},
	onPreview({ currentTarget }) {
		const item = currentTarget.dataset.item
		if (item) {
			this.setData({
				...item,
				showPreview: true
			})
		}
		this.setData({
			showPreview: true
		})
	},
	onPreviewClose() {
		this.setData({
			showPreview: false,
		})
	},
	onCreatePush() {
		this.setData({
			show: true,
			title: '',
			content: '',
			fileList: [],
			imgList: [],
		})
	},
	onPush() {
		if (!this.data.title) return
		this.uploadToCloud()
	},
	onHairstylistClose() {
		this.setData({
			show: false,
			title: '',
			content: '',
			fileList: [],
			imgList: [],
		})
	},
	afterRead(event) {
		const { file } = event.detail;
		const suffix = file.url.split('.').pop();
		file.suffix = suffix;
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		const newFilelist = [...this.data.fileList, file];
		const newImgList = [...this.data.imgList, file]
		this.setData({
			fileList: newFilelist,
			imgList: newImgList
		})
		console.log(file);
	},
	// 删除图片
	onDelete({ detail }) {
		const index = detail.index;

		const img = this.data.imgList[index];
		this.c1.deleteFile({
			fileList: [img.url],
			success: res => {
				wx.showToast({ title: '删除成功', icon: 'none' });
				this.data.imgList.splice(index, 1)
				const newImgList = [...this.data.imgList]
				this.setData({
					imgList: newImgList
				})
				this.db.collection('activity_list').doc(img._id).remove({
					success: function(res) {
						console.log(res)
					}
				})
			},
			fail: console.error
		})
	},

	// 上传图片
	uploadToCloud() {
		const { fileList } = this.data;
		console.log(fileList);
		if (!fileList.length) {
			wx.showToast({ title: '请选择图片', icon: 'none' });
		} else {
			const uploadTasks = fileList.map((file, index) => {
				const timeStamp = new Date().getTime();
				return this.uploadFilePromise(`images/active/${timeStamp}.${file.suffix}`, file)
			});
			Promise.all(uploadTasks)
				.then(data => {
					wx.showToast({ title: '上传成功', icon: 'none' });
					this.data.imgList.pop();
					const newImgList = data.map(item => {
						const data = { url: item.fileID}
						return data
					});
					this.db.collection('activity_list').add({
						data: {
							title: this.data.title,
							content: this.data.title,
							imgList: newImgList,
							createTime: new Date().getTime()
						},
						success: async res => {
							const result = await this.c1.callFunction({
								name: 'getAllData',
								data: {
									tableName: "activity_list"
								}
							})
							this.c1.callFunction({
								name: 'pushActiveNotify',
								data: {
									id: res._id
								}
							})
							wx.showToast({
								title: '推送成功',
								icon: 'success'
							})
							let data = result.result.data;
							data = data.map(item => {
								item.imgList = getUrl(item.imgList)
								return item
							})
							this.setData({
								list: data.reverse()
							})
						}
					})
				})
				.catch(e => {
					wx.showToast({ title: '上传失败', icon: 'none' });
					console.log(e);
				});
		}
	},

	uploadFilePromise(fileName, chooseResult) {
		return this.c1.uploadFile({
			cloudPath: fileName,
			filePath: chooseResult.url
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		await this.initResource()

		this.c1.callFunction({
			name: 'getAllData',
			data: {
				tableName: "activity_list"
			},
			success: res => {
				let data = res.result.data;
				data = data.map(item => {
					item.imgList = getUrl(item.imgList)
					return item
				})
				this.setData({
					list: data.reverse()
				})
			}
		})
	},
	async initResource() {
		this.c1 = new wx.cloud.Cloud({
			// 资源方 AppID
			resourceAppid: 'wx7b32df38a5bc0fe8',
			// 资源方环境 ID
			resourceEnv: 'dev-9gn7qb2y336ba8a5',
		})

		// 跨账号调用，必须等待 init 完成
		// init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
		await this.c1.init()
		this.db = this.c1.database()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})