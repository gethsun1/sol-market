import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  secureUrl: string
  format: string
  bytes: number
  width: number
  height: number
}

export class ImageUploadService {
  /**
   * Upload image to Cloudinary with optimized settings for marketplace
   */
  static async uploadImage(
    file: File | Buffer,
    folder: string = 'solmarket'
  ): Promise<UploadResult> {
    try {
      // Validate file size (10MB max)
      if (file instanceof File && file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (file instanceof File && !allowedTypes.includes(file.type)) {
        throw new Error('File must be a valid image (JPEG, PNG, WebP, or GIF)')
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const filename = `${timestamp}_${randomString}`

      // Upload to Cloudinary with optimizations
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: filename,
            resource_type: 'image',
            format: 'webp', // Convert to WebP for better compression
            quality: 'auto:good',
            fetch_format: 'auto',
            crop: 'limit',
            width: 1200,
            height: 1200,
            // Add watermark for demo (optional)
            transformation: [
              { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' },
              { overlay: { font_family: 'Arial', font_size: 20, text: 'SolMarket Demo' }, gravity: 'south_east', opacity: 30 }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(file instanceof File ? file : Buffer.from(file))
      })

      const uploadResult = result as any

      return {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
    } catch (error) {
      console.error('Image deletion error:', error)
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate optimized image URL for display
   */
  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: string
    } = {}
  ): string {
    const { width = 400, height = 400, quality = 80, format = 'webp' } = options

    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      gravity: 'auto',
      quality,
      format,
      secure: true,
    })
  }

  /**
   * Generate thumbnail URL
   */
  static getThumbnailUrl(publicId: string, size: number = 150): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      quality: 60,
    })
  }

  /**
   * Generate full-size display URL
   */
  static getDisplayUrl(publicId: string): string {
    return this.getOptimizedUrl(publicId, {
      width: 800,
      height: 800,
      quality: 85,
    })
  }
}
