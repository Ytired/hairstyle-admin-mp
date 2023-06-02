// pages/shop-manage/edit/edit.js
import { areaList } from '@vant/area-data';
import Notify from '@vant/weapp/notify/notify';
import { getUrl } from '../../../utils/utils';
let shop = null
let hairstyList = null
let projectList = null
let connHairProject = null
let db = null
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		showAddress: false,
		shopName: '',
		shopDesc: '',
		openingHours: '',
		address: '',
		detailAddress: '',
		addressCode: '',
		imgList: [],
		activeNames: [],
		account: '',
		password: '',
		longitude: null,
		latitude: null,
		phoneNumber: null,
		
		//发型师popup
		showHairstylist: false,
		hairstylist: [],
		hID: '', //发型师id
		hairstylistName: '',
		hairstylistExp: '',
		hairstylistImgs: [],
		position: '',
		// checkboxList: ['a', 'b', 'c'],
		checkboxList: [],
		checkboxValueList: [],
		
		//项目
		showProject: false,
		pID: '',
		projectList: [],
		projectName: '',
		projectCategory: '',
		projectPrice: '',
		projectTime: '',
		projectDesc: ''

	},
	async onPopupShow() {
		let valueList = []
		const res = await projectList.where({ shopID: this.data.id }).get()
		if (this.data.hID) {
			const valueRes = await connHairProject.where({
				hID: this.data.hID
			}).get()
			valueList = valueRes.data.map(item => item.pID)
			console.log(1111, valueRes);
		}
		this.setData({
			checkboxList: res.data,
			checkboxValueList: valueList
		})
	},
	// 添加项目
	onAddProject() {
		if (!this.data.id) {
			return Notify({
				message: `请先添加门店，再进行该操作`,
				type: 'warning'
			})
		}

		this.setData({
			showProject: true,
			pID: '',
			projectName: '',
			projectCategory: '',
			projectPrice: '',
			projectTime: '',
			projectDesc: ''
		})
	},
	onProjectDetail({ currentTarget }) {
		const info = currentTarget.dataset.info

		this.setData({
			...info,
			pID: info._id,
			showProject: true,
		})
	},
	onDelProject({ currentTarget }) {
		const id = currentTarget.dataset.id
		wx.showModal({
			title: '警告',
			content: '确认要删除该项目吗',
			confirmColor: '#dc001e',
			success: res => {
				if (res.confirm) {
					this.c1.callFunction({
						name: 'remove',
						data: {
							data: {
								pID: id
							},
							table: 'conn_hair_project'
						}
					})
					projectList.doc(id).remove({
						success: () => {
							projectList.get({
								success: res => {
									this.setData({
										projectList: res.data,
										showProject: false
									})
								}
							})
							wx.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
					})
				}
			}
		})
	},
	onProjectClose() {
		this.setData({
			showProject: false
		})
	},
	onClickProject() {
		const filedMap = {
			projectName: '项目名',
			projectCategory: '项目分类',
			projectPrice: '项目价格',
			projectTime: '项目预计时间',
			projectDesc: '项目描述'
		}

		for (const key in filedMap) {
			if (!this.data[key]) {
				return Notify({
					message: `请填写${filedMap[key]}`,
					type: 'danger'
				})
			}
		}

		this.saveProjectInfo()
	},
	saveProjectInfo() {
		wx.showLoading()
		const pID = this.data.pID
		const id = this.data.id
		const data = {
			shopID: id,
			projectName: this.data.projectName,
			projectCategory: this.data.projectCategory,
			projectPrice: this.data.projectPrice,
			projectTime: this.data.projectTime,
			projectDesc: this.data.projectDesc,
		}

		if (pID) {
			console.log('更新数据');
			projectList.doc(pID).update({
				data,
				success: () => {
					projectList.where({
						shopID: id
					}).get({
						success: res => {
							wx.hideLoading()
							this.setData({
								projectList: res.data,
								showProject: false
							})
						}
					})
				}
			})
		} else {
			projectList.add({
				data: {
					...data,
					createTime: db.serverDate()
				},
				success: () => {
					projectList.where({
						shopID: id,
					}).get({
						success: res => {
							wx.hideLoading()
							this.setData({
								projectList: res.data,
								showProject: false
							})
						}
					})
				},
				fail(err) {
					wx.hideLoading()
					Notify({ type: 'danger', message: '保存失败' });
					console.log(err);
				}
			})
		}
	},
	
	// 添加发型师
	onAddHairstylist() {
		if (!this.data.id) {
			return Notify({
				message: `请先添加门店，再进行该操作`,
				type: 'warning'
			})
		}

		this.setData({
			hID: '', //发型师id
			hairstylistName: '',
			hairstylistExp: '',
			hairstylistImgs: [],
			checkboxValueList: [],
			showHairstylist: true,
			position: ''
		})
	},
	onDetailUser({ currentTarget }) {
		const info = currentTarget.dataset.info

		this.setData({
			...info,
			hID: info._id,
			showHairstylist: true,
			hairstylistImgs: [{ url: info.url }],
			position: info.position || ''
		})
	},
	onDeleteUser({ currentTarget }) {
		const id = currentTarget.dataset.id
		wx.showModal({
			title: '警告',
			content: '确认要删除该发型师吗',
			confirmColor: '#dc001e',
			success: res => {
				if (res.confirm) {
					this.c1.callFunction({
						name: 'remove',
						data: {
							data: {
								hID: id
							},
							table: 'conn_hair_project'
						}
					})
					hairstyList.doc(id).remove({
						success: () => {
							hairstyList.get({
								success: res => {
									this.setData({
										hairstylist: getUrl(res.data),
										showHairstylist: false
									})
								}
							})
							wx.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
					})
				}
			}
		})
	},
	//发型师弹窗关闭
	onHairstylistClose() {
		this.setData({
			showHairstylist: false,
			checkboxValueList: []
		})
	},
	onClickHairstylist() {
		const filedMap = {
			hairstylistName: '姓名',
			hairstylistExp: '从业年限',
			account: '账号'
		}

		for (const key in filedMap) {
			if (!this.data[key]) {
				return Notify({
					message: `请填写${filedMap[key]}`,
					type: 'danger'
				})
			}
		}

		if (!this.data.hairstylistImgs.length) {
			return Notify({
				message: `请上传发型师图片`,
				type: 'danger'
			})
		}
		console.log('保存');
		this.saveHairstylistInfo()
	},
	async saveHairstylistInfo() {
		wx.showLoading()
		const hID = this.data.hID
		const id = this.data.id
		const data = {
			shopID: id,
			hairstylistName: this.data.hairstylistName,
			hairstylistExp: this.data.hairstylistExp,
			position: this.data.position,
			account: this.data.account
		}
		const file = this.data.hairstylistImgs.pop();
		if (!file.url.includes('/images')) {
			const res = await this.uploadFilePromise(file.fileName, file)
			data.url = res.fileID;
		}

		if (hID) {
			console.log('更新数据');
			await hairstyList.doc(hID).update({ data })
			const res = await hairstyList.where({ shopID: id }).get()
			const removeRes = await this.c1.callFunction({
				name: 'remove',
				data: {
					data: {
						hID
					},
					table: 'conn_hair_project'
				}
			})
			const all = this.data.checkboxValueList.map(item => this.addProject({ hID, pID: item, shopID: id }))
			await Promise.all(all)

			console.log(removeRes);
			this.setData({
				hairstylist: getUrl(res.data),
				showHairstylist: false
			})
		} else {
			hairstyList.add({
				data: {
					...data,
					createTime: db.serverDate()
				},
				success: (res) => {
					this.data.checkboxValueList.map(item => this.addProject({ hID: res._id, pID: item, shopID: id }))
					hairstyList.where({
						shopID: id
					}).get({
						success: res => {
							this.setData({
								hairstylist: getUrl(res.data),
								showHairstylist: false
							})
						}
					})
				},
				fail(err) {
					Notify({ type: 'danger', message: '保存失败' });
					console.log(err);
				}
			})
		}
		wx.hideLoading()
	},
	addProject(data) {
		return connHairProject.add({data: {
			...data,
			createTime: db.serverDate()
		}})
	},
	onCollapseChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
	showAddress() {
		this.setData({
			areaList,
			showAddress: true
		})
	},
	onAddressConfirm({ detail }) {
		const values = detail.values
		const address = values.map(value => value.name).join(' ')
		console.log(address);
		this.setData({
			showAddress: false,
			address,
			addressCode: values.pop().code
		})
	},
	// 地址弹窗关闭
	onAddressCancel() {
		this.setData({
			showAddress: false
		})
	},
	afterRead(event) {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		const { file } = event.detail;
		const timeStamp = new Date().getTime();
		const suffix = file.url.split('.').pop();
		const newImgList = []
		if (this.data.showHairstylist) {
			file.fileName = `images/hairstylist-avatar/${timeStamp}.${suffix}`
			newImgList.push(file)
			this.hairstylistAfterRead(newImgList)
		} else {
			file.fileName = `images/shop-image/${timeStamp}.${suffix}`
			newImgList.push(file)
			this.shopAfterRead(newImgList)
		}
		
	},
	hairstylistAfterRead(imgList) {
		if (this.data.hairstylistImgs.length) {
			return Notify({
				message: `只能上传一张图片`,
				type: 'warning'
			})
		}

		this.setData({
			hairstylistImgs: imgList
		})
	},
	shopAfterRead(imgList) {
		if (this.data.imgList.length) {
			return Notify({
				message: `只能上传一张图片`,
				type: 'warning'
			})
		}

		this.setData({
			imgList
		})
	},

	uploadFilePromise(fileName, chooseResult) {
		console.log(fileName, chooseResult);
		return this.c1.uploadFile({
			cloudPath: fileName,
			filePath: chooseResult.url
		});
	},
	// 删除头像
	onDeleteAvatar() {
		const img = this.data.hairstylistImgs.pop();
		if (!img.url.includes('/images')) {
			wx.showToast({ title: '删除成功', icon: 'none' });
		 	return this.setData({
				hairstylistImgs: []
			})
		}

		this.c1.deleteFile({
			fileList: [img.url],
			success: res => {
				wx.showToast({ title: '删除成功', icon: 'none' });
				const newImgList = []
				this.setData({
					hairstylistImgs: newImgList
				})
				hairstyList.doc(this.data.hID).update({
					data: {
						url: ''
					},
					success: function(res) {
						console.log(res)
					}
				})
			},
			fail: console.error
		})
	},
	// 删除图片
	onDeleteShopImg() {
		const img = this.data.imgList.pop();
		if (!img.url.includes('/images')) {
			wx.showToast({ title: '删除成功', icon: 'none' });
		 	return this.setData({
				imgList: []
			})
		}

		this.c1.deleteFile({
			fileList: [img.url],
			success: res => {
				wx.showToast({ title: '删除成功', icon: 'none' });
				const newImgList = []
				this.setData({
					imgList: newImgList
				})
				shop.doc(this.data.id).update({
					data: {
						url: ''
					},
					success: function(res) {
						console.log(res)
					}
				})
			},
			fail: console.error
		})
	},
	// 删除店铺
	onDel() {
		wx.showModal({
			title: '提示',
			content: '确认要删除门店吗',
			success: res => {
				if (res.confirm) {
					const img = this.data.imgList.pop();
					console.log(img.url);
					this.c1.callFunction({
						name: 'remove',
						data: {
							data: {
								shopID: this.data.id
							},
							table: 'conn_hair_project'
						}
					})
					this.c1.callFunction({
						name: 'removeShopInfo',
						data: {
							id: this.data.id,
							url: img.url
						}
					}).then(res => {
						shop.doc(this.data.id).remove({
							success: () => {
								wx.showToast({
									title: '删除成功',
									icon: 'success',
									success: () => {
										wx.navigateTo({
											url: '../index/index',
										})
									}
								})
							},
							fail: () => {
								wx.showToast({ title: '删除失败', icon: 'error' });
							}
						})
					}).catch(err => {
						console.log(err);
						wx.showToast({ title: '删除失败', icon: 'error' });
					})
				}
			}
		})
	},
	// 保存店铺信息
	async onSave() {
		const filedMap = {
			shopName: '门店名',
			shopDesc: '门店描述',
			openingHours: '营业时间',
			address: '门店地址',
			detailAddress: '门店详细地址',
			longitude: '经度',
			latitude: '维度',
			phoneNumber: '门店电话'
		}

		for (const key in filedMap) {
			if (!this.data[key]) {
				return Notify({
					message: `请填写${filedMap[key]}`,
					type: 'danger'
				})
			}
		}

		if (!this.data.imgList.length) {
			return Notify({
				message: `请上传门店图片`,
				type: 'danger'
			})
		}

		wx.showLoading()
		if (this.data.id) {
			this.updateShopInfo()
		} else {
			this.addShopInfo()
		}
	},

	async addShopInfo() {
		const data = {
			shopName: this.data.shopName,
			shopDesc: this.data.shopDesc,
			openingHours: this.data.openingHours,
			address: this.data.address,
			detailAddress: this.data.detailAddress,
			addressCode: this.data.addressCode,
			longitude: this.data.longitude,
			latitude: this.data.latitude,
			phoneNumber: this.data.phoneNumber
		}
		const file = this.data.imgList.pop()
		if (!file.url.includes('/images')) {
			const res = await this.uploadFilePromise(file.fileName, file)
			data.url = res.fileID;
		}
		shop.add({
			data: {
				...data,
				createTime: db.serverDate()
			},
			success: (res) => {
				const imgList = data.url ? [{ url: data.url }] : [file]
				this.setData({
					id: res._id,
					imgList: getUrl(imgList)
				})
				Notify({
					message: '保存成功',
					type: 'success'
				})
			},
			fail() {
				Notify({
					message: '保存失败',
					type: 'danger'
				})
			},
			complete() {
				wx.hideLoading()
			}
		})
	},

	async updateShopInfo() {
		const data = {
			shopName: this.data.shopName,
			shopDesc: this.data.shopDesc,
			openingHours: this.data.openingHours,
			address: this.data.address,
			detailAddress: this.data.detailAddress,
			addressCode: this.data.addressCode,
			longitude: this.data.longitude,
			latitude: this.data.latitude,
			phoneNumber: this.data.phoneNumber
		}
		const file = this.data.imgList.pop()
		if (!file.url.includes('/images')) {
			const res = await this.uploadFilePromise(file.fileName, file)
			data.url = res.fileID;
		}

		shop.doc(this.data.id).update({
			data,
			success() {
				Notify({
					message: '保存成功',
					type: 'success'
				})
			},
			fail() {
				Notify({
					message: '保存成功',
					type: 'danger'
				})
			},
			complete() {
				wx.hideLoading()
			}
		})
	},
	initHairstylist(id) {
		hairstyList.where({
			shopID: id
		}).get({
			success: (res) => {
				this.setData({
					hairstylist: getUrl(res.data)
				})
			}
		})
	},
	initShopInfo(id) {
		shop.doc(id).get({
			success: (res) => {
				const imgList = []

				if (res.data.url) {
					imgList.push({
						url: res.data.url
					})
				}
				this.setData({
					...res.data,
					id,
					imgList: getUrl(imgList)
				})
			}
		})
	},
	initProjectList(id) {
		projectList.where({
			shopID: id
		}).get({
			success: (res) => {
				this.setData({
					projectList: res.data
				})
			}
		})
	},
	onChange(event) {
		console.log(event.detail);
    this.setData({
      checkboxValueList: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
		checkbox.toggle();
  },

  noop() {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		const id = options.id;
		await this.initResource()
		shop = this.db.collection('shop')
		hairstyList = this.db.collection('hair_stylist')
		projectList = this.db.collection('project_list')
		connHairProject = this.db.collection('conn_hair_project')
		if (id) {
			this.initShopInfo(id)
			this.initHairstylist(id)
			this.initProjectList(id)
		}
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