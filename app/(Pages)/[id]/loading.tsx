import React from 'react'

export default function Loading() {
    return (
        <div className="flex flex-col border rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />

            <div className="p-5 space-y-3">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
        </div>
    )
}
