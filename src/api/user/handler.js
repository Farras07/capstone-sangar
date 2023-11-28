const { nanoid } = require('nanoid')
const admin = require('../../config/firebaseAdmin')
class UserHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }

  async postUserHandler (payload, image) {
    await this._validator.validatePostUserPayload(payload)
    const userRecord = await admin.auth().createUser({
      displayName: payload.username,
      email: payload.email,
      password: payload.password,
      // phoneNumber: payload.contact,
      emailVerified: true,
      disabled: false
    })
    const filename = `${userRecord.uid}_${image.originalname}`
    const buffer = image.buffer
    const file = await this._service.uploadUserImage(filename, buffer)
    const imageUrl = `${process.env.GS_URL_USER}/${file}`
    
    await admin.auth().updateUser(userRecord.uid, {
      photoURL: imageUrl 
    })
    
    const user = {
      id: userRecord.uid,
      fullname: payload.fullname,
      username: payload.username,
      email: payload.email,
      address: payload.address,
      location_coordinate: payload.location_coordinate,
      contact: payload.contact,
      image: imageUrl,
      isSeller: false
    }
    await this._service.addUser(user)
    return user.id
  }
}
module.exports = UserHandler
