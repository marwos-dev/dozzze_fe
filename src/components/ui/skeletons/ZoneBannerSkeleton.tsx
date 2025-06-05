'use client';

const ZoneBannerSkeleton = ({ height = 180 }: { height?: number }) => (
  <div
    className={`w-full rounded-xl overflow-hidden bg-gray-300 animate-pulse`}
    style={{ height }}
  ></div>
);

export default ZoneBannerSkeleton;
