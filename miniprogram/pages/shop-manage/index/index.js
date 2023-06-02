// pages/shop-manage/index/index.js
import { getUrl } from '../../../utils/utils'
let db = null
let shop = null
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shops: []
	},
	onCreateShop() {
		wx.navigateTo({
			url: '../edit/edit',
		})
		console.log('创建门店');
	},
	onItemTap({ currentTarget }) {
		const id = currentTarget.dataset.id;
		wx.navigateTo({
			url: `../edit/edit?id=${id}`,
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {

		// shop.get().then(res => {
		// 	this.setData({
		// 		shops: res.data
		// 	})
		// 	console.log(res);
		// })
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
		db = this.db;
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow() {
		await this.initResource()
		shop = db.collection('shop')
		shop.get().then(res => {
			this.setData({
				shops: getUrl(res.data)
			})
			console.log(res);
		})
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