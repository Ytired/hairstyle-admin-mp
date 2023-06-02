// pages/login/login.js
import Notify from "@vant/weapp/notify/notify";
const { globalData } = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: "",
    password: "",
  },
  async onLogin() {
    const account = this.data.account;
    const password = this.data.password;

    if (!account || !password) {
      return Notify({ type: "danger", message: "请输入账号或密码" });
    }

    if (account === "admin" && password === "admin") {
      const data = {
        account,
        password,
        isAdmin: true,
      };
      wx.setStorageSync("userInfo", data);
      wx.navigateTo({
        url: "../index/index",
      });
      return;
    }

    const { data } = await this.db
      .collection("hair_stylist")
      .where({ account })
      .get();
    if (data.length && password === "123456") {
      const info = data[0];
      if (info.account === account) {
        const data = {
          account,
          password,
          isAdmin: false,
        };
        wx.setStorageSync("userInfo", data);
        wx.navigateTo({
          url: "../index/index",
        });
        return;
      }
    }

    Notify({ type: "danger", message: "用户名或密码错误" });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.initResource();
    const { account, password } = wx.getStorageSync("userInfo");
    if (account && password) {
      wx.navigateTo({
        url: "../index/index",
      });
    }
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
    console.log(res);
    this.db = this.c1.database();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
