import Image from "next/image"
interface Props {
  className?: string;
  color?: string;
  check?: boolean
  text?: string;
  menu?: string;
  image?: {
    url: string
    dimensions: {
      width: number
      height: number
    }
  };
  banner: {
    text: string;
    background: string;
  };
}
export function Circle({ className, banner, color, text, check, menu, image}: Props) {
  return (
    <>
      <div className={className} style={{ alignContent: "center", background: color}}>
        <div>{text}</div>
        {check && <div>Check is true!</div>}
        <div>{menu}</div>
        <div className="p-4 rounded shadow">
          {image && (
            <Image
              alt = "image test"
              src={image.url}
              width={image.dimensions.width}
              height={image.dimensions.height}
            />
          )}
        </div>
        <div className="p-20" style={{ backgroundColor: banner.background }}>
          <p className="text-center">{banner.text}</p>
        </div>
      </div>
    </>
  )
}