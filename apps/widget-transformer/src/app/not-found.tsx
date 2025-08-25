export default function NotFound() {
  return (
    <div className="bg-white dark:bg-black h-screen w-screen flex justify-center items-center">
      <div className="text-black dark:text-white flex items-center gap-3">
        <span className="text-3xl font-semibold">404</span>
        <span className="text-base">-</span>
        <span className="text-base">The page could not be found</span>
      </div>
    </div>
  )
}
