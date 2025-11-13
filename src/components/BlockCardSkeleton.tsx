export default function BlockCardSkeleton() {
  return (
    <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-6 bg-arc-gray-light rounded w-24 mb-2"></div>
          <div className="h-4 bg-arc-gray-light rounded w-32"></div>
        </div>
        <div className="h-4 bg-arc-gray-light rounded w-20"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="h-3 bg-arc-gray-light rounded w-16"></div>
          <div className="h-4 bg-arc-gray-light rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-arc-gray-light rounded w-16"></div>
          <div className="h-4 bg-arc-gray-light rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-arc-gray-light rounded w-16"></div>
          <div className="h-4 bg-arc-gray-light rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-arc-gray-light rounded w-16"></div>
          <div className="h-4 bg-arc-gray-light rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}

