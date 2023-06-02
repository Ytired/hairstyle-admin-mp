const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const hairstyList = db.collection('hair_stylist')
const projectList = db.collection('project_list')
exports.main = async(event, context) => {
  let {
		id,
		url
  } = event
  try {
		const cols = [hairstyList, projectList]
		cloud.deleteFile({
			fileList: [url]
		})
		const tasks = cols.map(conn => {
			return conn.where({
				shopID: id
			}).remove()
		})

		return await Promise.all(tasks)

  } catch (e) {
    console.error(e)
  }
}