// pages/appointment-list/appointment-list.js
import dayjs from 'dayjs'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
    option1: [
      { text: '全部门店', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '所有师傅', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
  async onLoad(options) {
		wx.showLoading({ title: '加载中...' })
		const { account, isAdmin } = wx.getStorageSync('userInfo')
		const data = {
			tableName: "appointment",
		}
		if (!isAdmin) {
			data.data = {
				hInfo: {
					account
				}
			}
		}

		await this.initResource()
    this.c1.callFunction({
      name: "getAllData",
      data,
      success: (res) => {
				const data = res.result.data
				// const options = 

				for (const item of data) {
					item.appointmentTime = dayjs(item.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
				}
        this.setData({
          list: data,
				});
				wx.hideLoading()
        console.log(res);
      },
    });
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
	onOpenPhone({ currentTarget }) {
		const phone = currentTarget.dataset.itemdata.userInfo.phoneNumber
		wx.makePhoneCall({
			phoneNumber: phone
		})
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