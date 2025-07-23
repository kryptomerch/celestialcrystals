'use client'

import { crystalDatabase } from '@/data/crystals'

export default function TestImages() {
  // Get all unique images from the crystal database
  const allImages = crystalDatabase.reduce((acc, crystal) => {
    if (crystal.images) {
      acc.push(...crystal.images)
    } else if (crystal.image) {
      acc.push(crystal.image)
    }
    return acc
  }, [] as string[])

  // Remove duplicates
  const uniqueImages = [...new Set(allImages)]

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Crystal Images Test</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {allImages.map((imagePath, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white text-sm mb-2">{imagePath.split('/').pop()}</h3>
            <img
              src={imagePath}
              alt={`Crystal ${index + 1}`}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                console.error(`Failed to load image: ${imagePath}`)
                e.currentTarget.style.border = '2px solid red'
              }}
              onLoad={() => {
                console.log(`Successfully loaded: ${imagePath}`)
              }}
            />
            <p className="text-xs text-gray-400 mt-2">{imagePath}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
