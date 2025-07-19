'use client'

export default function TestImages() {
  const testImages = [
    '/images/crystals/TIGER_EYE/TG1.png',
    '/images/crystals/AQUAMARINE/AQ1.png',
    '/images/crystals/CITRINE/CI1.png',
    '/images/crystals/GREEN_JADE/GJ1.png',
    '/images/crystals/TURQUOISE/TU1.png',
    '/images/crystals/RHODOCHROSITE/RW1.png',
    '/images/crystals/HOWLITE/HW2.png',
    '/images/crystals/TREE_AGATE/TG1.png'
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Crystal Images Test</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {testImages.map((imagePath, index) => (
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
