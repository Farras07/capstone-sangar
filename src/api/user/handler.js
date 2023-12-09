const { nanoid } = require('nanoid')
const admin = require('../../config/firebaseAdmin')
const CartServices = require('../../services/cartServices')
const cartServices = new CartServices()
const WishlistServices = require('../../services/wishlistServices')
const wishlistServices = new WishlistServices()
class UserHandler {
  constructor (services, validator) {
    this._service = services
    this._cartService = cartServices
    this._wishlistService = wishlistServices
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

    if (image !== undefined) {
      const filename = `${userRecord.uid}_${image.originalname}`
      const buffer = image.buffer
      const file = await this._service.uploadUserImage(filename, buffer)
      const imageUrl = `${process.env.GS_URL_USER}/${file}`
      await admin.auth().updateUser(userRecord.uid, {
        photoURL: imageUrl 
      })
      payload.cover = imageUrl
    }
    if (payload.locationLatitude !== undefined && payload.locationLongitude !== undefined) {
      payload.locationLatitude = Number(payload.locationLatitude)
      payload.locationLongitude = Number(payload.locationLongitude)
    }
    const { locationLatitude, locationLongitude, password, ...newObject } = payload 
    const user = {
      ...newObject,
      id: userRecord.uid,
      location_coordinate: {
        latitude: locationLatitude,
        longitude: locationLongitude
      }
    }

    const cartData = {
      id: `cart-${nanoid(16)}`,
      userId: userRecord.uid,
      products: []
    }
    const wishlistData = {
      id: `wishlist-${nanoid(16)}`,
      userId: userRecord.uid,
      products: []
    }
    await this._service.addUser(user)
    await this._cartService.addCart(cartData)
    await this._wishlistService.addWishlist(wishlistData)
    return user.id
  }

  async getUserByUserIdHandler(userId) {
    const user = await this._service.getUserById(userId)
    return user
  }

  async updateUserHandler(payload, userId, userEmail) {
    try {
      const cover = payload.cover !== undefined ? payload.cover : undefined
      await this._validator.validatePutUserPayload(payload)
  
      if (cover !== undefined) payload.cover = cover
      let { locationLatitude: latitude, locationLongitude: longitude, ...newObject } = payload

      if (latitude !== undefined && longitude !== undefined) {
        latitude = Number(latitude)
        longitude = Number(longitude)
        newObject.location_coordinate = {
          latitude,
          longitude
        } 
      } 
      await this._service.updateUser(newObject, userId, userEmail)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
module.exports = UserHandler
