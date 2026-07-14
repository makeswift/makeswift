type Props = {
  className?: string
  image?: string
}

export function GalleryDemo({ className, image }: Props) {
  return (
    <div className={className}>
      {image != null ? (
        // eslint-disable-next-line @next/next/no-img-element -- demo renders arbitrary remote URLs; next/image would require remote-domain config
        <img src={image} alt="" style={{ maxWidth: 240 }} />
      ) : (
        <p>(no image selected)</p>
      )}
    </div>
  )
}

export default GalleryDemo
