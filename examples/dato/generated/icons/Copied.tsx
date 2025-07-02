import * as React from 'react'
import type { SVGProps } from 'react'
const SvgCopied = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={19}
    fill="none"
    viewBox="0 0 15 15"
    {...props}
  >
    <path d="M5 3.333H3.333V5H5zm0 3.334H3.333v1.666H5zM5 0c-.925 0-1.667.75-1.667 1.667H5zm3.333 10H6.667v1.667h1.666zm5-10v1.667H15C15 .75 14.25 0 13.333 0m-5 0H6.667v1.667h1.666zM5 11.667V10H3.333c0 .917.742 1.667 1.667 1.667m8.333-3.334H15V6.667h-1.667zm0-3.333H15V3.333h-1.667zm0 6.667c.917 0 1.667-.75 1.667-1.667h-1.667zM1.667 3.333H0v10C0 14.25.742 15 1.667 15h10v-1.667h-10zM10 1.667h1.667V0H10zm0 10h1.667V10H10z" />
  </svg>
)
export default SvgCopied
