import { getUrl } from "../../utils/utils"

// pages/index/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
		nickName: 'admin',
		isAdmin: false
	},
	onLoginOut() {
		wx.showModal({
			title: '提示',
			content: '确定要退出登录吗',
			success (res) {
				if (res.confirm) {
					wx.removeStorageSync('userInfo')
					wx.navigateTo({
						url: '../login/login',
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
	},
	onAddPush() {
		wx.requestSubscribeMessage({
			tmplIds: ['1YgT4SMUWTNuEABQIL6v6lQnonFk8aQAkowqDoBNmpE'],
			complete: res => {
				console.log(res);
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		await this.initResource();
		const { account, password, isAdmin } = wx.getStorageSync("userInfo");
		if (isAdmin) {
			this.setData({
				isAdmin: true
			})

			return
		};

		const { data } = await this.db
		.collection("hair_stylist")
		.where({ account })
		.get();

		const info = data[0];
		this.setData({
			avatar: getUrl([{ url: info.url }])[0].url,
			nickName: info.hairstylistName,
			isAdmin: false
		})
	},
	async initResource() {
    this.c1 = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: "wx7b32df38a5bc0fe8",
      // 资源方环境 ID
      resourceEnv: "dev-9gn7qb2y336ba8a5",
    });

    // 跨账号调用，必须等待 init 完成
    // init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
    const res = await this.c1.init();
    this.db = this.c1.database();
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